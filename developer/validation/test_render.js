"use strict";
// Independent full-signal oracle and partition tests, not a native Max test.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const base = path.resolve(__dirname, "..");
const Plan = require(path.join(base, "apg_wave_plan.js"));
const Render = require(path.join(base, "apg_render.js"));
let checks = 0, plans = 0, readCalls = 0, maxDifference = 0, maxReflectionError = 0;
function check(value, label) { checks++; assert.ok(value, label); }
function rng(seed) { let s=seed>>>0; return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;}; }
function makeSource(name, count, sr, channels) {
  const data = Array.from({length:channels},(_,ch)=>Float64Array.from({length:count},(_,i)=>
    .61*Math.sin(i*.173+ch*.43)+.21*Math.cos(i*i*.008+ch*.71)+.03*i/count));
  return {meta:{name,frames:count,durationMs:1000*count/sr,channels},data};
}
const fixtures=[makeSource("a",167,44100,1),makeSource("b",211,32000,2),makeSource("c",147,48000,2)];
function readFor(inputs, scalar=false) {
  return (slot,channel,start,count)=>{
    readCalls++;
    check(Number.isInteger(start)&&Number.isInteger(count)&&start>=0&&count>0&&start+count<=inputs[slot].meta.frames,"bounded contiguous source read");
    check(channel>=1&&channel<=inputs[slot].meta.channels,"valid source channel");
    const data=inputs[slot].data[channel-1].slice(start,start+count);
    return scalar&&count===1 ? data[0] : data;
  };
}
function oracle(plan,inputs) {
  const left=new Float64Array(plan.totalFrames),right=new Float64Array(plan.totalFrames);
  for(let n=0;n<plan.totalFrames;n++){
    for(const event of plan.events){
      const k=n-event.startFrame;
      if(k<0||k>=event.lengthFrames)continue;
      const phase=k/(event.lengthFrames-1);
      const env=Math.max(0,Math.min(1,phase*100,(1-phase)*100));
      const input=inputs[event.slot],source=input.meta;
      const pos=Math.max(0,Math.min(source.frames-1,(event.positionStartMs+phase*event.positionDeltaMs)*source.frames/source.durationMs));
      const i=Math.floor(pos),j=Math.min(i+1,source.frames-1),alpha=pos-i;
      const factor=event.amplitude*.8*(source.channels===1?Math.SQRT1_2:1)*plan.normalization*env;
      const l=input.data[0][i]*(1-alpha)+input.data[0][j]*alpha;
      const c=source.channels===1?0:1;
      const r=input.data[c][i]*(1-alpha)+input.data[c][j]*alpha;
      left[n]+=l*factor;right[n]+=r*factor;
    }
    left[n]=Math.max(-.99,Math.min(.99,left[n]));right[n]=Math.max(-.99,Math.min(.99,right[n]));
  }
  return {left,right};
}
function compare(actual,expected,label,tolerance=2e-11){
  check(actual.length===expected.length,label+" length");
  for(let i=0;i<actual.length;i++){
    const d=Math.abs(actual[i]-expected[i]);maxDifference=Math.max(maxDifference,d);
    check(Number.isFinite(actual[i])&&d<=tolerance,label+" sample "+i);
  }
}
function partitioned(plan,inputs,blockSizes){
  const left=[],right=[];let cursor=0,index=0,peak=0;
  const read=readFor(inputs,true);
  while(cursor<plan.totalFrames){
    const count=blockSizes[index++%blockSizes.length];
    const out=Render.renderChunk(plan,inputs.map(s=>s.meta),cursor,count,read);
    check(out.left.length===Math.min(count,plan.totalFrames-cursor),"final chunk is shortened");
    check(out.left.length===out.right.length,"stereo chunk channel lengths match");
    let actualPeak=0;
    for(let i=0;i<out.left.length;i++){left.push(out.left[i]);right.push(out.right[i]);actualPeak=Math.max(actualPeak,Math.abs(out.left[i]),Math.abs(out.right[i]));}
    check(actualPeak===out.peak,"reported peak matches clamped output");
    peak=Math.max(peak,out.peak);cursor+=out.left.length;
  }
  return{left,right,peak};
}
for(let seed=1;seed<=24;seed++){
  const sr=[8000,44100,48000,96000][seed%4],repeats=seed%4===0?[20,20,20]:[1+seed%7,2+seed%11,3+seed%17];
  const random=seed===24?()=>1-Number.EPSILON:rng(seed);
  const plan=Plan.makePlan(fixtures.map(s=>s.meta),repeats,(seed%5)/4,sr,random);plans++;
  const expected=oracle(plan,fixtures);
  for(const blocks of [[plan.totalFrames],[1],[13,67,4,29,101]]){
    const actual=partitioned(plan,fixtures,blocks);
    compare(actual.left,expected.left,"left independent model");compare(actual.right,expected.right,"right independent model");
    for(let i=0;i<plan.totalFrames;i++){
      const d=Math.max(Math.abs(actual.left[i]-actual.left[plan.totalFrames-1-i]),Math.abs(actual.right[i]-actual.right[plan.totalFrames-1-i]));
      maxReflectionError=Math.max(maxReflectionError,d);check(d<2e-11,"rendered stereo waveform is palindromic");
    }
  }
  if(seed===24)check(plan.events.length===120,"maximum 120-event plan exercised");
}

