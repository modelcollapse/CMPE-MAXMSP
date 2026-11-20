"use strict";
// Real APG planner + renderer, simulated Max Buffer/Task/patcher boundaries.
// This tests generated sample data and orchestration, not native Max playback.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(process.argv[2] || path.join(__dirname,"../.."));
const patch = JSON.parse(fs.readFileSync(path.join(root,"APG_Wave.maxpat"),"utf8")).patcher;
const names = new Set(patch.boxes.map(x=>x.box.varname).filter(Boolean));
let checks=0, failures=[], outputFramesChecked=0, scenarios=0;
function check(value,label){checks++;assert.ok(value,label);}
function near(a,b,tol,label){check(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol,label+": "+a+" vs "+b);}
function seeded(seed){let s=seed>>>0;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
function test(name,fn){scenarios++;try{fn();}catch(e){failures.push({name,message:e.message,stack:e.stack.split("\n").slice(0,4).join("\n")});}}

function makeHost(seed=123){
  const events=[],values=new Map(),renamed=new Map(),buffers=new Map(),tasks=[],writes=[];
  let now=0,workTime=0,pokeCount=0,context;
  const math=Object.create(Math);math.random=seeded(seed);
  const fresh=(name,frames=1,sr=48000,channels=2)=>({name,frames,sr,channels,data:Array.from({length:channels},()=>new Float32Array(frames)),format:null,filetype:null});
  const objects=new Map([...names].map(name=>[name,{
    message(selector,...args){
      assert.equal(typeof selector,"string","Maxobj selector "+name);
      events.push({type:"message",name,selector,args,now});
      if(selector==="set"||selector==="int"||selector==="float")values.set(name,args[0]);
      if(selector==="name"){
        const old=renamed.get(name),record=old&&buffers.get(old)||fresh(args[0]);
        if(old)buffers.delete(old);record.name=args[0];buffers.set(args[0],record);renamed.set(name,args[0]);
      }
      if(name==="output_buffer"){
        const record=buffers.get(renamed.get(name));
        if(selector==="sr")record.sr=Number(args[0]);
        if(selector==="sizeinsamps"){
          record.frames=Number(args[0]);record.channels=args.length>1?Number(args[1]):record.channels;
          record.data=Array.from({length:record.channels},()=>new Float32Array(record.frames));
        }
        if(selector==="clear")record.data.forEach(x=>x.fill(0));
        if(selector==="format")record.format=args[0];
        if(selector==="filetype")record.filetype=args[0];
        if(selector==="writewave")writes.push({path:args[0],frames:record.frames,sr:record.sr,channels:record.channels,
          format:record.format,filetype:record.filetype,data:record.data.map(x=>x.slice())});
      }
    }
  }]));
  function Buffer(name){
    const get=()=>{const record=buffers.get(name);assert.ok(record,"buffer exists: "+name);return record;};
    this.framecount=()=>get().frames;
    this.length=()=>get().frames*1000/get().sr;
    this.channelcount=()=>get().channels;
    this.peek=(channel,first,count)=>{
      const b=get();assert.ok(channel>=1&&channel<=b.channels&&Number.isInteger(first)&&Number.isInteger(count)&&first>=0&&first+count<=b.frames);
      const result=b.data[channel-1].slice(first,first+count);
      return count===1?result[0]:Array.from(result);
    };
    this.poke=(channel,first,data)=>{
      const b=get();const values=typeof data==="number"?[data]:data;
      assert.ok(channel>=1&&channel<=b.channels&&Number.isInteger(first)&&first>=0&&first+values.length<=b.frames,"bounded output write");
      b.data[channel-1].set(values,first);pokeCount++;
    };
  }
  function Task(fn,self){this.fn=fn;this.self=self;this.active=false;this.due=Infinity;
    this.cancel=()=>{this.active=false;};this.schedule=delay=>{this.active=true;this.due=now+delay;};tasks.push(this);}
  function FakeDate(){this.getTime=()=>{workTime+=6;return 1700000000000+now+workTime;};}
  context=vm.createContext({patcher:{filepath:"/tmp/APG Wave/APG_Wave.maxpat",getnamed:name=>objects.get(name)||null},
    jsarguments:["apg_wave.js"],arrayfromargs:args=>Array.from(args),Task,Buffer,Math:math,Date:FakeDate,
    outlet(index,...args){if(args.length===1&&Array.isArray(args[0]))args=Array.from(args[0]);events.push({type:"outlet",index,args,now});},
    post(){},error(){}});
  for(const filename of ["apg_wave_plan.js","apg_render.js","apg_wave_controller.js"])
    vm.runInContext(fs.readFileSync(path.join(root,"developer",filename),"utf8"),context,{filename});
  const next=()=>tasks.filter(t=>t.active).sort((a,b)=>a.due-b.due)[0];
  function step(){const task=next();if(!task)return false;now=task.due;task.active=false;task.fn.call(task.self);return true;}
  function advance(ms){const end=now+ms;let safety=0;while(next()&&next().due<=end){assert.ok(safety++<10000,"finite task queue");step();}now=end;}
  function until(predicate){let safety=0;while(!predicate()){assert.ok(safety++<10000,"state eventually resolves");assert.ok(step(),"pending task available");}}
  function source(slot,opts={}){
    const frames=opts.frames||[6001,7001,8003][slot],sr=opts.sr||[44100,48000,32000][slot],channels=opts.channels||[1,2,1][slot];
    const name=renamed.get("source"+(slot+1));assert.ok(name,"source renamed before loading");
    const record=fresh(name,frames,sr,channels);
    record.data=Array.from({length:channels},(_,ch)=>Float32Array.from({length:frames},(_,i)=>
      opts.sample ? opts.sample(ch,i) : .53*Math.sin(i*.093+ch*.41)+.17*Math.cos(i*i*.000013+ch*.29)+.02*i/frames));
    buffers.set(name,record);context.loaded(slot);return record;
  }
  function ready(audio=true){context.loadbang();advance(50);for(let i=0;i<3;i++)source(i);if(audio){context.dspstate(1);context.samplerate(48000);}}
  function renderOnly(){context.newpiece();until(()=>context.state==="ready"&&context.outputReady);}
  function play(){context.play();until(()=>context.state==="playing");}
  function output(){return buffers.get(context.outputName);}
  return{c:context,events,values,renamed,buffers,tasks,writes,advance,step,until,source,ready,renderOnly,play,output,
    pokeCount:()=>pokeCount,time:()=>now};
}
function outs(events,index,selector){return events.filter(e=>e.type==="outlet"&&e.index===index&&e.args[0]===selector);}
function lastMessage(events,name,selector){return events.filter(e=>e.type==="message"&&e.name===name&&e.selector===selector).at(-1);}
function exactReflection(record){
  for(let ch=0;ch<record.channels;ch++)for(let i=0;i<record.frames;i++){
    check(record.data[ch][i]===record.data[ch][record.frames-1-i],"stored float32 samples exactly mirror");outputFramesChecked++;
  }
}

// A deterministic score containing one source followed by its reversed pair.
// It intentionally leaves a large internal gap, independently of the controller's
// onset scan and shortened-buffer writes.
function trimFixture(opts={}){
  const h=makeHost(opts.seed||321),c=h.c;h.ready();
  const sr=opts.sr||1000,frames=opts.frames||1000,totalFrames=opts.totalFrames||9000;
  const start=opts.start===undefined?1200:opts.start,channels=opts.channels||2;
  const sample=opts.sample||((ch,i)=>i>=40&&i<frames-40?(ch===0?.5:-.35):0);
  h.source(0,{frames,sr,channels,sample});c.samplerate(sr);
  const lastMs=1000*(frames-1)/sr,events=[
    {slot:0,pair:0,bufferName:c.sources[0].name,startFrame:start,lengthFrames:frames,
      rate:1,amplitude:.5,direction:1,positionStartMs:0,positionDeltaMs:lastMs,mono:channels===1},
    {slot:0,pair:0,bufferName:c.sources[0].name,startFrame:totalFrames-start-frames,lengthFrames:frames,
      rate:1,amplitude:.5,direction:-1,positionStartMs:lastMs,positionDeltaMs:-lastMs,mono:channels===1}
  ];
  const plan={sampleRate:sr,totalFrames,durationMs:totalFrames*1000/sr,
    counts:[1,0,0],events,normalization:1};
  const read=(slot,ch,first,count)=>h.buffers.get(c.sources[slot].name).data[ch-1].slice(first,first+count);
  const half=c.APGRender.renderChunk(plan,c.sources,0,Math.ceil(totalFrames/2),read);
  const untrimmed=[new Float32Array(totalFrames),new Float32Array(totalFrames)];
  for(let ch=0;ch<2;ch++)for(let i=0;i<half.left.length;i++){
    const value=Math.fround(ch===0?half.left[i]:half.right[i]);
    untrimmed[ch][i]=value;untrimmed[ch][totalFrames-1-i]=value;
  }
  const first=half.left.findIndex((v,i)=>Math.max(Math.abs(v),Math.abs(half.right[i]))>.00001);
  const padding=Math.round(.025*sr);
  const expectedTrim=first>=Math.ceil(.25*sr)?Math.max(0,first-padding):0;
  c.APGPlan.makePlan=()=>plan;
  return{h,c,plan,first,padding,expectedTrim,untrimmed};
}
function checkTrimmedResult(fixture){
  const{h,c,plan,first,padding,expectedTrim,untrimmed}=fixture;
  h.renderOnly();
  check(c.plan===plan&&plan.totalFrames===untrimmed[0].length,"original render plan remains intact");
  check(c.trimFrames===expectedTrim,"equal trim amount follows measured onset and padding");
  check(c.outputFrames===plan.totalFrames-2*expectedTrim,"final length removes equal integer frames at both ends");
  near(c.outputDurationMs,c.outputFrames*1000/plan.sampleRate,1e-12,"final duration uses actual shorter frame count");
  check(h.output().frames===c.outputFrames&&h.output().sr===plan.sampleRate,"native buffer receives exact final length and sample rate");
  check(c.firstAudioFrame===(first<0?-1:first-expectedTrim),"first-sound position is shifted onto shortened timeline");
  if(expectedTrim>0)check(c.firstAudioFrame===padding,"trim keeps the selected onset padding");
  for(let ch=0;ch<2;ch++)for(let i=0;i<c.outputFrames;i++){
    check(h.output().data[ch][i]===untrimmed[ch][i+expectedTrim],"trimmed Float32 audio equals symmetric slice of original output");
  }
  exactReflection(h.output());
  const range=lastMessage(h.events,"wave_link","list");
  check(range.args[0]===0&&range.args[1]===c.outputDurationMs&&range.args[2]===0&&range.args[3]===c.outputDurationMs,"waveform is reset to shortened output bounds");
  check(c.selectedStart===0&&c.selectedEnd===c.outputDurationMs,"initial playback selection is complete shortened result");
  return fixture;
}

test("render executes real chunks, mirrors stored output, and exposes progress",()=>{
  const h=makeHost(),c=h.c;h.ready();
  check(c.sources.every((s,i)=>s.name===h.renamed.get("source"+(i+1))),"source metadata uses renamed buffers");
  c.newpiece();h.advance(50);check(c.state==="rendering"&&!c.outputReady,"generation enters visible render state");
  check(h.values.get("progress")===0,"progress starts at zero");
  h.until(()=>h.output().frames===c.outputFrames&&c.outputFrames>1);
  check(h.output().frames===c.outputFrames&&h.output().channels===2,"output allocation matches final timeline");
  h.until(()=>c.state==="ready"&&c.outputReady);
  check(c.plan.totalFrames%2===1,"odd frame length exercises shared center sample");
  check(h.values.get("progress")===1&&!c.dirty,"completed render reaches100percent and becomes reusable");
  check(h.events.some(e=>e.name==="progress"&&e.selector==="set"&&e.args[0]>0&&e.args[0]<1),"intermediate render progress is reported");
  check(/^Ready/.test(h.values.get("render_info")),"render status announces ready");
  check(c.firstAudioFrame>=0&&c.renderPeak>.01,"rendered fixture output is nonzero and first sound is known");
  exactReflection(h.output());
  const half=Math.ceil(c.outputFrames/2);
  const reference=c.APGRender.renderChunk(c.plan,c.sources,c.trimFrames,half,(s,ch,start,count)=>new Float32Array(h.buffers.get(c.sources[s].name).data[ch-1].slice(start,start+count)));
  for(let i=0;i<half;i++){
    check(h.output().data[0][i]===Math.fround(reference.left[i]),"left half matches actual renderer");
    check(h.output().data[1][i]===Math.fround(reference.right[i]),"right half matches actual renderer");
  }
  check(outs(h.events,3,"bang").length===0,"NEW renders without queued playback");
});

test("PLAY reuses completed audio and NEW creates a fresh composition",()=>{
  const h=makeHost(91),c=h.c;h.ready();h.renderOnly();
  const oldPlan=c.plan,oldData=h.output().data[0].slice(),writes=h.pokeCount();h.play();
  check(c.plan===oldPlan&&h.pokeCount()===writes,"PLAY does not rerender clean output");
  check(outs(h.events,0,"startloop").length===1,"cached playback starts reader");
  c.ended(c.playToken);check(c.state==="ready","play completion retains rendered result");
  h.play();check(c.plan===oldPlan&&h.pokeCount()===writes,"second PLAY is still cached");c.stop();h.advance(12);
  h.renderOnly();check(c.plan!==oldPlan&&h.pokeCount()>writes,"NEW creates and writes a new plan");
  check(h.output().data[0].some((value,i)=>value!==oldData[i]),"new random composition changes actual output samples");
});

test("cancellation prevents queued autoplay during audio wait and render",()=>{
  const a=makeHost(),c=a.c;a.ready(false);c.play();c.stop();
  c.dspstate(1);c.samplerate(48000);a.advance(15000);
  check(c.state==="idle"&&!c.outputReady&&outs(a.events,3,"bang").length===0,"stopped audio wait does not later start");
  const h=makeHost(),d=h.c;h.ready();d.play();h.advance(50);h.step();
  check(d.state==="rendering"&&d.autoPlay,"PLAY is rendering with intended autoplay");
  const queued=d.renderTask;d.stop();const writes=h.pokeCount();h.advance(40000);queued.fn.call(queued.self);
  check(d.state==="idle"&&!d.outputReady&&d.dirty,"cancelled output remains unavailable");
  check(h.pokeCount()===writes&&outs(h.events,3,"bang").length===0,"cancelled or late render callbacks cannot write or play");
});

test("changed settings regenerate while unchanged playback stays cached",()=>{
  const h=makeHost(),c=h.c;h.ready();h.renderOnly();const old=c.plan,writes=h.pokeCount();
  c.pitch(.9);check(c.dirty&&c.outputReady,"changed settings mark old output dirty without losing it");
  h.play();check(c.plan!==old&&h.pokeCount()>writes&&!c.dirty,"dirty PLAY renders before playback");
  const during=c.pitchRange;c.pitch(.1);check(c.pitchRange===during,"rendered composition controls are locked during playback");
});

test("selection and looping configure correct timing without mutating generated audio",()=>{
  const h=makeHost(),c=h.c;h.ready();h.renderOnly();const writes=h.pokeCount();
  c.wavechange(0,c.outputDurationMs,80.003,170.007);c.wavemouse(12,5,0);h.advance(1);
  const a=Math.round(80.003*c.plan.sampleRate/1000)*1000/c.plan.sampleRate;
  const b=Math.round(170.007*c.plan.sampleRate/1000)*1000/c.plan.sampleRate;
  near(c.selectedStart,a,1e-12,"selection start snaps to source sample grid");near(c.selectedEnd,b,1e-12,"selection end snaps to source sample grid");
  const drawn=lastMessage(h.events,"wave_link","list");
  near(drawn.args[2],a,1e-12,"drawn selection uses committed start");near(drawn.args[3],b,1e-12,"drawn selection uses committed end");
  c.loopmode(1);h.play();
  const loop=outs(h.events,0,"setloop").at(-1);near(loop.args[1],a,1e-12,"loop start passed to groove");near(loop.args[2],b,1e-12,"loop end passed to groove");
  check(h.values.get("total_frames")===Math.max(2,Math.round((b-a)*c.sampleRate/1000)),"native completion duration matches selection");
  check(h.values.get("loop_flag")===1,"native completion bypass follows loop mode");
  c.phase(.25);near(lastMessage(h.events,"wave_l","line").args[0],a+.25*(b-a),1e-12,"playhead follows selection-local playback");
  const token=c.playToken;c.ended(token);check(c.state==="playing","completion does not stop looping playback");
  c.loopmode(0);h.advance(8);check(c.state==="playing"&&h.values.get("loop_flag")===0&&c.playToken>token,"disabling loop restarts as one-shot");
  c.ended(token);check(c.state==="playing","stale completion is ignored after selection restart");
  c.ended(c.playToken);check(c.state==="ready","current one-shot completion returns ready");
  check(h.pokeCount()===writes,"selection and replay do not change stored waveform");
  c.clearloop();check(c.selectedStart===0&&c.selectedEnd===c.outputDurationMs,"clear selects complete output");
  c.wavechange(0,c.outputDurationMs,73.001,73.001);c.wavemouse(20,5,0);h.advance(1);
  check(c.selectedStart===0&&c.selectedEnd===c.outputDurationMs,"point selection falls back to complete output");
  const fullDrawn=lastMessage(h.events,"wave_link","list");
  check(fullDrawn.args[2]===0&&fullDrawn.args[3]===c.outputDurationMs,"point selection draws same complete range used for playback");
});

test("audio stopping during render retains completed waveform without false playing state",()=>{
  const h=makeHost(),c=h.c;h.ready();c.play();h.advance(50);h.step();
  check(c.state==="rendering"&&c.autoPlay,"autoplay render is pending");
  c.dspstate(0);h.until(()=>c.state==="ready"&&c.outputReady);
  check(!c.dirty&&h.values.get("progress")===1,"audio off does not discard finished render");
  check(outs(h.events,3,"bang").length===0&&/Press PLAY/.test(h.values.get("status")),"audio off cannot pretend playback began");
  const writes=h.pokeCount();c.dspstate(1);h.play();
  check(h.pokeCount()===writes&&c.state==="playing","restarting audio plays completed render without regeneration");
});

test("STOP during queued selection restart cannot restart sound",()=>{
  const h=makeHost(),c=h.c;h.ready();h.renderOnly();h.play();
  c.wavechange(0,c.outputDurationMs,50,150);c.wavemouse(12,3,0);h.advance(1);
  check(c.state==="stopping","selection change schedules a short restart fade");
  const before=outs(h.events,3,"bang").length;c.stop();h.advance(500);
  check(c.state==="ready"&&outs(h.events,3,"bang").length===before,"STOP cancels queued restart and remains stopped");
  const lastSpeed=outs(h.events,1,0).at(-1);check(Boolean(lastSpeed),"STOP sends zero playback speed");
});

test("complete-output WAV export retains format, length, and stereo data",()=>{
  const h=makeHost(),c=h.c;h.ready();h.renderOnly();
  c.wavechange(0,c.outputDurationMs,20,75);c.wavemouse(0,0,0);h.advance(1);
  c.savepath("/tmp/APG selected result");check(c.savePending&&h.writes.length===1,"save is pending until completion");
  const write=h.writes[0];check(write.path==="/tmp/APG selected result.wav","WAV suffix and spaces retained");
  check(write.format==="int24"&&write.filetype==="wave"&&write.channels===2,"24-bit stereo WAV is requested");
  check(write.frames===c.outputFrames&&write.frames>Math.round((c.selectedEnd-c.selectedStart)*c.plan.sampleRate/1000),"export covers whole output rather than loop selection");
  check(write.data.every((ch,index)=>ch.every((value,i)=>value===h.output().data[index][i])),"export snapshots all rendered stereo samples");
  const writes=h.pokeCount(),plan=c.plan;c.newpiece();h.advance(60);
  check(c.plan===plan&&h.pokeCount()===writes,"new render cannot mutate output while WAV write is pending");
  c.saved();check(!c.savePending&&/write completed/.test(h.values.get("status")),"completion confirms write and clears guard");
  h.advance(40000);check(!c.savePending&&/write completed/.test(h.values.get("status")),"cancelled save watchdog cannot replace completion status");
});

test("shutdown cancels rendering, selection restart, and save tasks",()=>{
  for(const scenario of ["rendering","restart","saving"]){
    const h=makeHost(),c=h.c;h.ready();
    if(scenario==="rendering"){c.play();h.advance(50);h.step();}
    else{h.renderOnly();if(scenario==="restart"){h.play();c.loopmode(1);}else c.savepath("/tmp/close.wav");}
    c.shutdown();check(h.tasks.every(t=>!t.active),"all callbacks cancelled on close from "+scenario);
    const writes=h.pokeCount(),clocks=outs(h.events,3,"bang").length;h.advance(40000);
    check(h.pokeCount()===writes&&outs(h.events,3,"bang").length===clocks&&c.state==="idle","close has no later output from "+scenario);
  }
});

test("long symmetric silence is removed exactly at 44.1k and 48k, including an odd center",()=>{
  for(const opts of [
    {sr:44100,frames:4411,totalFrames:264601,start:60000},
    {sr:48000,frames:4801,totalFrames:288000,start:65000}
  ]){
    const f=checkTrimmedResult(trimFixture(opts));
    check(f.expectedTrim>f.plan.sampleRate,"fixture removes more than one second from each end");
    check(f.c.outputFrames%2===f.plan.totalFrames%2,"equal-end removal preserves odd/even center");
    check(/trimmed/i.test(f.h.values.get("render_info")),"ready readout makes trimming visible");
  }
});

test("trimming preserves the composition's internal silence",()=>{
  const f=checkTrimmedResult(trimFixture()),{c,h}=f;
  const originalMiddle=Math.floor(f.plan.totalFrames/2),middle=originalMiddle-f.expectedTrim;
  check(h.output().data[0].slice(middle-1000,middle+1000).every(v=>v===0),"two-second internal gap remains silent");
  check(h.output().data[0].slice(0,middle).some(v=>v!==0)&&h.output().data[0].slice(middle).some(v=>v!==0),"audio remains on both sides of internal gap");
  check(c.outputFrames===f.plan.totalFrames-2*f.expectedTrim,"only the two outer margins were removed");
});

test("an earlier sound in the right channel protects both channel timelines",()=>{
  const f=checkTrimmedResult(trimFixture({sample:(ch,i)=>i>=(ch===0?160:40)&&i<960?.5:0}));
  check(f.first===1240,"right channel establishes the earlier onset");
  check(f.h.output().data[0][f.padding]===0&&f.h.output().data[1][f.padding]>.01,"right-only beginning survives the shared crop");
});

test("quiet audible material and onset padding survive trimming",()=>{
  const f=checkTrimmedResult(trimFixture({sample:(ch,i)=>i<40||i>=960?0:(i<200?.0001:.5)}));
  check(f.first===1240,"quiet prelude establishes onset before the louder body");
  check(f.h.output().data[0][f.padding]>.00001&&f.h.output().data[0][f.padding]<.001,"quiet prelude remains audible in stored samples");
  check(f.h.output().data[0].slice(0,f.padding).every(v=>v===0),"twenty-five milliseconds of leading padding remain");
});

test("short openings remain intact and the long-silence threshold is inclusive",()=>{
  for(const start of [0,80,248,249]){
    const f=checkTrimmedResult(trimFixture({frames:500,totalFrames:4000,start,sample:()=>.5}));
    check(f.first===start+1,"source envelope starts at first interior frame");
    if(start<249)check(f.expectedTrim===0&&f.c.outputFrames===4000,"opening shorter than250ms is not trimmed");
    else check(f.expectedTrim===225&&f.c.firstAudioFrame===25,"exact250ms opening leaves25ms after trim");
  }
});

test("silent and below-threshold outputs are not collapsed",()=>{
  for(const amplitude of [0,.000001]){
    const f=checkTrimmedResult(trimFixture({frames:500,totalFrames:4000,start:800,sample:()=>amplitude}));
    check(f.first===-1&&f.c.trimFrames===0&&f.c.outputFrames===4000,"no threshold crossing leaves original result intact");
    check(f.c.state==="ready"&&outs(f.h.events,3,"bang").length===0,"silent generated output is ready without false autoplay");
    check((amplitude===0?/silent/i:/quiet/i).test(f.h.values.get("status")),"zero and subthreshold outputs are described accurately");
    if(amplitude>0)check(f.h.output().data[0].some(v=>v!==0),"subthreshold audio samples are retained rather than zeroed");
  }
});

test("shortened waveform, playback counter, full-range reset and export use final length",()=>{
  const f=checkTrimmedResult(trimFixture()),{h,c}=f;
  h.play();
  check(h.values.get("total_frames")===c.outputFrames,"full playback counter uses trimmed sample length");
  const loop=outs(h.events,0,"setloop").at(-1);
  check(loop.args[1]===0&&loop.args[2]===c.outputDurationMs,"full playback ends at trimmed buffer duration");
  c.phase(.5);near(lastMessage(h.events,"wave_l","line").args[0],c.outputDurationMs*.5,1e-12,"playhead runs on shortened timeline");
  check(h.values.get("time").endsWith(" / "+(c.outputDurationMs/1000).toFixed(1)+" s"),"timer displays final duration");
  c.ended(c.playToken);
  c.wavechange(0,c.outputDurationMs,50,125);c.wavemouse(0,0,0);h.advance(1);
  c.savepath("/tmp/APG trimmed complete.wav");
  check(h.writes[0].frames===c.outputFrames&&h.writes[0].frames<f.plan.totalFrames,"WAV export contains the actual trimmed buffer");
  check(h.writes[0].data.every((channel,ch)=>channel.every((v,i)=>v===f.untrimmed[ch][i+f.expectedTrim])),"saved sample content is the symmetric crop, not the old full-length file");
  c.saved();c.clearloop();
  check(c.selectedStart===0&&c.selectedEnd===c.outputDurationMs,"FULL RANGE selects only final trimmed output");
  const range=lastMessage(h.events,"wave_link","list");
  check(range.args[1]===c.outputDurationMs&&range.args[3]===c.outputDurationMs,"FULL RANGE draws final output limits");
});

test("STOP during the opening scan cancels every later render and autoplay",()=>{
  const f=trimFixture({sr:48000,frames:40000,totalFrames:100001,start:6000,
    sample:(ch,i)=>i>=35000&&i<39000?.5:0}),{h,c}=f;
  c.play();h.advance(50);
  check(c.state==="rendering"&&c.renderTask.fn===c.scanOpening,"opening scan is the first deferred render stage");
  h.step();
  check(c.state==="rendering"&&c.firstAudioFrame===-1&&c.renderTask.fn===c.scanOpening,"long silent source needs additional bounded scan tasks");
  const pending=c.renderTask,writes=h.pokeCount();c.stop();h.advance(40000);pending.fn.call(pending.self);
  check(c.state==="idle"&&!c.outputReady&&c.dirty,"cancelled scan cannot expose a partial output");
  check(h.pokeCount()===writes&&outs(h.events,3,"bang").length===0,"late scan callback cannot write or start playback after STOP");
  check(h.tasks.every(t=>!t.active),"scan cancellation leaves no pending callbacks");
});

console.log(JSON.stringify({result:failures.length?"FAIL":"PASS",scenarios,checks,outputFramesChecked,failures,
  limit:"Uses actual planner and renderer with simulated Max buffers/tasks. Native DSP, GUI input, and disk writing are not executed."},null,2));
process.exitCode=failures.length?1:0;