// Endpoint-only, silent, clipping, and invalid-input cases.
const small=[makeSource("short",2,2000,1)];
const tinyPlan={totalFrames:2,normalization:1,events:[{slot:0,startFrame:0,lengthFrames:2,amplitude:.5,positionStartMs:0,positionDeltaMs:.5,mono:true}]};
let calls=0;
const tiny=Render.renderChunk(tinyPlan,small.map(s=>s.meta),0,2,()=>{calls++;throw new Error("should not read zero endpoints");});
check(calls===0&&tiny.left.every(x=>x===0),"two-frame envelope is zero without source reads");
const empty=Render.renderChunk(tinyPlan,small.map(s=>s.meta),2,999,readFor(small));
check(empty.left.length===0&&empty.peak===0,"end-of-buffer request is empty");
const hot=[{meta:{name:"hot",frames:20,durationMs:20,channels:2},data:[new Float64Array(20).fill(20),new Float64Array(20).fill(-20)]}];
const hotPlan={totalFrames:20,normalization:1,events:[{slot:0,startFrame:0,lengthFrames:20,amplitude:.5,positionStartMs:0,positionDeltaMs:19,mono:false}]};
const hotOut=Render.renderChunk(hotPlan,hot.map(s=>s.meta),0,20,readFor(hot));
check(hotOut.left[5]===.99&&hotOut.right[5]===-.99&&hotOut.peak===.99,"out-of-range floating audio is clipped symmetrically");
const bad=(fn,label)=>{checks++;assert.throws(fn,undefined,label);};
bad(()=>Render.renderChunk(null,[],0,1,()=>[]),"missing plan");
bad(()=>Render.renderChunk({...hotPlan,events:{length:NaN}},hot.map(s=>s.meta),0,20,readFor(hot)),"invalid event-list length");
bad(()=>Render.renderChunk(hotPlan,hot.map(s=>s.meta),-.5,10,readFor(hot)),"fractional/negative start");
bad(()=>Render.renderChunk(hotPlan,hot.map(s=>s.meta),0,NaN,readFor(hot)),"nonfinite count");
bad(()=>Render.renderChunk(hotPlan,hot.map(s=>s.meta),21,1,readFor(hot)),"start past end");
bad(()=>Render.renderChunk(hotPlan,hot.map(s=>s.meta),0,20,()=>[]),"short read");
bad(()=>Render.renderChunk(hotPlan,hot.map(s=>s.meta),0,20,(s,c,a,n)=>new Array(n).fill(NaN)),"nonfinite audio");
bad(()=>Render.renderChunk({...hotPlan,normalization:Infinity},hot.map(s=>s.meta),0,20,readFor(hot)),"invalid normalization");
bad(()=>Render.renderChunk({...hotPlan,events:[{...hotPlan.events[0],lengthFrames:21}]},hot.map(s=>s.meta),0,20,readFor(hot)),"event after end");
bad(()=>Render.renderChunk({...hotPlan,events:[{...hotPlan.events[0],positionDeltaMs:200}]},hot.map(s=>s.meta),0,20,readFor(hot)),"out-of-source event");

// Render the real 16-bit WAV fixtures shipped in the previous build.
function wav(filename){
  const bytes=fs.readFileSync(filename);assert.equal(bytes.toString("ascii",0,4),"RIFF");
  let offset=12,channels,sr,bits,data;
  while(offset+8<=bytes.length){const id=bytes.toString("ascii",offset,offset+4),size=bytes.readUInt32LE(offset+4),first=offset+8;
    if(id==="fmt "){assert.equal(bytes.readUInt16LE(first),1);channels=bytes.readUInt16LE(first+2);sr=bytes.readUInt32LE(first+4);bits=bytes.readUInt16LE(first+14);}
    if(id==="data")data=bytes.subarray(first,first+size);offset=first+size+(size%2);
  }
  assert.equal(bits,16);const frames=data.length/(2*channels);
  return {meta:{name:path.basename(filename),frames,durationMs:1000*frames/sr,channels},data:Array.from({length:channels},(_,ch)=>Float64Array.from({length:frames},(_,i)=>data.readInt16LE((i*channels+ch)*2)/32768))};
}
const audio=[1,2,3].map(i=>wav(path.join(base,"..",`apgw_test${i}.wav`)));
const audioPlan=Plan.makePlan(audio.map(s=>s.meta),[1,1,1],.5,24000,rng(12345));plans++;
const audioExpected=oracle(audioPlan,audio),audioActual=partitioned(audioPlan,audio,[4096,2131,1,8000]);
compare(audioActual.left,audioExpected.left,"real WAV left");compare(audioActual.right,audioExpected.right,"real WAV right");
check(audioActual.peak>.01,"real included sources produce audible nonzero output");
console.log(JSON.stringify({result:"PASS",plans,checks,readCalls,maxDifference,maxReflectionError,realFixturePeak:audioActual.peak,limit:"Pure renderer and WAV-data checks; native Max buffer I/O and playback are not executed."},null,2));
