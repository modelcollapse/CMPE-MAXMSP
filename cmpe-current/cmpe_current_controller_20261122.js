/* Non-destructive source-region metadata, normalized for Set portability. */
var SourceRegionModel=(function(){
 function defaults(){return [[0,1],[0,1],[0,1]];}
 function validate(rs){if(!rs||rs.length!==3)throw new Error("Three source regions are required.");for(var i=0;i<3;i++){var r=rs[i];if(!r||r.length!==2||typeof r[0]!=="number"||typeof r[1]!=="number"||!isFinite(r[0])||!isFinite(r[1])||r[0]<0||r[1]>1||r[1]<=r[0])throw new Error("Invalid source region.");}}
 function restore(rs){if(rs===undefined||rs===null)return defaults();validate(rs);return rs.map(function(r){return r.slice(0);});}
 function frames(a,b,total){a=Math.max(0,Math.min(total-2,Math.round(a)));b=Math.max(a+2,Math.min(total,Math.round(b)));return [a,b];}
 return {defaults:defaults,validate:validate,restore:restore,frames:frames};
}());
var sourceRegions=SourceRegionModel.defaults(),sourceRestorePending=[false,false,false];
/* APG advanced settings and deterministic variation, ES5 for Max 8/9. */
/* Advanced ranges for ISJS, Many, RMHS and SIOE. Defaults reproduce the
 * original fixed values; each row is a min-max range or a single value. */
/* RMHS harmony: 5-limit just intonation, harmonic series shapes, note names
 * (A4 = 440 Hz, equal temperament) and theory-based presets. */
var RMHSTheory=(function(){
 var JI=[[1,1],[16,15],[9,8],[6,5],[5,4],[4,3],[45,32],[3,2],[8,5],[5,3],[9,5],[15,8],[2,1],
         [32,15],[9,4],[12,5],[5,2],[8,3],[45,16],[3,1],[16,5],[10,3],[18,5],[15,4],[4,1]];
 var NAMES=["Unison","Minor 2nd","Major 2nd","Minor 3rd","Major 3rd","Perfect 4th","Tritone","Perfect 5th","Minor 6th","Major 6th","Minor 7th","Major 7th","Octave",
            "Minor 9th","Major 9th","Minor 10th","Major 10th","Perfect 11th","Aug. 11th","Perfect 12th","Minor 13th","Major 13th","Minor 14th","Major 14th","Two octaves"];
 var NOTES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
 var TUNINGS=["Equal temperament","Just (5-limit)"],SERIES=["All harmonics","Odd harmonics (hollow)","Octaves + fifths (organ)"],ROOTS=["Free (any Hz)","Snap to notes"];
 function isInt(x){return Math.abs(x-Math.round(x))<1e-9;}
 function gcd(a,b){while(b){var t=b;b=a%b;a=t;}return a;}
 function midi(hz){return 69+12*Math.log(hz/440)/Math.LN2;}
 function note(hz){var m=midi(hz),r=Math.round(m),c=Math.round((m-r)*100);return {name:NOTES[((r%12)+12)%12]+(Math.floor(r/12)-1),cents:c,midi:r};}
 function snap(hz){return 440*Math.pow(2,(Math.round(midi(hz))-69)/12);}
 function just(st){return isInt(st)&&st>=0&&st<=24?JI[Math.round(st)]:null;}
 function sideRatio(st,tuning){var j=tuning===1?just(st):null;return j?j[0]/j[1]:Math.pow(2,st/12);}
 /* Harmonic numbers for a series: 0 all, 1 odd, 2 3-limit (2^a 3^b). */
 function series(kind,count){var out=[],n=1;while(out.length<count&&n<10000){var ok=kind===1?(n%2===1):(kind===2?(function(x){while(x%2===0)x/=2;while(x%3===0)x/=3;return x===1;}(n)):true);if(ok)out.push(n);n++;}return out;}
 function list(a,b){return a+","+2*a+","+3*a+"…";}
 /* Three short help lines for the RMHS cards. */
 function guidance(d,h){
  h=h||{};var tuning=h.tuning||0,kind=h.series||0,st=d.intervalSemitones,j=just(st),nn=note(d.fundamentalHz);
  var parts=series(kind,d.harmonics),top=d.fundamentalHz*parts[parts.length-1]*sideRatio(st,tuning);
  var root=nn.name+" · "+d.fundamentalHz.toFixed(1)+" Hz ("+(nn.cents>=0?"+":"")+nn.cents+"¢)\n"+SERIES[kind].replace(/ \(.*\)/,"")+" · top ≈ "+(top>=1000?(top/1000).toFixed(1)+" kHz":Math.round(top)+" Hz");
  var name=isInt(st)?NAMES[Math.round(st)]:st.toFixed(2)+" semitones",line2;
  if(!j){line2="Not a scale step: partials beat freely";return [root,name+" · equal",line2];}
  var p=j[0],q=j[1],g=gcd(p,q);p/=g;q/=g;
  var height=Math.log(p*q)/Math.LN2,feel=height<=2.6?"smooth":(height<=4.4?"sweet":(height<=6.5?"bittersweet":"tense"));
  if(tuning===1)line2=feel+" · side "+list(q)+" = root "+list(p);
  else{var cents=Math.round(1200*Math.log(Math.pow(2,st/12)/(p/q))/Math.LN2),beat=Math.abs(q*d.fundamentalHz*Math.pow(2,st/12)-p*d.fundamentalHz);
   line2=cents===0?feel+" · pure in equal tuning":feel+" · "+(cents>0?"+":"")+cents+"¢ vs "+p+":"+q+" · beats "+(beat<10?beat.toFixed(1):Math.round(beat))+" Hz";}
  return [root,name+" · "+(tuning===1?"just "+p+":"+q:"equal"),line2];
 }
 /* Presets keep the user's level and duration. */
 var PRESETS=[
  {name:"Custom"},
  {name:"Tanpura (root + fifth)",about:"Root and pure fifth, bright, slow bloom.",hz:69.30,st:7,harm:16,tuning:1,series:0,tilt:0.8,attack:[3,8],spread:[30,70],drift:[0.01,0.1],depth:0.3},
  {name:"Just-fifth organ",about:"Octaves and fifths only: stable, organ-like.",hz:65.41,st:7,harm:12,tuning:1,series:2,tilt:1,attack:[2,6],spread:[20,60],drift:[0.005,0.05],depth:0.2},
  {name:"Hollow fourth",about:"Odd partials and a pure fourth: open, woody.",hz:73.42,st:5,harm:14,tuning:1,series:1,tilt:1.2,attack:[4,12],spread:[30,80],drift:[0.01,0.1],depth:0.4},
  {name:"Major-third glow",about:"Pure 5:4 third: warm, slightly sweet.",hz:87.31,st:4,harm:12,tuning:1,series:0,tilt:1.4,attack:[6,15],spread:[20,70],drift:[0.01,0.2],depth:0.5},
  {name:"Minor-sixth dusk",about:"Pure 8:5 sixth: wistful, darker colour.",hz:82.41,st:8,harm:12,tuning:1,series:0,tilt:1.3,attack:[6,18],spread:[20,70],drift:[0.01,0.2],depth:0.5},
  {name:"Octave choir",about:"Root and octave with lively drift: choral shimmer.",hz:55.00,st:12,harm:18,tuning:1,series:0,tilt:0.9,attack:[3,10],spread:[40,90],drift:[0.05,0.3],depth:1},
  {name:"Tritone unrest",about:"Equal-tempered tritone: beating, unresolved.",hz:61.74,st:6,harm:12,tuning:0,series:0,tilt:1,attack:[3,12],spread:[20,70],drift:[0.1,0.5],depth:2},
  {name:"Deep sub",about:"Unison banks, dark tilt: a wide, low hum.",hz:49.00,st:0,harm:8,tuning:1,series:0,tilt:2,attack:[8,20],spread:[50,100],drift:[0.005,0.05],depth:0.3}];
 return {JI:JI,NAMES:NAMES,TUNINGS:TUNINGS,SERIES:SERIES,ROOTS:ROOTS,PRESETS:PRESETS,note:note,snap:snap,just:just,sideRatio:sideRatio,series:series,guidance:guidance,
  presetNames:function(){return PRESETS.map(function(p){return p.name;});}};
}());
/* ISJS and Many presets. Rates and pitch sets follow just ratios and scale
 * theory; texture settings come from the ADVANCED ranges. */
var LivePresets=(function(){
 var ISJS=[{name:"Custom"},
  {name:"Just major triad",about:"Rates 4:5:6: the three samples sound a pure major triad. Soft cloud.",rates:[1,1.25,1.5],levels:[0.6,0.5,0.5],density:0.45,width:[50,100],curve:[1,1.5],attack:15},
  {name:"Just minor triad",about:"Rates 10:12:15: a pure minor triad. Slow, misty grains.",rates:[1,1.2,1.5],levels:[0.6,0.5,0.45],density:0.3,width:[60,100],curve:[0.8,1.2],attack:30},
  {name:"Open fifths",about:"Rates 2:3 and 3:2 around the root: hollow and stable.",rates:[0.667,1,1.5],levels:[0.55,0.6,0.45],density:0.55,width:[30,80],curve:[1,2],attack:8},
  {name:"Unison chorus",about:"Rates detuned by about 10 cents: chorus-like shimmer.",rates:[1,1.006,0.994],levels:[0.5,0.5,0.5],density:0.7,width:[70,100],curve:[1,1.5],attack:10},
  {name:"Pentatonic sparkle",about:"Rates 1, 9:8 and 5:3 (pentatonic steps). Short, bright grains.",rates:[1,1.125,1.667],levels:[0.5,0.45,0.4],density:0.8,width:[80,100],curve:[3,5],attack:2},
  {name:"Sub and air",about:"An octave below, root and fifth above: wide register.",rates:[0.5,1,1.5],levels:[0.7,0.4,0.4],density:0.35,width:[40,100],curve:[1,2],attack:5},
  {name:"Granular rain",about:"Root, fifth and fourth with dense, percussive grains.",rates:[1,1.5,1.333],levels:[0.5,0.4,0.4],density:0.9,width:[90,100],curve:[4,6],attack:1}];
 var MANY=[{name:"Custom"},
  {name:"Major bloom",about:"Major-scale transpositions, medium space: bright and consonant.",pitchSet:0,delay:0.3,interval:8,fade:[3,6],decay:[15,30],spread:[40,100]},
  {name:"Minor cathedral",about:"Minor-scale layers, long delays and tails: dark and spacious.",pitchSet:1,delay:0.5,interval:12,fade:[4,8],decay:[30,60],spread:[50,100]},
  {name:"Pentatonic garden",about:"No semitone steps, so every layer is consonant. Lively.",pitchSet:2,delay:0.25,interval:6,fade:[2,4],decay:[10,20],spread:[25,100]},
  {name:"Atonal fog",about:"All 12 semitones: clustered, ambiguous harmony.",pitchSet:3,delay:0.4,interval:10,fade:[5,10],decay:[20,45],spread:[60,100]},
  {name:"Microtonal haze",about:"Layers within 15 cents of unison: slow beating and chorus.",pitchSet:4,delay:0.2,interval:7,fade:[3,6],decay:[15,30],spread:[25,100]},
  {name:"Metallic swarm",about:"Short, narrow delays ring like metal; quick layers.",pitchSet:3,delay:0.1,interval:5,fade:[1,2],decay:[5,10],spread:[5,25]}];
 var SET_NOTES=["Major: bright, consonant layers","Minor: darker, still consonant","Pentatonic: no semitones, always consonant","Atonal: all 12 steps, clustered","Microtonal: within 15¢, slow beating"];
 /* Nearest 5-limit interval for a playback-rate ratio. */
 function interval(r){if(!(r>0))return "";
  if(r<0.9995){var up=interval(1/r),m=up.match(/^(.*) (\d+):(\d+)(?: ([+-])(\d+)\u00a2)?$/);if(!m)return up+" below";if(m[1]==="Unison")return "Unison 1:1"+(m[4]?" "+(m[4]==="+"?"-":"+")+m[5]+"\u00a2":"");return m[1]+" below "+m[3]+":"+m[2]+(m[4]?" "+(m[4]==="+"?"-":"+")+m[5]+"\u00a2":"");}
  var st=12*Math.log(r)/Math.LN2,n=Math.min(24,Math.max(0,Math.round(st))),j=RMHSTheory.JI[n],c=Math.round(1200*Math.log(r/(j[0]/j[1]))/Math.LN2);
  return RMHSTheory.NAMES[n]+" "+j[0]+":"+j[1]+(c?" "+(c>0?"+":"")+c+"\u00a2":"");}
 function isjsGuide(rates){return "Rate vs sample 1 · S2: "+interval(rates[1]/rates[0])+" · S3: "+interval(rates[2]/rates[0]);}
 return {ISJS:ISJS,MANY:MANY,SET_NOTES:SET_NOTES,interval:interval,isjsGuide:isjsGuide};
}());
var ModeAdvancedModel=(function(){
 var SPECS={
  isjs:[{key:"width",label:"STEREO WIDTH",unit:"%",range:true,lo:0,hi:100,def:[30,100],step:1,help:"Random pan width per sample, chosen at START."},
        {key:"curve",label:"GRAIN CURVE",unit:"",range:true,lo:0.1,hi:8,def:[1,2],step:0.1,help:"Envelope shape. Higher = sharper, more percussive."},
        {key:"attack",label:"GRAIN ATTACK",unit:"% of grain",range:false,lo:1,hi:50,def:2,step:1,help:"Fade-in share of each grain. Higher = softer."}],
  many:[{key:"fade",label:"LAYER FADE-IN",unit:"s",range:true,lo:0.1,hi:30,def:[2,4],step:0.1,help:"How long each new layer takes to swell in."},
        {key:"decay",label:"REVERB DECAY",unit:"s",range:true,lo:1,hi:60,def:[10,30],step:1,help:"Tail length of each layer's delay network."},
        {key:"spread",label:"DELAY SPREAD",unit:"% of max delay",range:true,lo:5,hi:100,def:[25,100],step:1,help:"Spread of the 7 delay times. Narrow = metallic."}],
  rmhs:[{key:"attack",label:"PARTIAL ATTACK",unit:"s",range:true,lo:0.1,hi:120,def:[3,20],step:0.1,help:"Fade-in time of each partial."},
        {key:"spread",label:"STEREO SPREAD",unit:"%",range:true,lo:0,hi:100,def:[20,70],step:1,help:"How far the side banks sit from the centre."},
        {key:"drift",label:"DRIFT RATE",unit:"Hz",range:true,lo:0.001,hi:5,def:[0.001,0.3],step:0.001,help:"How often each partial's pitch wanders."},
        {key:"depth",label:"DRIFT DEPTH",unit:"%",range:false,lo:0,hi:5,def:2,step:0.1,help:"How far pitch wanders. 2% is about 1/3 semitone."}],
  sioe:[{key:"attack",label:"SLICE ATTACK",unit:"ms",range:true,lo:1,hi:2000,def:[10,300],step:1,help:"Fade-in of each slice. Low = clicky, high = swelled."},
        {key:"release",label:"SLICE RELEASE",unit:"% of hit",range:true,lo:5,hi:100,def:[50,100],step:1,help:"Fade-out length relative to Hit duration."},
        {key:"spread",label:"STEREO SPREAD",unit:"%",range:false,lo:0,hi:100,def:100,step:1,help:"0 = all slices centred. 100 = full left to right."}]};
 var MODES=["isjs","many","rmhs","sioe"];
 function fin(x){return typeof x==="number"&&isFinite(x);}
 function cl(v,a,b){return Math.max(a,Math.min(b,v));}
 function defaults(){var o={},i,j;for(i=0;i<MODES.length;i++){var m=MODES[i],r={values:{},locked:false,seed:1234567};for(j=0;j<SPECS[m].length;j++){var sp=SPECS[m][j];r.values[sp.key]=sp.range?sp.def.slice(0):sp.def;}o[m]=r;}
  o.rmhs.harmony={preset:0,tuning:0,series:0,snap:0,tilt:1};o.isjs.preset=0;o.many.preset=0;o.many.sources=1;return o;}
 function copy(v){return JSON.parse(JSON.stringify(v));}
 function restore(v){var o=defaults(),i,j;if(!v||typeof v!=="object")return o;
  for(i=0;i<MODES.length;i++){var m=MODES[i],src=v[m];if(!src||typeof src!=="object")continue;
   if(typeof src.locked==="boolean")o[m].locked=src.locked;
   if(fin(src.seed)&&src.seed>=1&&src.seed<=2147483646)o[m].seed=Math.floor(src.seed);
   for(j=0;j<SPECS[m].length;j++){var sp=SPECS[m][j],x=src.values&&src.values[sp.key];
    if(sp.range&&x&&x.length===2&&fin(x[0])&&fin(x[1])){var a=cl(x[0],sp.lo,sp.hi),b=cl(x[1],sp.lo,sp.hi);o[m].values[sp.key]=a<=b?[a,b]:[b,a];}
    else if(!sp.range&&fin(x))o[m].values[sp.key]=cl(x,sp.lo,sp.hi);}}
  if(v.isjs&&fin(v.isjs.preset))o.isjs.preset=cl(Math.round(v.isjs.preset),0,LivePresets.ISJS.length-1);if(v.many&&fin(v.many.sources))o.many.sources=cl(Math.round(v.many.sources),1,3);if(v.many&&fin(v.many.preset))o.many.preset=cl(Math.round(v.many.preset),0,LivePresets.MANY.length-1);
  var hm=v.rmhs&&v.rmhs.harmony;if(hm&&typeof hm==="object"){var H=o.rmhs.harmony;
   if(fin(hm.preset))H.preset=cl(Math.round(hm.preset),0,RMHSTheory.PRESETS.length-1);if(fin(hm.tuning))H.tuning=cl(Math.round(hm.tuning),0,1);
   if(fin(hm.series))H.series=cl(Math.round(hm.series),0,2);if(fin(hm.snap))H.snap=cl(Math.round(hm.snap),0,1);if(fin(hm.tilt))H.tilt=cl(hm.tilt,0.3,3);}
  return o;}
 /* which: "min", "max" or "value". Keeps min <= max by moving the other end. */
 function setValue(state,mode,key,which,value){var list=SPECS[mode],sp=null,i;if(!list||!fin(value))return false;
  for(i=0;i<list.length;i++)if(list[i].key===key)sp=list[i];if(!sp)return false;
  var v=cl(value,sp.lo,sp.hi),cur=state[mode].values[key];
  if(!sp.range){if(cur===v)return false;state[mode].values[key]=v;return true;}
  var a=cur[0],b=cur[1];if(which==="min"){a=v;if(b<a)b=a;}else{b=v;if(a>b)a=b;}
  if(a===cur[0]&&b===cur[1])return false;state[mode].values[key]=[a,b];return true;}
 return {SPECS:SPECS,MODES:MODES,defaults:defaults,copy:copy,restore:restore,setValue:setValue};
}());
var modeAdvanced=ModeAdvancedModel.defaults(),modeVarPrepared={isjs:false,many:false,rmhs:false,sioe:false},liveRng=Math.random;
var MODE_KEYS=["apg","isjs","many","rmhs","sioe"];
/* Sample slots an instrument shows: Many can draw layers from 1-3 samples. */
function sourceCountFor(mode){return mode===3?0:(mode===2?modeAdvanced.many.sources:(mode===4?1:3));}
/* Pre-FX gain per instrument (dB), from Max 9 measurements at gain 0 (post-limiter peaks with the demo
 * samples): APG -20.6, ISJS -15, Many -16 to -29, RMHS -14 (level 0.22), SIOE -12.4 dBFS.
 * The demo samples peak near -8 dBFS, the Match levels target, so these gains also hold with matching on. */
var GAIN_DEFAULTS=[6,3,6,6,3],instrumentGainDb=GAIN_DEFAULTS.slice(0);
function applyInstrumentGain(ms){var o=this.patcher?this.patcher.getnamed("instrument_gain"):null,m=this.CMPEState?this.CMPEState().mode:0;if(o)o.message("list",Math.pow(10,instrumentGainDb[m]/20),ms===undefined?30:ms);var f=this.patcher?this.patcher.getnamed("gain_field"):null;if(f)f.message("set",instrumentGainDb[m]);}
function instrumentgain(v){v=Number(v);if(!isFinite(v))return;var m=this.CMPEState?this.CMPEState().mode:0;instrumentGainDb[m]=Math.max(-12,Math.min(24,Math.round(v*2)/2));applyInstrumentGain();}
function attackText(){var a=modeAdvanced.rmhs.values.attack;function f(x){return x<10?(+x.toFixed(1)).toString():Math.round(x).toString();}return f(a[0])+"\u2013"+f(a[1])+" seconds";}
function withAdv(settings,mode){var o={},k;for(k in settings)if(settings.hasOwnProperty(k))o[k]=settings[k];o.adv=modeAdvanced[mode].values;if(modeAdvanced[mode].harmony)o.harmony=modeAdvanced[mode].harmony;return o;}
/* Fresh seed per START/take unless locked or NEW VARIATION just chose one. */
function prepareVariation(mode){var v=modeAdvanced[mode];if(!v.locked&&!modeVarPrepared[mode])v.seed=APGAdvancedModel.freshSeed();modeVarPrepared[mode]=false;liveRng=APGAdvancedModel.random(v.seed);if(typeof modeadvrefresh==="function")try{modeadvrefresh();}catch(e){}return liveRng;}
var APGAdvancedModel=(function(){
 function finite(v){return typeof v==="number"&&isFinite(v);}
 function defaults(){return {lengthSeconds:0,levels:[1,1,1],variationLocked:false,seed:1234567};}
 function copy(v){return {lengthSeconds:v.lengthSeconds,levels:v.levels.slice(0),variationLocked:v.variationLocked,seed:v.seed};}
 function validate(v){if(!v||!finite(v.lengthSeconds)||(v.lengthSeconds!==0&&(v.lengthSeconds<0.1||v.lengthSeconds>600))||!v.levels||v.levels.length!==3||typeof v.variationLocked!=="boolean"||!finite(v.seed)||Math.floor(v.seed)!==v.seed||v.seed<1||v.seed>2147483646)throw new Error("Invalid APG Advanced settings.");for(var i=0;i<3;i++)if(!finite(v.levels[i])||v.levels[i]<0||v.levels[i]>2)throw new Error("Invalid APG source level.");}
 function restore(v){if(v===undefined||v===null)return defaults();validate(v);return copy(v);}
 function random(seed){var n=Math.floor(seed)%2147483647;if(n<1)n=1;return function(){n=(n*16807)%2147483647;return (n-1)/2147483646;};}
 function freshSeed(){return 1+Math.floor(Math.random()*2147483646);}
 return {defaults:defaults,copy:copy,validate:validate,restore:restore,random:random,freshSeed:freshSeed};
}());

/* APG event planner. ES5 for Max 8's legacy js object and Node validation.
 * Musical algorithm: Joo Won Park, Audio Palindrome Generator, 2020.
 * This is a new Max implementation of the supplied SuperCollider source.
 */
var APGPlan = (function () {
    "use strict";
    function finite(x) { return typeof x === "number" && isFinite(x); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function makePlan(sources, repeats, pitchRange, sampleRate, random, options) {
        options=options||{};
        var requestedLength=options.lengthSeconds===undefined?0:options.lengthSeconds;
        var sourceLevels=options.levels||[1,1,1];
        if(!finite(requestedLength)||(requestedLength!==0&&(requestedLength<0.1||requestedLength>600)))throw new Error("APG length must be Auto or 0.1–600 seconds.");
        if(sourceLevels.length!==3)throw new Error("Set three APG source levels.");
        for(var sl=0;sl<3;sl++)if(!finite(sourceLevels[sl])||sourceLevels[sl]<0||sourceLevels[sl]>2)throw new Error("APG source levels must be 0–200%.");
        var i, j, source, longest = 0, events = [], counts = [], edges = [];
        if (!sources || sources.length !== 3) throw new Error("Load all three samples.");
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("Audio sample rate is unavailable.");
        if (!repeats || repeats.length !== 3) throw new Error("Three repeat values are required.");
        if (!finite(pitchRange)) throw new Error("Pitch range must be a finite number.");
        pitchRange = clamp(pitchRange, 0, 1);
        random = random || Math.random;
        function rnd() {
            var r = random();
            if (!finite(r) || r < 0 || r >= 1) throw new Error("Random values must be in [0, 1).");
            return r;
        }
        for (i = 0; i < 3; i++) {
            source = sources[i];
            if (!source || typeof source.name !== "string" || !source.name.length ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    !finite(source.frames) || source.frames < 2 || Math.floor(source.frames) !== source.frames ||
                    (source.channels !== 1 && source.channels !== 2)) {
                throw new Error("Each sample must be a nonempty mono or stereo audio buffer.");
            }
            if (!finite(repeats[i])) throw new Error("Repeat values must be finite numbers.");
            longest = Math.max(longest, source.durationMs);
        }
        var totalFrames = Math.max(4, Math.round(requestedLength>0?requestedLength*sampleRate:2*longest*sampleRate/1000));
        if(totalFrames*8>200*1024*1024 || totalFrames/sampleRate>600)throw new Error("APG exceeds 10 minutes or 200 MiB. Choose a shorter length.");
        // count~ takes integer settings. Keep the entire timeline within signed 32-bit range.
        if (totalFrames > 2147483646) throw new Error("These samples are too long for the sample counter.");
        var pair = 0;
        for (i = 0; i < 3; i++) {
            source = sources[i];
            var maximum = clamp(Math.round(repeats[i]), 1, 20);
            var minimum = Math.ceil(maximum / 2);
            var count = minimum + Math.floor(rnd() * (maximum - minimum + 1));
            counts.push(count);
            for (j = 0; j < count; j++) {
                var amplitude = (0.2 + 0.3 * rnd()) * sourceLevels[i];
                var location = 0.01 + 0.47 * rnd();
                var rate = 1 + pitchRange * rnd();
                var direction = rnd() < 0.5 ? -1 : 1;
                var naturalLength = Math.max(2, Math.round(source.durationMs * sampleRate / (1000 * rate)));
                var length = Math.min(naturalLength,totalFrames);
                var a = Math.round(location * totalFrames);
                // Only relevant for sub-millisecond files: keep rounding within the interval.
                a = clamp(a, 0, totalFrames - length);
                var b = totalFrames - a - length;
                var lastMs = source.durationMs * (source.frames - 1) / source.frames * ((length-1)/(naturalLength-1));
                var add = function (start, dir) {
                    var ev = {
                        slot: i, pair: pair, bufferName: source.name,
                        startFrame: start, lengthFrames: length,
                        rate: rate, amplitude: amplitude, direction: dir,
                        positionStartMs: dir === 1 ? 0 : lastMs,
                        positionDeltaMs: dir === 1 ? lastMs : -lastMs,
                        mono: source.channels === 1
                    };
                    events.push(ev);
                    var weight = amplitude * 0.8 * (ev.mono ? Math.SQRT1_2 : 1);
                    edges.push({frame: start, delta: weight});
                    edges.push({frame: start + length, delta: -weight});
                };
                add(a, direction);
                add(b, -direction);
                pair++;
            }
        }
        edges.sort(function (a, b) { return a.frame - b.frame || a.delta - b.delta; });
        var bound = 0, peakBound = 0;
        for (i = 0; i < edges.length; i++) {
            bound += edges[i].delta;
            peakBound = Math.max(peakBound, bound);
        }
        return {
            sampleRate: sampleRate, totalFrames: totalFrames, exactLength: requestedLength>0,
            durationMs: totalFrames * 1000 / sampleRate,
            counts: counts, events: events,
            // Constant for the whole composition. No compressor or moving gain envelope.
            normalization: Math.min(1, 0.85 / Math.max(0.85, peakBound))
        };
    }
    return {makePlan: makePlan};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGPlan;

/* APG offline audio renderer, ES5-compatible for the legacy Max js engine.
 * It has no Max-specific calls. readSource supplies contiguous source samples.
 * Musical construction: Joo Won Park's Audio Palindrome Generator.
 */
var APGRender = (function () {
    "use strict";
    function finite(value) { return typeof value === "number" && isFinite(value); }
    function integer(value) { return finite(value) && Math.floor(value) === value; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }

    function readChecked(reader, slot, channel, first, count) {
        var data = reader(slot, channel, first, count), i;
        // Max versions may return a scalar when exactly one sample is requested.
        if (count === 1 && finite(data)) data = [data];
        if (!data || !integer(data.length) || data.length < count) {
            throw new Error("Source reader returned too few samples.");
        }
        for (i = 0; i < count; i++) {
            if (!finite(data[i])) throw new Error("Source audio contains a non-finite sample.");
        }
        return data;
    }

    function renderChunk(plan, sources, start, count, readSource) {
        var i, j, event, source, end, n, size, left, right, peak = 0;
        if (!plan || !integer(plan.totalFrames) || plan.totalFrames < 0 ||
                !plan.events || !integer(plan.events.length) || plan.events.length < 0 ||
                !finite(plan.normalization) || plan.normalization < 0 || plan.normalization > 1) {
            throw new Error("Invalid render plan.");
        }
        if (!sources || !integer(sources.length) || sources.length < 1) {
            throw new Error("Source metadata is required.");
        }
        if (!integer(start) || start < 0 || start > plan.totalFrames ||
                !integer(count) || count < 0 || typeof readSource !== "function") {
            throw new Error("Invalid render chunk or source reader.");
        }
        size = Math.min(count, plan.totalFrames - start);
        end = start + size;
        left = new Array(size); right = new Array(size);
        for (i = 0; i < size; i++) { left[i] = 0; right[i] = 0; }

        for (i = 0; i < plan.events.length; i++) {
            event = plan.events[i];
            if (!event || !integer(event.slot) || event.slot < 0 || event.slot >= sources.length ||
                    !integer(event.startFrame) || event.startFrame < 0 ||
                    !integer(event.lengthFrames) || event.lengthFrames < 2 ||
                    event.startFrame + event.lengthFrames > plan.totalFrames ||
                    !finite(event.amplitude) || event.amplitude < 0 ||
                    !finite(event.positionStartMs) || !finite(event.positionDeltaMs)) {
                throw new Error("Invalid event in render plan.");
            }
            source = sources[event.slot];
            if (!source || !integer(source.frames) || source.frames < 2 ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    (source.channels !== 1 && source.channels !== 2) ||
                    Boolean(event.mono) !== (source.channels === 1)) {
                throw new Error("Invalid source metadata for render event.");
            }
            var first = Math.max(start, event.startFrame);
            var last = Math.min(end, event.startFrame + event.lengthFrames);
            if (last <= first || size === 0 || event.amplitude === 0 || plan.normalization === 0) continue;

            var denominator = event.lengthFrames - 1;
            // Endpoints are exactly zero. Avoid source I/O for a zero-only overlap.
            first = Math.max(first, event.startFrame + 1);
            last = Math.min(last, event.startFrame + denominator);
            if (last <= first) continue;

            var framesPerMs = source.frames / source.durationMs;
            var sourceStart = event.positionStartMs * framesPerMs;
            var sourceSpan = event.positionDeltaMs * framesPerMs;
            var lastSourceFrame = source.frames - 1;
            var sourceEnd = sourceStart + sourceSpan;
            var tolerance = 1e-6;
            if (!finite(framesPerMs) || !finite(sourceStart) || !finite(sourceEnd) ||
                    sourceStart < -tolerance || sourceStart > lastSourceFrame + tolerance ||
                    sourceEnd < -tolerance || sourceEnd > lastSourceFrame + tolerance) {
                throw new Error("An event reads outside its source buffer.");
            }
            var firstPosition = clamp(sourceStart + ((first - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var lastPosition = clamp(sourceStart + ((last - 1 - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var readFirst = Math.floor(Math.min(firstPosition, lastPosition));
            var readLast = Math.min(lastSourceFrame, Math.floor(Math.max(firstPosition, lastPosition)) + 1);
            var readCount = readLast - readFirst + 1;
            var sourceLeft = readChecked(readSource, event.slot, 1, readFirst, readCount);
            var sourceRight = event.mono ? sourceLeft : readChecked(readSource, event.slot, 2, readFirst, readCount);
            var gain = event.amplitude * 0.8 * (event.mono ? Math.SQRT1_2 : 1) * plan.normalization;

            for (n = first; n < last; n++) {
                // Use the absolute frame, not a running phase accumulator. Chunk
                // boundaries therefore cannot change the generated sample values.
                var phase = (n - event.startFrame) / denominator;
                var envelope = phase < 0.01 ? phase * 100 : (phase > 0.99 ? (1 - phase) * 100 : 1);
                var position = clamp(sourceStart + phase * sourceSpan, 0, lastSourceFrame);
                var index = Math.floor(position);
                var fraction = position - index;
                var a = index - readFirst;
                var b = Math.min(index + 1, lastSourceFrame) - readFirst;
                var scale = envelope * gain;
                j = n - start;
                left[j] += (sourceLeft[a] + fraction * (sourceLeft[b] - sourceLeft[a])) * scale;
                right[j] += (sourceRight[a] + fraction * (sourceRight[b] - sourceRight[a])) * scale;
            }
        }
        for (i = 0; i < size; i++) {
            left[i] = clamp(left[i], -0.99, 0.99);
            right[i] = clamp(right[i], -0.99, 0.99);
            peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
        }
        return {left: left, right: right, peak: peak};
    }
    return {renderChunk: renderChunk};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGRender;

/* Pure musical models for the CMPE Variety Pack Max adaptation.
 * Original algorithms: Joo Won Park, https://joowonpark.net/cmpe/.
 * ES5 only: runs in Max's legacy js object and in Node for verification.
 * Time fields are milliseconds unless their names explicitly say otherwise.
 * Source-reader channels are ONE-based, matching Max Buffer.peek().
 */
var CMPEModel = (function () {
    "use strict";
    var MAX_DURATION_MS = 600000;
    var MAX_OUTPUT_BYTES = 200 * 1024 * 1024;
    var PITCH_SETS = [
        [-12, -10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12],
        [-12, -10, -9, -7, -5, -4, -1, 0, 2, 3, 5, 7, 8, 11, 12],
        [0, 2, 4, 7, 9, -3, -5, -8, -10, -12],
        [-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ];
    var PITCH_NAMES = ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"];

    function finite(value) { return typeof value === "number" && isFinite(value); }
    function integer(value) { return finite(value) && Math.floor(value) === value; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
    function number(value, fallback) { return finite(value) ? value : fallback; }
    function unit(rng) {
        var value = (rng || Math.random)();
        if (!finite(value) || value < 0 || value > 1) {
            throw new Error("Random source must return a number between zero and one.");
        }
        return value;
    }
    function uniform(rng, low, high) { return low + (high - low) * unit(rng); }
    /* Advanced range from settings.adv; falls back to the original fixed value. */
    function advRange(settings, key, def) { var v = settings && settings.adv && settings.adv[key]; return v && v.length === 2 && finite(v[0]) && finite(v[1]) ? v : def; }
    function advValue(settings, key, def) { var v = settings && settings.adv && settings.adv[key]; return finite(v) ? v : def; }
    function choose(rng, values) {
        return values[Math.min(values.length - 1, Math.floor(unit(rng) * values.length))];
    }
    function ratio(semitones) { return Math.pow(2, semitones / 12); }
    function arrayValue(values, index, fallback) {
        return values && finite(values[index]) ? values[index] : fallback;
    }
    function microtonalSet(rng) {
        var values = [], i;
        for (i = 0; i < 12; i++) values.push(uniform(rng, -0.15, 0.15));
        return values;
    }
    function pitchSetIndex(value) {
        var i;
        if (typeof value === "string") {
            for (i = 0; i < PITCH_NAMES.length; i++) {
                if (PITCH_NAMES[i].toLowerCase() === value.toLowerCase()) return i;
            }
            return 1;
        }
        return clamp(Math.round(number(value, 1)), 0, 4);
    }

    /* SuperCollider numeric Env curve interpolation. "exp" is geometric.
     * A numeric curve of zero is linear. Endpoint branches are exact.
     */
    function curve(from, to, phase, shape) {
        var t = clamp(phase, 0, 1), amount;
        if (t <= 0) return from;
        if (t >= 1) return to;
        if (from === to) return from;
        if (shape === "exp") {
            if (from <= 0 || to <= 0) throw new Error("Exponential envelope endpoints must be positive.");
            return from * Math.pow(to / from, t);
        }
        shape = number(shape, 0);
        amount = Math.abs(shape) < 0.000001 ? t :
            (1 - Math.exp(t * shape)) / (1 - Math.exp(shape));
        return from + (to - from) * amount;
    }
    function envelopeValue(segments, timeMs) {
        var t = Math.max(0, timeMs), elapsed = 0, i, seg;
        if (!segments || !segments.length) return 0;
        if (timeMs < 0) return segments[0].from;
        for (i = 0; i < segments.length; i++) {
            seg = segments[i];
            if (seg.durationMs > 0 && t < elapsed + seg.durationMs) {
                return curve(seg.from, seg.to, (t - elapsed) / seg.durationMs, seg.curve);
            }
            elapsed += seg.durationMs;
        }
        return segments[segments.length - 1].to;
    }
    function envelopePoints(segments, stepsPerCurve) {
        var steps = clamp(Math.round(number(stepsPerCurve, 16)), 1, 64);
        var result = [], elapsed = 0, i, j, count, seg, phase, rootLevel;
        if (!segments || !segments.length) return result;
        result.push({timeMs: 0, value: segments[0].from});
        for (i = 0; i < segments.length; i++) {
            seg = segments[i];
            if (!finite(seg.durationMs) || seg.durationMs < 0 ||
                    !finite(seg.from) || !finite(seg.to)) throw new Error("Invalid envelope segment.");
            count = seg.from === seg.to || seg.curve === 0 || seg.durationMs === 0 ? 1 : steps;
            for (j = 1; j <= count; j++) {
                phase = j / count;
                /* Exponential fades span 120 dB. Allocate more knots where
                 * their absolute amplitude curvature is greatest, rather
                 * than spending most knots on almost inaudible levels.
                 */
                if (seg.curve === "exp" && seg.from !== seg.to && j < count) {
                    rootLevel = Math.sqrt(seg.from) + (Math.sqrt(seg.to) - Math.sqrt(seg.from)) * phase;
                    phase = Math.log(rootLevel * rootLevel / seg.from) / Math.log(seg.to / seg.from);
                }
                result.push({timeMs: elapsed + seg.durationMs * phase,
                    value: curve(seg.from, seg.to, phase, seg.curve)});
            }
            elapsed += seg.durationMs;
        }
        return result;
    }
    function defaultSettings(mode, rng) {
        mode = String(mode || "").toLowerCase();
        if (mode === "isjs") return {
            position: 0.5, densityY: 0.5,
            rates: [1.1, 1.03, 1.2], levels: [0.5, 0.5, 0.5],
            panWidths: [uniform(rng, 0.3, 1), uniform(rng, 0.3, 1), uniform(rng, 0.3, 1)]
        };
        if (mode === "many") return {
            level: 1, delayMaxMs: 200, intervalMaxMs: 10000,
            pitchSet: 1, microtonalSet: microtonalSet(rng)
        };
        if (mode === "rmhs") return {
            level: Math.round(uniform(rng, 0.05, 0.5) * 100) / 100,
            fundamentalHz: Math.min(150, 30 + Math.floor(unit(rng) * 121)),
            intervalSemitones: Math.min(14, Math.floor(unit(rng) * 15)),
            durationSeconds: Math.min(200, 20 + Math.floor(unit(rng) * 181)),
            harmonics: Math.min(13, 7 + Math.floor(unit(rng) * 7))
        };
        if (mode === "sioe") return {count: 10, tempo: 120, hitSeconds: 3, form: "long"};
        throw new Error("Unknown CMPE mode.");
    }

    function isjsEvent(settings, slot, rng) {
        settings = settings || {};
        if (!integer(slot) || slot < 0 || slot > 2) throw new Error("ISJS source must be 0, 1, or 2.");
        var y = clamp(number(settings.densityY, 0.5), 0, 1);
        var density = slot === 0 ? 0.5 + 39.5 * y : 0.1 + 34.9 * y;
        var period = 1000 / density;
        var scale = period + 10;
        var level = clamp(arrayValue(settings.levels, slot, 0.5), 0, 1);
        var width = clamp(arrayValue(settings.panWidths, slot, 1), 0, 1);
        var curveRange = advRange(settings, "curve", [1, 2]);
        var shape = uniform(rng, curveRange[0], curveRange[1]);
        var attackShare = clamp(advValue(settings, "attack", 2), 1, 50) / 100;
        var segments = [
            {durationMs: attackShare * scale, from: 0, to: 1, curve: shape},
            {durationMs: (0.99 - attackShare) * scale, from: 1, to: 0, curve: shape}
        ];
        return {
            slot: slot, position: clamp(number(settings.position, 0.5), 0, 1),
            rate: clamp(arrayValue(settings.rates, slot, [1.1, 1.03, 1.2][slot]), 0.3, 1.7),
            level: level, densityHz: density, periodMs: period, durationMs: 0.99 * scale,
            pan: uniform(rng, -width, width), amplitude: level * uniform(rng, 0.9, 1.2),
            segments: segments, envelope: envelopePoints(segments, 12)
        };
    }

    function manyEvent(settings, rng) {
        settings = settings || {};
        var index = pitchSetIndex(settings.pitchSet), pitches, i;
        if (index === 4) {
            pitches = settings.microtonalSet || microtonalSet(rng);
            if (!pitches.length) throw new Error("Microtonal pitch set is empty.");
            for (i = 0; i < pitches.length; i++) {
                if (!finite(pitches[i]) || Math.abs(pitches[i]) > 0.15 + 1e-12) {
                    throw new Error("Microtonal pitches must lie within plus or minus 0.15 semitones.");
                }
            }
        } else pitches = PITCH_SETS[index];
        var semitones = choose(rng, pitches);
        var delayMax = clamp(number(settings.delayMaxMs, 200), 100, 500);
        var voiceDelayMax = delayMax * uniform(rng, 0.5, 1);
        var feed = uniform(rng, 1.02, 1.1);
        var dryDuration = uniform(rng, 2000, 4000);
        var dryCurve = uniform(rng, 0.5, 1.4);
        var fade = advRange(settings, "fade", [2, 4]), decayRange = advRange(settings, "decay", [10, 30]);
        var spread = advRange(settings, "spread", [25, 100]);
        var wetAttack = uniform(rng, fade[0] * 1000, fade[1] * 1000);
        var stages = [], left, right, decay;
        for (i = 0; i < 7; i++) {
            left = uniform(rng, voiceDelayMax * (spread[0] / 100), voiceDelayMax * (spread[1] / 100));
            right = uniform(rng, voiceDelayMax * (spread[0] / 100), voiceDelayMax * (spread[1] / 100));
            decay = uniform(rng, decayRange[0], decayRange[1]);
            stages.push({leftMs: left, rightMs: right, decaySeconds: decay,
                leftK: Math.min(0.999999, Math.pow(0.001, left / (1000 * decay))),
                rightK: Math.min(0.999999, Math.pow(0.001, right / (1000 * decay)))});
        }
        /* The SC file supplies four curve values for three segments. Its
         * fourth (negative) value is unused: the actual release curve is +1.
         */
        var drySegments = [
            {durationMs: dryDuration * 0.1, from: 0.00001, to: 1, curve: dryCurve},
            {durationMs: dryDuration * 0.4, from: 1, to: 1, curve: 1},
            {durationMs: dryDuration * 0.5, from: 1, to: 0.00001, curve: 1}
        ];
        var wetSegments = [{durationMs: wetAttack, from: 0.00001, to: 1, curve: 4}];
        return {
            slot: 0, pitchSet: index, semitones: semitones, rate: ratio(semitones),
            level: clamp(number(settings.level, 1), 0, 2), feed: feed,
            voiceDelayMaxMs: voiceDelayMax, stages: stages,
            dryDurationMs: dryDuration, drySegments: drySegments, dryEnvelope: envelopePoints(drySegments, 12),
            wetAttackMs: wetAttack, wetSegments: wetSegments, wetEnvelope: envelopePoints(wetSegments, 24),
            nextMs: uniform(rng, 0.5, 1) * clamp(number(settings.intervalMaxMs, 10000), 5000, 20000),
            microtonalSet: index === 4 ? pitches.slice(0) : null
        };
    }

    function rmhsPlan(settings, sampleRate, rng) {
        settings = settings || {};
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("A positive output sample rate is required.");
        var level = clamp(number(settings.level, 0.2), 0, 1), base = level * 0.25;
        var fundamental = clamp(number(settings.fundamentalHz, 100), 0, 20000);
        var interval = clamp(number(settings.intervalSemitones, 7), 0, 24);
        var harmonicCount = clamp(Math.round(number(settings.harmonics, 10)), 3, 20);
        var duration = Math.abs(number(settings.durationSeconds, 100)) * 1000;
        if (!finite(duration)) throw new Error("Drone duration is too large.");
        var voices = [], skipped = 0, total = 0, longest = 0, bank, h, count;
        var frequency, pan, amplitude, driftRate, attack, release, segments, voiceDuration;
        var attackRange = advRange(settings, "attack", [3, 20]), spreadRange = advRange(settings, "spread", [20, 70]);
        var driftRange = advRange(settings, "drift", [0.001, 0.3]), depth = clamp(advValue(settings, "depth", 2), 0, 5) / 100;
        var harmony = settings.harmony || {}, tuning = harmony.tuning === 1 ? 1 : 0, seriesKind = finite(harmony.series) ? clamp(Math.round(harmony.series), 0, 2) : 0;
        var tilt = finite(harmony.tilt) ? clamp(harmony.tilt, 0.3, 3) : 1, sideRatio = RMHSTheory.sideRatio(interval, tuning);
        var harmonicNumbers = RMHSTheory.series(seriesKind, harmonicCount), hn;
        for (bank = 0; bank < 3; bank++) {
            count = bank === 0 ? Math.round(harmonicCount * 3 / 4) : harmonicCount;
            for (h = 1; h <= count; h++) {
                total++;
                hn = harmonicNumbers[h - 1];
                frequency = fundamental * hn * (bank === 0 ? 1 : (tuning === 0 ? ratio(interval) : sideRatio));
                /* Reserve room for the complete positive pitch drift. */
                if (frequency <= 0 || frequency * (1 + depth) >= sampleRate / 2) { skipped++; continue; }
                pan = bank === 0 ? 0 : (bank === 1 ? uniform(rng, spreadRange[0] / 100, spreadRange[1] / 100) : uniform(rng, -spreadRange[1] / 100, -spreadRange[0] / 100));
                amplitude = base * (bank === 0 ? 2 : 1) * (2 / 3) / (tilt === 1 ? hn : Math.pow(hn, tilt));
                driftRate = uniform(rng, driftRange[0], driftRange[1]);
                attack = uniform(rng, attackRange[0] * 1000, attackRange[1] * 1000);
                release = duration * uniform(rng, 0.5, 1);
                voiceDuration = attack + 0.5 * duration + release;
                segments = [
                    {durationMs: attack, from: 0.000001, to: 1, curve: "exp"},
                    {durationMs: duration * 0.5, from: 1, to: 1, curve: "exp"},
                    {durationMs: release, from: 1, to: 0.000001, curve: "exp"}
                ];
                voices.push({bank: ["center", "right", "left"][bank], harmonic: hn,
                    frequencyHz: frequency, amplitude: amplitude, pan: pan,
                    driftRateHz: driftRate, driftMaxHz: frequency * depth, driftLagMs: 500 / driftRate,
                    modRateHz: uniform(rng, 0.002, 0.02), modPhase: uniform(rng, 0, Math.PI),
                    durationMs: voiceDuration, segments: segments, envelope: envelopePoints(segments, 14)});
                longest = Math.max(longest, voiceDuration);
            }
        }
        return {voices: voices, durationMs: longest, skippedPartials: skipped,
            totalPartials: total, sampleRate: sampleRate, harmonics: harmonicCount};
    }

    function sourceCheck(source) {
        if (!source || !integer(source.frames) || source.frames < 1 ||
                !finite(source.durationMs) || source.durationMs <= 0 ||
                (source.channels !== 1 && source.channels !== 2)) {
            throw new Error("Load a valid mono or stereo source in sample 1.");
        }
    }
    function outputGuard(frames, sampleRate) {
        if (!integer(frames) || frames < 1 || !finite(sampleRate) || sampleRate <= 0) {
            throw new Error("Invalid output duration or sample rate.");
        }
        if (frames * 1000 / sampleRate > MAX_DURATION_MS + 1e-7 || frames * 8 > MAX_OUTPUT_BYTES) {
            throw new Error("This supercut exceeds the 10-minute / 200 MiB output limit. Reduce the count or hit duration, or increase tempo.");
        }
    }
    function concurrency(events) {
        var points = [], i, running = 0, maximum = 0;
        for (i = 0; i < events.length; i++) {
            points.push({frame: events[i].startFrame, delta: 1});
            points.push({frame: events[i].startFrame + events[i].lengthFrames, delta: -1});
        }
        points.sort(function (a, b) { return a.frame - b.frame || a.delta - b.delta; });
        for (i = 0; i < points.length; i++) {
            running += points[i].delta;
            maximum = Math.max(maximum, running);
        }
        return maximum;
    }
    function sioePlan(sources, settings, sampleRate, rng) {
        settings = settings || {};
        sourceCheck(sources && sources[0]);
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("A positive output sample rate is required.");
        var count = clamp(Math.round(number(settings.count, 10)), 1, 100);
        var tempo = clamp(number(settings.tempo, 120), 1, 3000);
        var hitSeconds = clamp(number(settings.hitSeconds, 3), 0.00001, 10);
        var form = settings.form === "short" || settings.form === 0 ? "short" : "long";
        var beatMs = 240000 / tempo;
        var nominalFrames = form === "long" ? Math.round(2 * count * beatMs * sampleRate / 1000) : 1;
        outputGuard(Math.max(1, nominalFrames), sampleRate);
        var source = sources[0], events = [], longest = nominalFrames, order = 0;
        var chord, voices, slice, start, attack, release, pan, amplitude, length, ev;
        var chords = form === "short" ? 1 : 2 * count;
        var attackRange = advRange(settings, "attack", [10, 300]), releaseRange = advRange(settings, "release", [50, 100]);
        var spread = clamp(advValue(settings, "spread", 100), 0, 100) / 100;
        for (chord = 0; chord < chords; chord++) {
            voices = form === "short" ? count : (chord < count ? chord + 1 : 2 * count - chord - 1);
            start = form === "short" ? 0 : Math.round(chord * beatMs * sampleRate / 1000);
            for (slice = 1; slice <= voices; slice++) {
                attack = uniform(rng, attackRange[0], attackRange[1]);
                release = uniform(rng, hitSeconds * (releaseRange[0] * 10), hitSeconds * (releaseRange[1] * 10));
                pan = uniform(rng, -spread, spread);
                amplitude = 0.9 / (voices * (form === "short" ? 0.4 : 0.8));
                length = Math.ceil((attack + release) * sampleRate / 1000) + 1;
                ev = {slot: 0, order: order++, chord: chord, chordVoices: voices, slice: slice,
                    startFrame: start, lengthFrames: length,
                    sourceStartFrame: (slice % count) * source.frames / count,
                    rate: 1, attackMs: attack, releaseMs: release, curve: uniform(rng, -5, -4),
                    pan: pan, amplitude: amplitude,
                    gainLeft: amplitude * Math.cos((pan + 1) * Math.PI / 4),
                    gainRight: amplitude * Math.sin((pan + 1) * Math.PI / 4)};
                events.push(ev);
                longest = Math.max(longest, start + length);
            }
        }
        outputGuard(longest, sampleRate);
        var maxConcurrent = concurrency(events), workFrames = 0;
        for (chord = 0; chord < events.length; chord++) workFrames += events[chord].lengthFrames;
        return {mode: "sioe", form: form, count: count, tempo: tempo, hitSeconds: hitSeconds,
            events: events, totalFrames: longest, sampleRate: sampleRate,
            durationMs: longest * 1000 / sampleRate, normalization: 1,
            chordIntervalMs: beatMs, nominalFrames: nominalFrames,
            maxConcurrent: maxConcurrent, workFrames: workFrames,
            recommendedChunkFrames: Math.max(16, Math.min(4096, Math.floor(131072 / Math.max(1, maxConcurrent))))};
    }

    /* Bounded source-page cache. The file is never materialized into a full JS
     * array. The same path also handles one-frame buffers and repeated wraps.
     */
    function SourceCache(sources, reader) {
        this.sources = sources; this.reader = reader;
        this.pageFrames = 2048; this.maxPages = 256;
        this.pages = {}; this.order = [];
    }
    SourceCache.prototype.sample = function (slot, channel, index) {
        var source = this.sources[slot], pageIndex = Math.floor(index / this.pageFrames);
        var key = slot + ":" + channel + ":" + pageIndex, page = this.pages[key];
        var first, count, values, i;
        if (!page) {
            first = pageIndex * this.pageFrames;
            count = Math.min(this.pageFrames, source.frames - first);
            values = this.reader(slot, channel, first, count);
            if (count === 1 && finite(values)) values = [values];
            if (!values || !integer(values.length) || values.length < count) {
                throw new Error("Source reader returned too few samples.");
            }
            for (i = 0; i < count; i++) {
                if (!finite(values[i])) throw new Error("Source audio contains a non-finite sample.");
            }
            page = {first: first, values: values};
            if (this.order.length >= this.maxPages) delete this.pages[this.order.shift()];
            this.order.push(key); this.pages[key] = page;
        }
        return page.values[index - page.first];
    };
    function SioeRenderer(plan, sources, reader) {
        if (!plan || !plan.events || !integer(plan.events.length) ||
                !finite(plan.normalization) || plan.normalization < 0 || plan.normalization > 1 ||
                typeof reader !== "function") throw new Error("Invalid supercut render plan or reader.");
        sourceCheck(sources && sources[0]);
        outputGuard(plan.totalFrames, plan.sampleRate);
        var i, event, previous = -1;
        for (i = 0; i < plan.events.length; i++) {
            event = plan.events[i];
            if (!event || event.slot !== 0 || !integer(event.startFrame) || event.startFrame < 0 || event.startFrame < previous ||
                    !integer(event.lengthFrames) || event.lengthFrames < 1 ||
                    event.startFrame + event.lengthFrames > plan.totalFrames ||
                    !finite(event.sourceStartFrame) || event.sourceStartFrame < 0 ||
                    event.sourceStartFrame >= sources[0].frames ||
                    !finite(event.attackMs) || event.attackMs <= 0 || !finite(event.releaseMs) || event.releaseMs <= 0 ||
                    !finite(event.gainLeft) || !finite(event.gainRight) || !finite(event.curve)) {
                throw new Error("Invalid event in supercut render plan.");
            }
            previous = event.startFrame;
        }
        this.plan = plan; this.sources = sources; this.cache = new SourceCache(sources, reader);
        this.next = 0; this.active = []; this.lastEnd = 0;
    }
    SioeRenderer.prototype.renderChunk = function (start, count) {
        var plan = this.plan, source = this.sources[0], i, n, event, first, last, sampleTime, env;
        if (!integer(start) || start < 0 || start > plan.totalFrames || !integer(count) || count < 0) {
            throw new Error("Invalid supercut render chunk.");
        }
        var size = Math.min(count, plan.totalFrames - start), end = start + size;
        var left = new Array(size), right = new Array(size), active = [], peak = 0;
        var step = source.frames * 1000 / (source.durationMs * plan.sampleRate);
        var position, index, nextIndex, fraction, a, b, value, offset;
        for (i = 0; i < size; i++) { left[i] = 0; right[i] = 0; }
        if (start !== this.lastEnd) { this.next = 0; this.active = []; }
        for (i = 0; i < this.active.length; i++) {
            if (this.active[i].startFrame + this.active[i].lengthFrames > start) active.push(this.active[i]);
        }
        while (this.next < plan.events.length && plan.events[this.next].startFrame < end) {
            event = plan.events[this.next++];
            if (event.startFrame + event.lengthFrames > start) active.push(event);
        }
        this.active = active; this.lastEnd = end;
        for (i = 0; i < active.length; i++) {
            event = active[i];
            first = Math.max(start, event.startFrame);
            last = Math.min(end, event.startFrame + event.lengthFrames);
            if (plan.normalization === 0) continue;
            for (n = first; n < last; n++) {
                sampleTime = (n - event.startFrame) * 1000 / plan.sampleRate;
                if (sampleTime <= 0 || sampleTime >= event.attackMs + event.releaseMs) continue;
                env = sampleTime < event.attackMs ? curve(0, 1, sampleTime / event.attackMs, event.curve) :
                    curve(1, 0, (sampleTime - event.attackMs) / event.releaseMs, event.curve);
                /* Absolute frame math makes output independent of chunk sizes. */
                position = (event.sourceStartFrame + (n - event.startFrame) * step) % source.frames;
                index = Math.floor(position); nextIndex = (index + 1) % source.frames;
                fraction = position - index;
                a = this.cache.sample(0, 1, index); b = this.cache.sample(0, 1, nextIndex);
                value = a + (b - a) * fraction;
                if (source.channels === 2) {
                    a = this.cache.sample(0, 2, index); b = this.cache.sample(0, 2, nextIndex);
                    value += a + (b - a) * fraction;
                }
                value *= env * plan.normalization;
                offset = n - start;
                left[offset] += value * event.gainLeft;
                right[offset] += value * event.gainRight;
            }
        }
        for (i = 0; i < size; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
        return {left: left, right: right, peak: peak, frames: size, startFrame: start};
    };
    function createSioeRenderer(plan, sources, reader) { return new SioeRenderer(plan, sources, reader); }
    function renderSioeChunk(plan, sources, start, count, reader) {
        return createSioeRenderer(plan, sources, reader).renderChunk(start, count);
    }
    return {
        version: 1, MAX_DURATION_MS: MAX_DURATION_MS, MAX_OUTPUT_BYTES: MAX_OUTPUT_BYTES,
        pitchNames: PITCH_NAMES.slice(0),
        pitchSets: [PITCH_SETS[0].slice(0), PITCH_SETS[1].slice(0), PITCH_SETS[2].slice(0), PITCH_SETS[3].slice(0)],
        curve: curve, envelopeValue: envelopeValue, envelopePoints: envelopePoints,
        defaultSettings: defaultSettings, makeMicrotonalSet: microtonalSet,
        isjsEvent: isjsEvent, manyEvent: manyEvent, rmhsPlan: rmhsPlan,
        sioePlan: sioePlan, createSioeRenderer: createSioeRenderer, renderSioeChunk: renderSioeChunk
    };
}());
if (typeof module !== "undefined" && module.exports) module.exports = CMPEModel;

/* APG Wave: Max 8/9 legacy-js controller. APGPlan and APGRender are embedded
 * above this file in apg_wave.js. Original musical algorithm: Joo Won Park.
 */
autowatch = 0;
inlets = 1;
outlets = 4; // groove~, speed sig~, run gate, sample counter
var host = this;
var prefix = "apgw_advanced_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000000000);
var outputName = prefix + "_output";
var sources = [null, null, null], sourceBuffers = [null, null, null];
var paths = ["", "", ""], loading = [false, false, false], loadTasks = [null, null, null];
var repetitions = [3, 4, 5], pitchRange = 0.5, monitorDb = 0; // FX bus ceiling holds peaks at -0.18 dBFS
var audioOn = false, sampleRate = 0, state = "idle", initialized = false;
var plan = null, output = null, outputReady = false, dirty = true;
// Keep the original plan's coordinates intact; the output can be a shorter,
// symmetrically cropped interval of that plan.
var outputFrames = 0, outputDurationMs = 0, trimFrames = 0;
var scanFrame = 0, scanLimit = 0;
var silenceThreshold = 0.00001, trimPaddingMs = 25, minimumSilenceMs = 250;
var renderFrame = 0, renderHalf = 0, renderStarted = 0, renderPeak = 0;
var firstAudioFrame = -1, renderTask = null, lastWaveRefresh = 0;
var audioTask = null, demoTask = null, finishTask = null, selectionTask = null;
var startAction = "play", autoPlay = false, audioAttempts = 0, playToken = 0;
var audioReadyRate=0,audioReadySince=0;
var apgAdvanced=APGAdvancedModel.defaults(),apgSeedPrepared=false;
var sourcePreparing=[false,false,false];
var loopEnabled = true, selectedStart = 0, selectedEnd = 0;
var activeStart = 0, activeEnd = 0, pendingSelection = [0, 0], updatingWave = false;
var savePending = false, saveTask = null, savePath = "";

function named(name) { return host.patcher.getnamed(name); }
function ui(name, value) { var o = named(name); if (o) o.message("set", value); }
function status(value) { ui("status", value); }
function finite(value) { return typeof value === "number" && isFinite(value); }
function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
function slotOK(slot) { return finite(slot) && Math.floor(slot) === slot && slot >= 0 && slot < 3; }
function fileName(path) { return String(path).split(/[\\/:]/).pop(); }
function shortName(path) { var s = fileName(path); return s.length > 25 ? s.substring(0, 15) + "..." + s.substring(s.length - 7) : s; }
function localfile(name) {
    var path = String(host.patcher.filepath || ""), slash = path.lastIndexOf("/");
    return slash < 0 ? name : path.substring(0, slash + 1) + name;
}
function mutable() { return state === "idle" || state === "ready"; }
function cancelTask(task) { if (task) task.cancel(); }
function lockUI(flag) {
    var names = ["load1", "load2", "load3", "repeat1", "repeat2", "repeat3", "pitch", "demo_button", "new_button"];
    var i;
    for (i = 0; i < names.length; i++) { var o = named(names[i]); if (o) o.message("ignoreclick", flag ? 1 : 0); }
    var busy = state === "rendering" || state === "waiting" || state === "stopping";
    var optional = ["play_button", "loop_toggle", "clear_button", "save_button"];
    for (i = 0; i < optional.length; i++) {
        var item = named(optional[i]);
        if (item) item.message("ignoreclick", (busy || (optional[i] === "save_button" && !outputReady)) ? 1 : 0);
    }
    named("wave_l").message("setmode", outputReady && !busy ? 1 : 0);
    named("wave_r").message("setmode", outputReady && !busy ? 1 : 0);
}
function waveformLine(ms) { named("wave_l").message("line", ms); named("wave_r").message("line", ms); }
function refreshWave(resetRange) {
    updatingWave = true;
    named("wave_l").message("set", outputName, 1);
    named("wave_r").message("set", outputName, 2);
    if (plan) named("wave_link").message("list", 0, outputDurationMs,
        resetRange ? 0 : selectedStart, resetRange ? outputDurationMs : selectedEnd);
    updatingWave = false;
}
function loadbang() {
    if (initialized) return;
    initialized = true;
    var i;
    outlet(1, 0); outlet(2, 0); outlet(3, "stop");
    for (i = 0; i < 3; i++) named("source" + (i + 1)).message("name", prefix + "_source" + i);
    named("output_buffer").message("name", outputName);
    output = new Buffer(outputName);
    outlet(0, "set", outputName);
    named("wave_l").message("set", outputName, 1); named("wave_r").message("set", outputName, 2);
    named("wave_l").message("buftime", 150); named("wave_r").message("buftime", 150);
    named("wave_l").message("mouseoutput", "up"); named("wave_r").message("mouseoutput", "up");
    waveformLine(-1);
    ui("repeat1", 3); ui("repeat2", 4); ui("repeat3", 5); ui("pitch", 0.5);
    ui("loop_toggle", 1); ui("monitor_level", monitorDb); ui("progress", 0); ui("time", "0.0 s");
    named("monitor_gain").message("float", Math.pow(10, monitorDb / 20));
    ui("render_info", "Automatic edge trimming is on. Press PLAY to generate.");
    ui("selection_info", "Drag across the output to choose a loop.");
    status("Loading demo sounds...");
    lockUI(false);
    named("dsp_info").message("bang");
    demoTask = new Task(function () { demos(); }, host); demoTask.schedule(50);
    post("APG Wave: ready to load sources.\n");
}
function markDirty() {
    dirty = true;
    status(outputReady ? "Settings changed. PLAY will generate a new result." : "Ready. PLAY generates the waveform, then plays it.");
}
function loadfile(slot) {
    slot = Number(slot);
    var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
    if (!slotOK(slot) || !path || !mutable()) return;
    if (loading[slot]) { status("This source is still loading."); return; }
    loading[slot] = true; sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = path; dirty = true;
    ui("file" + (slot + 1), "Loading..."); status("Loading source audio...");
    var nativeBuffer=named("source"+(slot+1));
    try {
        // Empty sentinel prevents an old buffer being mistaken for a finished import.
        sourcePreparing[slot]=true;
        nativeBuffer.message("sizeinsamps",1,1);
        nativeBuffer.message("clear");
        var command=/\.(wav|wave|aif|aiff|aifc|au|snd)$/i.test(path)?"replace":"importreplace";
        nativeBuffer.message(command,path);
        sourcePreparing[slot]=false;
        watchSourceLoad(slot);
    } catch(e) { sourcePreparing[slot]=false;failSourceLoad(slot,"Import failed: "+e.message); }

}
function loaded(slot) {
    slot = Number(slot); if (!slotOK(slot)) return;
    cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
    try {
        var name = prefix + "_source" + slot, b = new Buffer(name);
        var frames = b.framecount(), duration = b.length(), channels = b.channelcount();
        if (frames < 2 || !finite(duration) || duration <= 0 || (channels !== 1 && channels !== 2)) throw new Error("Use mono or stereo audio.");
        sourceBuffers[slot] = b;
        sources[slot] = {name: name, frames: frames, durationMs: duration, channels: channels};
        ui("file" + (slot + 1), shortName(paths[slot]) + "\n" + (duration / 1000).toFixed(2) + " s / " + (channels === 1 ? "mono" : "stereo"));
        if(host.regionloaded){try{host.regionloaded(slot);}catch(editorError){post("CMPE source loaded; editor refresh deferred: "+editorError+"\n");}}
        if (sources[0] && sources[1] && sources[2] && !loading[0] && !loading[1] && !loading[2]) {
            ui("duration", "Before trim: " + (2 * Math.max(sources[0].durationMs, sources[1].durationMs, sources[2].durationMs) / 1000).toFixed(1) + " s");
            markDirty();
        }
    } catch (e) { failSourceLoad(slot,e.message); }
}
function demos() {
    if (!mutable()) return;
    loadfile(0, localfile("apgw_test1.wav")); loadfile(1, localfile("apgw_test2.wav")); loadfile(2, localfile("apgw_test3.wav"));
}
function repeats(slot, value) {
    slot = Number(slot); value = Number(value); if (!slotOK(slot)) return;
    if (mutable() && finite(value)) { repetitions[slot] = clamp(Math.round(value), 1, 20); markDirty(); }
    ui("repeat" + (slot + 1), repetitions[slot]);
}
function pitch(value) {
    value = Number(value); if (mutable() && finite(value)) { pitchRange = clamp(value, 0, 1); markDirty(); }
    ui("pitch", pitchRange);
}
function monitor(value) {
    value = Number(value); if (!finite(value)) return;
    monitorDb = clamp(value, -72, 18); ui("monitor_level", monitorDb);
    named("monitor_gain").message("list", Math.pow(10, monitorDb / 20), 20);
}
function dspstate(value) {
    audioOn = Number(value) !== 0;
    if (!audioOn && state === "playing") finishPlayback("Audio stopped. The generated result is still available.");
}
function samplerate(value) {
    value = Number(value); if (!finite(value) || value <= 0) return;
    if (state === "playing" && sampleRate > 0 && value !== sampleRate) finishPlayback("Audio settings changed. Press PLAY again.");
    sampleRate = value;
}
function play() {
    if (state === "playing") return;
    if (!mutable()) return;
    requestAudio(dirty || !outputReady ? "renderplay" : "play");
}
function newpiece() {
    if (!mutable()) return;
    requestAudio("render");
}
function requestAudio(action) {
    if (savePending && action !== "play") { status("Wait for the WAV save to finish before generating again."); return; }
    if (loading[0] || loading[1] || loading[2]) { status("Please wait for the sources to finish loading."); return; }
    if (!sources[0] || !sources[1] || !sources[2]) { status("Load three samples or choose DEMO."); return; }
    state = "waiting"; startAction = action; audioAttempts = 0; audioReadyRate=0; audioReadySince=0; lockUI(true);
    status("Starting audio..."); named("audio_driver").message("startwindow");
    audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
}
function waitForAudio() {
    if (state !== "waiting") return;
    named("dsp_info").message("bang");
    if (audioOn && sampleRate > 0) {
        var readyNow=new Date().getTime();
        if(audioReadyRate!==sampleRate){audioReadyRate=sampleRate;audioReadySince=readyNow;}
        if(readyNow-audioReadySince<300){audioTask.schedule(50);return;}
        if (startAction === "play") beginPlayback(); else beginRender(startAction === "renderplay");
        return;
    }
    audioAttempts++;
    if (audioAttempts >= 100) { state = outputReady ? "ready" : "idle"; lockUI(false); status("Audio did not start. Check Max Audio Status."); return; }
    audioTask.schedule(100);
}
function beginRender(thenPlay) {
    try {
        if(!apgAdvanced.variationLocked&&!apgSeedPrepared)apgAdvanced.seed=APGAdvancedModel.freshSeed();
        apgSeedPrepared=false;
        plan=APGPlan.makePlan(sources,repetitions,pitchRange,sampleRate,APGAdvancedModel.random(apgAdvanced.seed),apgAdvanced);
        if(this.advrefresh)this.advrefresh();
    }
    catch (e) { state = outputReady ? "ready" : "idle"; lockUI(false); status(e.message); return; }
    state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
    outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2); renderPeak = 0; firstAudioFrame = -1;
    scanLimit = renderHalf; scanFrame = scanLimit;
    var i;
    // Frames before every scheduled event are known to be zero. Starting at
    // the earliest event avoids calculating a potentially very long empty gap.
    for (i = 0; i < plan.events.length; i++) scanFrame = Math.min(scanFrame, plan.events[i].startFrame);
    renderStarted = new Date().getTime(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
    outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
    lockUI(true); named("stop_button").message("text", "CANCEL"); ui("progress", 0);
    ui("render_info", "Finding the start of the sound..."); status("Checking the quiet beginning and ending..."); waveformLine(-1);
    renderTask = new Task(scanOpening, host); renderTask.schedule(1);
}
function scanOpening() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        while (scanFrame < scanLimit) {
            var count = Math.min(chunkSize, scanLimit - scanFrame);
            var chunk = APGRender.renderChunk(plan, sources, scanFrame, count, readSource);
            if (chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) {
                    if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) {
                        firstAudioFrame = scanFrame + i;
                        prepareOutput(); return;
                    }
                }
            }
            scanFrame += count;
            if (new Date().getTime() - tickStart >= 10) break;
        }
        ui("render_info", "Checking opening  /  " + (scanFrame / plan.sampleRate).toFixed(1) + " s examined");
        if (scanFrame >= scanLimit) prepareOutput(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function prepareOutput() {
    if (state !== "rendering") return;
    if (!plan.exactLength && firstAudioFrame >= Math.ceil(minimumSilenceMs * plan.sampleRate / 1000)) {
        var padding = Math.max(1, Math.round(trimPaddingMs * plan.sampleRate / 1000));
        trimFrames = Math.max(0, firstAudioFrame - padding);
        trimFrames = Math.min(trimFrames, Math.floor((plan.totalFrames - 2) / 2));
    }
    outputFrames = plan.totalFrames - 2 * trimFrames;
    outputDurationMs = outputFrames * 1000 / plan.sampleRate;
    if (firstAudioFrame >= 0) firstAudioFrame -= trimFrames;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2);
    selectedStart = 0; selectedEnd = outputDurationMs;
    ui("render_info", "Rendering 0%"); ui("progress", 0);
    status(trimFrames > 0 ? "Quiet edges trimmed. Rendering the shorter piece..." : "Rendering audio. CANCEL stops generation.");
    cancelTask(renderTask);
    renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
}
function allocateOutput() {
    if (state !== "rendering") return;
    try {
        var b = named("output_buffer");
        b.message("sr", plan.sampleRate); b.message("sizeinsamps", outputFrames, 2); b.message("clear");
        output = new Buffer(outputName);
        if (output.framecount() !== outputFrames || output.channelcount() !== 2) throw new Error("Output buffer allocation did not complete.");
        refreshWave(true);
        renderTask = new Task(renderTick, host); renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function readSource(slot, channel, first, count) { return sourceBuffers[slot].peek(channel, first, count); }
function renderTick() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        do {
            var count = Math.min(chunkSize, renderHalf - renderFrame);
            var chunk = APGRender.renderChunk(plan, sources, trimFrames + renderFrame, count, readSource);
            output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
            // Reflect the already computed half: exact matching stored sample pairs,
            // half as much mixing, and no full-file JavaScript arrays.
            var mirrorStart = outputFrames - renderFrame - count;
            output.poke(1, mirrorStart, chunk.left.slice(0).reverse());
            output.poke(2, mirrorStart, chunk.right.slice(0).reverse());
            if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) { firstAudioFrame = renderFrame + i; break; }
            }
            renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
        } while (renderFrame < renderHalf && new Date().getTime() - tickStart < 10);
        var now = new Date().getTime(), fraction = renderFrame / renderHalf;
        ui("progress", fraction);
        ui("render_info", "Rendering " + Math.floor(fraction * 100) + "%  /  " + ((now - renderStarted) / 1000).toFixed(1) + " s elapsed");
        status("Rendering audio. CANCEL stops generation.");
        if (now - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now; }
        if (renderFrame >= renderHalf) renderComplete(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function renderComplete() {
    state = "ready"; outputReady = true; dirty = false; cancelTask(renderTask); renderTask = null;
    refreshWave(true); waveformLine(0); selectedStart = 0; selectedEnd = outputDurationMs;
    pendingSelection = [selectedStart, selectedEnd];
    ui("progress", 1); ui("time", "0.0 / " + (outputDurationMs / 1000).toFixed(1) + " s");
    ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
    var trimSummary = trimFrames > 0 ? "  /  trimmed " + (trimFrames / plan.sampleRate).toFixed(2) + " s from each end" : (firstAudioFrame < 0 ? "  /  too quiet to trim" : "  /  no long edge silence");
    ui("render_info", "Ready" + trimSummary);
    named("stop_button").message("text", "STOP"); lockUI(false); selectionLabel();
    status(firstAudioFrame < 0 ? (renderPeak === 0 ? "The rendered output is silent. Check the source samples." : "Very quiet result. Edges kept; press PLAY to listen.") : "Ready. PLAY replays this result; NEW generates another.");
    if (autoPlay && firstAudioFrame >= 0) beginPlayback();
}
function renderFailed(message) {
    cancelTask(renderTask); renderTask = null; state = "idle"; outputReady = false; dirty = true;
    named("stop_button").message("text", "STOP"); lockUI(false);
    ui("render_info", "Render did not complete."); status(message); post("APG Wave render: " + message + "\n");
}
function beginPlayback() {
    if (this.fxsend) this.fxsend("resume");
    if (!outputReady || !plan) return;
    if (!audioOn || sampleRate <= 0) {
        state = "ready"; lockUI(false);
        status("Audio stopped. Press PLAY to start audio and play this result."); return;
    }
    state = "playing"; playToken++; activeStart = selectedStart; activeEnd = selectedEnd;
    if (activeEnd - activeStart < 2 * 1000 / plan.sampleRate) { activeStart = 0; activeEnd = outputDurationMs; }
    var duration = activeEnd - activeStart;
    // Reset the old counter while completion is disabled, before assigning the
    // new run's token. A queued completion from an earlier run keeps its old token.
    outlet(2, 0); outlet(1, 0); named("loop_flag").message("float", 1);
    outlet(3, "stop");
    named("play_token").message("set", playToken);
    named("total_frames").message("int", Math.max(2, Math.round(duration * sampleRate / 1000)));
    named("edge_scale").message("float", duration / Math.min(5, duration / 4));
    outlet(0, "set", outputName);
    outlet(0, "setloop", activeStart, activeEnd); outlet(0, "loop", 1);
    outlet(0, "startloop"); outlet(3, "bang");
    named("loop_flag").message("float", loopEnabled ? 1 : 0);
    outlet(1, 1); outlet(2, 1, 5);
    lockUI(true); waveformLine(activeStart);
    status(loopEnabled ? "Looping selection..." : "Playing...");
}
function phase(value) {
    value = Number(value); if (state !== "playing" || !finite(value)) return;
    var ms = activeStart + clamp(value, 0, 1) * (activeEnd - activeStart);
    waveformLine(ms); ui("time", (ms / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
    var firstMs = firstAudioFrame < 0 ? -1 : firstAudioFrame * 1000 / plan.sampleRate;
    if (firstMs >= 0 && ms < firstMs && firstMs < activeEnd) status("Playing: first sound in " + ((firstMs - ms) / 1000).toFixed(1) + " s.");
    else status(loopEnabled ? "Looping selection..." : "Playing...");
}
var basePhase = phase; // playhead-only handler, captured before UI wrappers
function ended(token) {
    if (state === "playing" && !loopEnabled && Number(token) === playToken) {
        waveformLine(activeEnd); ui("time", (activeEnd / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
        finishPlayback("Done. Replay, select a loop, or generate NEW.");
    }
}
function finishPlayback(message) {
    cancelTask(finishTask); finishTask = null;
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
    state = outputReady ? "ready" : "idle"; lockUI(false); status(message);
}
function stop() {
    cancelTask(audioTask); audioTask = null; cancelTask(selectionTask); selectionTask = null;
    cancelTask(finishTask); finishTask = null;
    if (state === "rendering") { renderFailed("Rendering cancelled. Press PLAY to try again."); return; }
    if (state === "waiting") { state = outputReady ? "ready" : "idle"; lockUI(false); status("Cancelled."); return; }
    if (state === "stopping") { finishPlayback("Stopped. The waveform is ready to replay."); return; }
    if (state === "playing") {
        state = "stopping"; outlet(2, 0, 8);
        finishTask = new Task(function () { finishPlayback("Stopped. The waveform is ready to replay."); }, host); finishTask.schedule(12);
    } else { status(outputReady ? "Ready. Select a range or press PLAY." : "Ready to generate."); }
}
function wavechange(viewStart, viewLength, a, b) {
    if (updatingWave || !outputReady || (state !== "ready" && state !== "playing")) return;
    a = Number(a); b = Number(b); if (!finite(a) || !finite(b)) return;
    pendingSelection = [a, b];
}
function wavemouse(x, y, event) {
    if (Number(event) !== 0 || updatingWave || !outputReady) return;
    cancelTask(selectionTask);
    selectionTask = new Task(commitSelection, host); selectionTask.schedule(1);
}
function commitSelection() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    var a = clamp(Math.min(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    var b = clamp(Math.max(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    // Snap to actual stored frames without destructive waveform edits.
    a = Math.round(a * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    b = Math.round(b * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    if (b - a < 2 * 1000 / plan.sampleRate) { a = 0; b = outputDurationMs; }
    selectedStart = a; selectedEnd = b; pendingSelection = [a, b];
    loopEnabled=true;ui("loop_toggle",1);
    // Keep the drawn range identical to the committed range, including clicks
    // that expand back to full length and sub-sample endpoint rounding.
    updatingWave = true;
    named("wave_link").message("list", 0, outputDurationMs, a, b);
    updatingWave = false; selectionLabel();
    if (state === "playing") restartSelection();
    else status("Range selected. PLAY loops the amber range; turn LOOP off to play once.");
}
function selectionLabel() {
    if (!plan) return;
    ui("selection_info", "Selection: " + (selectedStart / 1000).toFixed(2) + " - " + (selectedEnd / 1000).toFixed(2) + " s  (" + ((selectedEnd - selectedStart) / 1000).toFixed(2) + " s)");
}
function loopmode(value) {
    if (state === "rendering" || state === "waiting" || state === "stopping") { ui("loop_toggle", loopEnabled ? 1 : 0); return; }
    loopEnabled = Number(value) !== 0; ui("loop_toggle", loopEnabled ? 1 : 0);
    if (state === "playing") restartSelection();
}
function restartSelection() {
    state = "stopping"; outlet(2, 0, 5); cancelTask(finishTask); lockUI(true);
    finishTask = new Task(function () {
        finishTask = null;
        if (state !== "stopping") return;
        outlet(1, 0); outlet(0, "stop"); beginPlayback();
    }, host); finishTask.schedule(8);
}
function clearloop() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    selectedStart = 0; selectedEnd = outputDurationMs; pendingSelection = [selectedStart, selectedEnd];
    refreshWave(true); selectionLabel();
    if (state === "playing") restartSelection(); else status("Full output selected.");
}
function savepath() {
    if (!outputReady || savePending) return;
    var path = arrayfromargs(arguments).join(" "); if (!path) return;
    if (!/\.wav$/i.test(path)) path += ".wav";
    savePending = true; savePath = path;
    named("output_buffer").message("format", "int24"); named("output_buffer").message("filetype", "wave");
    status("Saving the complete output WAV...");
    named("output_buffer").message("writewave", path);
    saveTask = new Task(function () {
        if (savePending) { savePending = false; status("WAV save was requested. Check the destination and Max Console."); }
    }, host); saveTask.schedule(30000);
}
function saved() {
    if (!savePending) return;
    savePending = false; cancelTask(saveTask); saveTask = null;
    status("WAV write completed: " + shortName(savePath));
}
function shutdown() {
    cancelTask(audioTask); cancelTask(demoTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask); cancelTask(saveTask);
    var i; for (i = 0; i < 3; i++) cancelTask(loadTasks[i]);
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop"); state = "idle";
}
function notifydeleted() { shutdown(); }

/* CMPE Variety Pack for Max.
 * Musical designs: Joo Won Park, https://joowonpark.net/cmpe/
 * This extension keeps the APG controller intact and supplies the four other
 * instruments. Native MSP performs live audio; JS schedules control events.
 */
(function (g) {
    "use strict";
    var base = {}, names = ["loadbang", "lockUI", "loadfile", "loaded", "markDirty", "requestAudio",
        "beginRender", "renderTick", "renderComplete", "newpiece", "stop", "shutdown",
        "dspstate", "samplerate", "notifydeleted"];
    var i;
    for (i = 0; i < names.length; i++) base[names[i]] = g[names[i]];
    var modeIndex = 0, modeNames = ["APG", "ISJS", "Many", "RMHS", "SIOE"];
    var modeColors = [
        [0.031373, 0.498039, 0.513725, 1], // APG: teal
        [0.192157, 0.372549, 0.650980, 1], // ISJS: blue
        [0.447059, 0.341176, 0.650980, 1], // Many: violet
        [0.600000, 0.368627, 0.196078, 1], // RMHS: copper
        [0.596078, 0.419608, 0.098039, 1]  // SIOE: ochre
    ];
    var grain = CMPEModel.defaultSettings("isjs"), many = CMPEModel.defaultSettings("many");
    var drone = CMPEModel.defaultSettings("rmhs"), cut = CMPEModel.defaultSettings("sioe");
    var liveToken = 0, taskSerial = 0, tasks = {}, grainTasks = [null, null, null];
    var grainDue = [0, 0, 0], grainVariation = [1, 1, 1];
    var liveStarted = 0, liveEnd = 0, nextLayer = 0, layerCount = 0, manyCursor = 0;
    var manyUse = [], droneVoices = [], cutRenderer = null;
    var recordArmed = false, recording = false, recordFile = "", recordMs = 0;
    var recordRequested = 0, recordLastChange = 0, recordCheck = null, updatingControls = false;
    // buffer~ completion bangs carry no request ID. Keep one native read per
    // slot, and defer a preset until existing reads have actually completed.
    // A JavaScript timeout does not cancel native disk I/O.
    var nativeBusy = [false, false, false], pendingPreset = null, presetTask = null;
    var descriptions = [
        "APG: make an audio palindrome from three samples.",
        "ISJS: move in the pad for position and grain density.",
        "Many: turn your samples into overlapping ambient layers.",
        "RMHS: a slowly evolving drone of sine-wave harmonics.",
        "SIOE: slices of sample 1 as a short or gradual supercut."
    ];

    function now() { return new Date().getTime(); }
    function liveMode() { return modeIndex > 0 && modeIndex < 4; }
    function objectMessage(name, args) {
        var o = named(name);
        if (o) o.message.apply(o, args);
    }
    function hidden(name, yes) { var o = named(name); if (o) o.hidden = yes ? 1 : 0; }
    function clickable(name, yes) { objectMessage(name, ["ignoreclick", yes ? 0 : 1]); }
    function textOf(name, value) { objectMessage(name, ["text", value]); }
    function lineList(points) {
        var list = [], previous = 0, j;
        for (j = 0; j < points.length; j++) {
            list.push(points[j].value, Math.max(0, points[j].timeMs - previous));
            previous = points[j].timeMs;
        }
        return list;
    }
    function voice(engine, index, commands) {
        var o = named(engine), j;
        if (!o) throw new Error("A required audio voice is missing: " + engine);
        o.message("target", index);
        for (j = 0; j < commands.length; j++) o.message.apply(o, commands[j]);
    }
    function later(fn, delayMs) {
        var token = liveToken, id = ++taskSerial;
        var task = new Task(function () {
            delete tasks[id];
            if (token === liveToken && state === "live") {
                try { fn(); } catch (e) { haltLive("Stopped: " + e.message); }
            }
        }, host);
        tasks[id] = task;
        task.schedule(Math.max(1, delayMs));
        return task;
    }
    function cancelLiveTask(task) {
        if (!task) return;
        task.cancel();
        for (var key in tasks) if (tasks.hasOwnProperty(key) && tasks[key] === task) delete tasks[key];
    }
    function cancelLiveTasks() {
        liveToken++;
        var key;
        for (key in tasks) if (tasks.hasOwnProperty(key)) cancelTask(tasks[key]);
        tasks = {}; grainTasks = [null, null, null];
    }
    function stopRecording() {
        cancelTask(recordCheck); recordCheck = null;
        if (recordArmed || recording) objectMessage("recorder", ["int", 0]);
        recordArmed = false; recording = false; recordMs = 0;
        textOf("record_button", "RECORD WAV");
    }
    function stopVoices() {
        objectMessage("live_gate", ["list", 0, 10]);
        voice("grain_engine", 0, [["panic"]]);
        voice("many_engine", 0, [["panic"]]);
        voice("drone_engine", 0, [["panic"]]);
    }
    function haltLive(message) {
        cancelLiveTasks(); stopVoices(); stopRecording();
        state = outputReady ? "ready" : "idle";
        ui("progress", 0);
        g.lockUI(false);
        if (message) status(message);
    }
    function haltForChange() {
        if (g.fxsend) g.fxsend("halt");
        cancelPresetRestore();
        cancelTask(audioTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask);
        audioTask = null; renderTask = null; finishTask = null; selectionTask = null;
        haltLive("");
        outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
        state = "idle"; outputReady = false; dirty = true; cutRenderer = null;
        plan = null; waveformLine(-1);
    }
    function setParam(index, label, value, low, high) {
        hidden("param" + index, false); hidden("param_label" + index, false);
        ui("param_label" + index, label);
        objectMessage("param" + index, ["minimum", low]);
        objectMessage("param" + index, ["maximum", high]);
        ui("param" + index, value);
    }
    function menu(label, items, selected) {
        hidden("mode_menu", false); hidden("menu_label", false);
        ui("menu_label", label);
        objectMessage("mode_menu", ["clear"]);
        for (var k = 0; k < items.length; k++) objectMessage("mode_menu", ["append", items[k]]);
        objectMessage("mode_menu", ["set", selected]);
    }
    function presetMenu() {
        var lists = [null, LivePresets.ISJS, LivePresets.MANY, RMHSTheory.PRESETS, null], list = lists[modeIndex], k;
        var sel = modeIndex === 3 ? modeAdvanced.rmhs.harmony.preset : (list ? modeAdvanced[MODE_KEYS[modeIndex]].preset : 0);
        hidden("preset_menu", !list); hidden("preset_label", !list);
        hidden("match_levels", modeIndex === 3);
        if (!list) return;
        objectMessage("preset_menu", ["clear"]);
        for (k = 0; k < list.length; k++) objectMessage("preset_menu", ["append", list[k].name]);
        objectMessage("preset_menu", ["set", sel]);
    }
    function showMode() {
        if (updatingControls) return;
        updatingControls = true;
        try {
        presetMenu();
        var j, apg = modeIndex === 0, rendered = apg || modeIndex === 4;
        var sourceCount = sourceCountFor(modeIndex);
        for (j = 0; j < 5; j++) {
            objectMessage("mode" + j, ["bgcolor"].concat(j === modeIndex ? [23 / 255, 79 / 255, 203 / 255, 1] : [224 / 255, 229 / 255, 235 / 255, 1]));
            objectMessage("mode" + j, ["bgoncolor"].concat(j === modeIndex ? [16 / 255, 58 / 255, 154 / 255, 1] : [205 / 255, 212 / 255, 221 / 255, 1]));
            var foreground = j === modeIndex ? [1, 1, 1, 1] : [23 / 255, 32 / 255, 43 / 255, 1];
            objectMessage("mode" + j, ["textcolor"].concat(foreground));
            objectMessage("mode" + j, ["textoncolor"].concat(foreground));
            objectMessage("mode" + j, ["textovercolor"].concat(foreground));
        }
        ui("mode_info", descriptions[modeIndex]);
        for (j = 0; j < 6; j++) { hidden("param" + j, true); hidden("param_label" + j, true); }
        hidden("mode_menu", true); hidden("menu_label", true);
        for (j = 1; j <= 3; j++) {
            hidden("repeat" + j, !apg); hidden("repeat_label" + j, !apg);
            // Many's cards 2-3 keep their SPACE / TIMING controls; extra samples add only LOAD.
            hidden("source_label" + j, j > sourceCount || (modeIndex === 2 && j > 1));
            hidden("load" + j, j > sourceCount); hidden("file" + j, j > sourceCount || (modeIndex === 2 && j > 1));
        }
        hidden("pitch", !apg); hidden("pitch_label", !apg);
        hidden("layer_source_menu", modeIndex !== 2); hidden("layer_source_label", modeIndex !== 2);
        if (modeIndex === 2) objectMessage("layer_source_menu", ["set", modeAdvanced.many.sources - 1]);
        hidden("no_samples", modeIndex !== 3);
        hidden("wave_l", !rendered); hidden("wave_r", !rendered);
        hidden("scope_l", rendered || modeIndex === 1); hidden("scope_r", rendered || modeIndex === 1);
        hidden("scope_xy", modeIndex !== 1); hidden("xy_pad", modeIndex !== 1);
        hidden("channel_l", modeIndex === 1); hidden("channel_r", modeIndex === 1);
        hidden("loop_toggle", !rendered); hidden("loop_label", !rendered);
        hidden("clear_button", !rendered); hidden("save_button", !rendered);
        hidden("record_button", false);
        ui("output_label", rendered ? "OUTPUT" : (modeIndex === 1 ? "GRAIN PAD" : "LIVE OUTPUT"));
        textOf("play_button", rendered ? "PLAY" : "START");
        textOf("stop_button", "STOP");
        textOf("new_button", rendered ? "NEW" : (modeIndex === 3 ? "RANDOMIZE" : "RESET"));
        if (modeIndex === 1) {
            for (j = 0; j < 3; j++) {
                setParam(j, "Sample " + (j + 1) + " rate", grain.rates[j], 0.3, 1.7);
                setParam(j + 3, "Sample " + (j + 1) + " level", grain.levels[j], 0, 1);
            }
            objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        } else if (modeIndex === 2) {
            setParam(0, "Layer level", many.level, 0, 2);
            setParam(1, "Max delay (s)", many.delayMaxMs / 1000, 0.1, 0.5);
            setParam(2, "Max interval (s)", many.intervalMaxMs / 1000, 5, 20);
            menu("Pitch set", ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"], many.pitchSet);
        } else if (modeIndex === 3) {
            setParam(0, "Drone level", drone.level, 0, 1);
            setParam(1, "Fundamental (Hz)", drone.fundamentalHz, 20, 20000);
            setParam(2, "Interval (st)", drone.intervalSemitones, 0, 24);
            setParam(3, "Duration (s)", drone.durationSeconds, 1, 600);
            setParam(4, "Harmonics", drone.harmonics, 3, 20);

        } else if (modeIndex === 4) {
            setParam(0, "Slices", cut.count, 1, 100);
            setParam(1, "Tempo (BPM)", cut.tempo, 1, 1500);
            setParam(2, "Hit duration (s)", cut.hitSeconds, 0.1, 10);
            menu("Form", ["Short", "Long"], cut.form === "short" ? 0 : 1);
        }
        if (liveMode() && state !== "live") {
            ui("duration", modeIndex === 3 ? "Slow fade-in" : "Continuous");
            ui("time", "0.0 s");
            ui("selection_info", modeIndex === 1 ? LivePresets.isjsGuide(grain.rates) : (modeIndex === 2 && sourceCountFor(2) > 1 ? manySourceList() : "Record a performance with RECORD WAV."));
        }
        g.lockUI(state !== "idle" && state !== "ready");
        } finally { updatingControls = false; }
    }
    function modeHint() {
        if (modeIndex === 0) return "Automatic edge trimming is on. Press PLAY to generate.";
        if (modeIndex === 1) return "START, then move inside the pad. Rates and levels remain live.";
        if (modeIndex === 2) { var fr = modeAdvanced.many.values.fade; return "Layers fade in over " + (+fr[0].toFixed(1)) + "\u2013" + (+fr[1].toFixed(1)) + " seconds. Controls affect the next layer."; }
        if (modeIndex === 3) return "Slow attack: " + attackText() + ". Progress shows the actual planned length.";
        return "Short: one supercut. Long: adds and removes slices every four beats.";
    }
    g.loadbang = function () {
        var already = initialized;
        base.loadbang();
        if (already) return;
        objectMessage("live_gate", ["float", 0]);
        objectMessage("recorder", ["samptype", "int24"]);
        // Legacy recorder ramp messages removed; processed bus supplies output fades.
        showMode(); ui("render_info", modeHint());
        post("CMPE Variety Pack: Joo Won Park / joowonpark.net/cmpe\n");
    };
    g.lockUI = function (flag) {
        base.lockUI(flag);
        var editable = mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2));
        var j, required = sourceCountFor(modeIndex);
        for (j = 0; j < 6; j++) clickable("param" + j, editable && !(modeIndex === 4 && cut.form === "short" && j === 1));
        clickable("mode_menu", editable);
        clickable("xy_pad", modeIndex === 1 && (mutable() || state === "live"));
        for (j = 1; j <= 3; j++) clickable("load" + j, mutable() && j <= required);
        clickable("demo_button", mutable() && required > 0);
        clickable("new_button", mutable());
        clickable("record_button", state !== "waiting");
        clickable("load_preset", !savePending);
        clickable("save_preset", true);
    };
    g.mode = function (value) {
        value = Number(value);
        if (!finite(value) || value < 0 || value > 4 || Math.floor(value) !== value || value === modeIndex) return;
        if (savePending) { status("Wait for the WAV save to finish before changing instruments."); return; }
        haltForChange(); modeIndex = value;
        ui("progress", 0); ui("duration", "Length: --"); ui("time", "0.0 s");
        showMode(); ui("render_info", modeHint()); status("Ready. " + descriptions[modeIndex]);
    };
    function sourcesBusy() { return nativeBusy[0] || nativeBusy[1] || nativeBusy[2]; }
    g.sampleloadreset=function(slot){if(slotOK(slot)&&!loading[slot]){nativeBusy[slot]=false;cancelTask(loadTasks[slot]);loadTasks[slot]=null;}};
    function cancelPresetRestore() {
        pendingPreset = null; cancelTask(presetTask); presetTask = null;
    }
    function clearSource(slot) {
        cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
        sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = "";
        named("source" + (slot + 1)).message("clear");
        ui("file" + (slot + 1), "No sample \u00b7 drop audio here or click LOAD");
    }
    g.loadfile = function (slot) {
        var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
        slot = Number(slot);
        if (!slotOK(slot) || !path || !mutable()) return;
        if (nativeBusy[slot]) { status("This source is still loading. Check Max Console if the load has stalled."); return; }
        if (loading[slot]) { base.loadfile.apply(host, args); return; }
        nativeBusy[slot] = true;
        try { base.loadfile.apply(host, args); }
        catch (e) { nativeBusy[slot] = false; throw e; }

    };
    g.loaded = function (slot) {
        slot = Number(slot);
        if (!slotOK(slot) || !nativeBusy[slot] || sourcePreparing[slot]) return;
        var candidate=new Buffer(prefix+"_source"+slot);if(candidate.framecount()<2)return;
        nativeBusy[slot] = false;
        base.loaded(slot);
        if (pendingPreset) {
            if (!sourcesBusy()) {
                var saved = pendingPreset;
                cancelPresetRestore();
                applyPreset(saved);
            } else status("Waiting for the current source load before restoring settings...");
            return;
        }
        if (modeIndex !== 0) {
            showMode();
            if (modeIndex === 4 && mutable()) ui("duration", "Length: --");
            var required = modeIndex === 2 ? 1 : sourceCountFor(modeIndex), ready = true;
            for (var j = 0; j < required; j++) if (!sources[j] || nativeBusy[j]) ready = false;
            if (ready && mutable()) g.markDirty();
        }
    };
    g.markDirty = function () {
        if (modeIndex === 0) { base.markDirty(); return; }
        dirty = true;
        if (mutable()) status(modeIndex === 4 ? "Ready. PLAY renders the supercut, then plays it." : "Ready. Press START.");
    };
    g.param = function (index, value) {
        if (updatingControls) return;
        index = Number(index); value = Number(value);
        if (!finite(index) || Math.floor(index) !== index || index < 0 || index > 5 || !finite(value)) return;
        if (!(mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2)))) { showMode(); return; }
        if (modeIndex === 1 || modeIndex === 2) modeAdvanced[MODE_KEYS[modeIndex]].preset = 0;
        if (modeIndex === 1) {
            if (index < 3) {
                grain.rates[index] = clamp(value, 0.3, 1.7);
                if (state === "live") voice("grain_engine", index + 1, [["rate", grain.rates[index]]]);
            } else {
                grain.levels[index - 3] = clamp(value, 0, 1);
                if (state === "live") voice("grain_engine", index - 2, [["amp", grain.levels[index - 3] * grainVariation[index - 3]]]);
            }
        } else if (modeIndex === 2) {
            if (index === 0) many.level = clamp(value, 0, 2);
            if (index === 1) many.delayMaxMs = clamp(value, 0.1, 0.5) * 1000;
            if (index === 2) many.intervalMaxMs = Math.round(clamp(value, 5, 20)) * 1000;
        } else if (modeIndex === 3) {
            if (index === 0) drone.level = clamp(value, 0, 1);
            var H = modeAdvanced.rmhs.harmony;
            if (index === 1) drone.fundamentalHz = clamp(H.snap ? RMHSTheory.snap(value) : value, 20, 20000);
            if (index === 2) drone.intervalSemitones = clamp(H.tuning === 1 ? Math.round(value) : value, 0, 24);
            if (index === 1 || index === 2 || index === 4) H.preset = 0;
            if (index === 3) drone.durationSeconds = clamp(value, 1, 600);
            if (index === 4) drone.harmonics = Math.round(clamp(value, 3, 20));
        } else if (modeIndex === 4) {
            if (index === 0) cut.count = Math.round(clamp(value, 1, 100));
            if (index === 1 && cut.form !== "short") cut.tempo = clamp(value, 1, 1500);
            if (index === 2) cut.hitSeconds = clamp(value, 0.1, 10);
            dirty = true;
        }
        showMode();
        if (mutable()) g.markDirty();
    };
    g.choice = function (value) {
        if (updatingControls) return;
        value = Math.round(Number(value));
        if (!finite(value) || !(mutable() || (state === "live" && modeIndex === 2))) return;
        if (modeIndex === 2) { many.pitchSet = clamp(value, 0, 4); modeAdvanced.many.preset = 0; }
        if (modeIndex === 4) { cut.form = value === 0 ? "short" : "long"; dirty = true; }
        if (modeIndex === 3) g.applyHarmonyPreset(value);
        showMode();
    };
    g.xy = function (x, y) {
        if (updatingControls) return;
        x = Number(x); y = Number(y);
        if (modeIndex !== 1 || !finite(x) || !finite(y)) return;
        if (!(mutable() || state === "live")) return;
        grain.position = clamp(x, 0, 1); grain.densityY = clamp(y, 0, 1);
        objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        if (state === "live") {
            for (var j = 0; j < 3; j++) {
                var period = 1000 / (j === 0 ? 0.5 + 39.5 * grain.densityY : 0.1 + 34.9 * grain.densityY);
                if (grainDue[j] - now() > period) {
                    cancelLiveTask(grainTasks[j]); scheduleGrain(j, period);
                }
            }
        }
    };
    /* Preset: root, interval, partial count, harmony and motion ranges. Level and duration stay. */
    g.applyHarmonyPreset = function (index) {
        var P = RMHSTheory.PRESETS[index], A = modeAdvanced.rmhs, H = A.harmony;
        if (!P) return;
        H.preset = index;
        if (index === 0) return;
        drone.fundamentalHz = P.hz; drone.intervalSemitones = P.st; drone.harmonics = P.harm;
        H.tuning = P.tuning; H.series = P.series; H.tilt = P.tilt;
        A.values.attack = P.attack.slice(0); A.values.spread = P.spread.slice(0); A.values.drift = P.drift.slice(0); A.values.depth = P.depth;
        status("Preset: " + P.name + ". " + P.about + " Press START.");
        if (g.modeadvrefresh) g.modeadvrefresh();
    };
    g.applyLivePreset = function (index) {
        var key = MODE_KEYS[modeIndex], A = modeAdvanced[key], P, j;
        if (modeIndex === 3) { g.applyHarmonyPreset(index); return; }
        if (modeIndex === 1) {
            P = LivePresets.ISJS[index]; if (!P) return; A.preset = index; if (!index) return;
            for (j = 0; j < 3; j++) { grain.rates[j] = P.rates[j]; grain.levels[j] = P.levels[j]; }
            grain.densityY = P.density; objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
            A.values.width = P.width.slice(0); A.values.curve = P.curve.slice(0); A.values.attack = P.attack;
            if (state === "live") for (j = 0; j < 3; j++) voice("grain_engine", j + 1, [["rate", grain.rates[j]], ["amp", grain.levels[j] * grainVariation[j]]]);
        } else if (modeIndex === 2) {
            P = LivePresets.MANY[index]; if (!P) return; A.preset = index; if (!index) return;
            many.pitchSet = P.pitchSet; many.delayMaxMs = P.delay * 1000; many.intervalMaxMs = P.interval * 1000;
            A.values.fade = P.fade.slice(0); A.values.decay = P.decay.slice(0); A.values.spread = P.spread.slice(0);
        } else return;
        status("Preset: " + P.name + ". " + P.about + (state === "live" ? " Applies to the next grains/layers." : " Press START."));
        if (g.modeadvrefresh) g.modeadvrefresh();
    };
    g.presetchoice = function (value) {
        if (updatingControls) return;
        value = Math.round(Number(value));
        if (!finite(value) || !(modeIndex >= 1 && modeIndex <= 3)) return;
        if (!(mutable() || (state === "live" && modeIndex !== 3))) { showMode(); return; }
        g.applyLivePreset(value); showMode();
        if (g.feedbackrefresh) g.feedbackrefresh();
    };
    g.manyGuidance = function () {
        var A = modeAdvanced.many, P = LivePresets.MANY[A.preset], v = A.values;
        return ["", "Max delay " + (many.delayMaxMs / 1000).toFixed(2) + " s \u00b7 tails " + v.decay[0] + "\u2013" + v.decay[1] + " s\n" + (many.delayMaxMs < 150 ? "short delays ring, metallic" : (v.decay[1] > 35 ? "long, cathedral-like tails" : "smooth ambient space")),
            "New layer every " + (many.intervalMaxMs / 2000).toFixed(1) + "\u2013" + (many.intervalMaxMs / 1000).toFixed(0) + " s\n" + LivePresets.SET_NOTES[many.pitchSet]];
    };
    g.showRMHSMenu = function () { if (modeIndex === 3) objectMessage("preset_menu", ["set", modeAdvanced.rmhs.harmony.preset]); };
    g.rmhsGuidance = function () {
        var P = RMHSTheory.PRESETS[modeAdvanced.rmhs.harmony.preset], lines = RMHSTheory.guidance(drone, modeAdvanced.rmhs.harmony);
        return [(P && P.about ? P.about : "Sine-wave drone. No sample files needed.") , lines[0], lines[1] + "\n" + lines[2]];
    };
    g.newpiece = function () {
        if (!mutable()) return;
        if (!liveMode()) { base.newpiece(); return; }
        if (modeIndex === 1) grain = CMPEModel.defaultSettings("isjs");
        if (modeIndex === 2) many = CMPEModel.defaultSettings("many");
        if (modeIndex === 3) drone = CMPEModel.defaultSettings("rmhs");
        showMode(); ui("render_info", modeHint()); status("Settings ready. Press START.");
    };
    g.requestAudio = function (action) {
        if (pendingPreset) { status("Waiting for the current source load before restoring settings..."); return; }
        if (modeIndex === 0) { base.requestAudio(action); return; }
        if (savePending) { status("Wait for the WAV save to finish."); return; }
        var required = modeIndex === 2 ? 1 : sourceCountFor(modeIndex), j;
        for (j = 0; j < required; j++) {
            if (loading[j]) { status("Please wait for the source to finish loading."); return; }
            if (!sources[j]) { status("Load " + (required === 1 ? "sample 1" : "three samples") + " or choose DEMO."); return; }
        }
        state = "waiting"; startAction = action; audioAttempts = 0; audioReadyRate=0; audioReadySince=0;
        g.lockUI(true); status("Starting audio...");
        named("audio_driver").message("startwindow");
        audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
    };
    g.beginRender = function (thenPlay) {
        if (modeIndex === 0) { base.beginRender(thenPlay); return; }
        if (liveMode()) { beginLive(); return; }
        try {
            plan = CMPEModel.sioePlan(sources, withAdv(cut, "sioe"), sampleRate, prepareVariation("sioe"));
            cutRenderer = CMPEModel.createSioeRenderer(plan, sources, readSource);
            state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
            outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
            renderFrame = 0; renderHalf = outputFrames; renderPeak = 0; firstAudioFrame = -1;
            renderStarted = now(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
            outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
            ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
            ui("progress", 0); ui("render_info", "Rendering SIOE 0%");
            status("Rendering the supercut. CANCEL stops generation.");
            g.lockUI(true); textOf("stop_button", "CANCEL"); waveformLine(-1);
            renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderTick = function () {
        if (modeIndex !== 4) { base.renderTick(); return; }
        if (state !== "rendering") return;
        var started = now();
        try {
            do {
                var count = Math.min(plan.recommendedChunkFrames || 1024, outputFrames - renderFrame);
                var chunk = cutRenderer.renderChunk(renderFrame, count), j;
                output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
                if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                    for (j = 0; j < count; j++) if (Math.max(Math.abs(chunk.left[j]), Math.abs(chunk.right[j])) > silenceThreshold) { firstAudioFrame = renderFrame + j; break; }
                }
                renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
            } while (renderFrame < outputFrames && now() - started < 10);
            ui("progress", renderFrame / outputFrames);
            ui("render_info", "Rendering SIOE " + Math.floor(100 * renderFrame / outputFrames) + "%  /  " + ((now() - renderStarted) / 1000).toFixed(1) + " s elapsed");
            if (now() - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now(); }
            if (renderFrame >= outputFrames) g.renderComplete(); else renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderComplete = function () {
        if (modeIndex === 4 && renderPeak > 0.98) named("output_buffer").message("normalize", 0.98);
        base.renderComplete();
        if (modeIndex === 4) {
            ui("render_info", "SIOE ready  /  " + plan.events.length + " slices" + (renderPeak > 0.98 ? "  /  peak level adjusted" : ""));
            cutRenderer = null;
        }
    };
    function scheduleGrain(slot, delayMs) {
        grainDue[slot] = now() + delayMs;
        grainTasks[slot] = later(function () { fireGrain(slot); }, delayMs);
    }
    function fireGrain(slot) {
        var e = CMPEModel.isjsEvent(withAdv(grain, "isjs"), slot, liveRng);
        grainVariation[slot] = e.level > 0 ? e.amplitude / e.level : 1;
        voice("grain_engine", slot + 1, [
            ["set", sources[slot].name], ["rate", e.rate], ["amp", e.amplitude], ["pan", e.pan],
            ["env"].concat(lineList(e.envelope)),
            ["start", (e.position >= 1 ? 0 : e.position) * sources[slot].durationMs]
        ]);
        scheduleGrain(slot, e.periodMs);
    }
    /* Random loaded source, never the same twice in a row; with one source no
     * random number is drawn, so single-sample Many is unchanged. */
    var lastManySource = -1;
    function pickManySource() {
        var n = sourceCountFor(2), avail = [], k;
        for (k = 0; k < n; k++) if (sources[k]) avail.push(k);
        if (avail.length <= 1) { lastManySource = avail.length ? avail[0] : 0; return lastManySource; }
        var choices = avail.filter(function (x) { return x !== lastManySource; });
        lastManySource = choices[Math.min(choices.length - 1, Math.floor(liveRng() * choices.length))];
        return lastManySource;
    }
    g.pickManySource = pickManySource;
    function manySourceList() {
        var parts = [], k, n = sourceCountFor(2);
        for (k = 0; k < n; k++) parts.push("S" + (k + 1) + " " + (sources[k] && paths[k] ? shortName(paths[k]) : (loading[k] ? "loading\u2026" : "empty")));
        return "Layers pick at random from: " + parts.join("  \u00b7  ");
    }
    g.layersources = function (value) {
        value = Math.round(Number(value));
        if (!finite(value) || value < 0 || value > 2) return;
        if (!(mutable() || state === "live")) { showMode(); return; }
        modeAdvanced.many.sources = value + 1; lastManySource = -1;
        showMode(); g.lockUI(!mutable() && state !== "live");
        status(value === 0 ? "Many layers use Sample 1." : "Many layers now draw on samples 1\u2013" + (value + 1) + " at random" + (state === "live" ? ", starting with the next layer." : ". Load them on the cards to the right."));
        if (g.feedbackrefresh) g.feedbackrefresh();
    };
    function addLayer() {
        var e = CMPEModel.manyEvent(withAdv(many, "many"), liveRng), index = (manyCursor++ % 32) + 1;
        var src = sources[pickManySource()];
        var reuse = manyUse[index] !== undefined, generation = (manyUse[index] || 0) + 1;
        manyUse[index] = generation;
        if (reuse) voice("many_engine", index, [["stop"]]);
        function launch() {
            var commands = [["set", src.name], ["rate", e.rate], ["amp", e.level],
                ["sumgain", src.channels === 1 ? 1 : Math.SQRT1_2], ["feed", e.feed]];
            for (var k = 0; k < e.stages.length; k++) {
                var s = e.stages[k];
                commands.push(["stage", k + 1, s.leftMs, s.leftK, s.rightMs, s.rightK]);
            }
            commands.push(["dryenv"].concat(lineList(e.dryEnvelope)));
            commands.push(["wetenv"].concat(lineList(e.wetEnvelope)));
            commands.push(["start", 0]);
            voice("many_engine", index, commands);
            later(function () {
                if (manyUse[index] === generation) voice("many_engine", index, [["stop"]]);
            }, 120000);
        }
        if (reuse) later(launch, 15); else launch();
        layerCount++; nextLayer = now() + e.nextMs;
        later(addLayer, e.nextMs);
    }
    function driftNext(index, v) {
        var delay = -Math.log(Math.max(1e-12, 1 - liveRng())) * 1000 / v.driftRateHz;
        later(function () {
            if (now() >= liveStarted + v.durationMs) return;
            voice("drone_engine", index, [["drift", liveRng() * v.driftMaxHz, v.driftLagMs]]);
            driftNext(index, v);
        }, delay);
    }
    function beginLive() {
        try {
            if (g.fxsend) g.fxsend("resume");
            cancelLiveTasks();
            state = "live"; outputReady = false; dirty = true; liveStarted = now();
            liveEnd = 0; layerCount = 0; manyCursor = 0; manyUse = []; lastManySource = -1;
            outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
            objectMessage("live_gate", ["list", 1, 15]);
            ui("progress", 0); ui("time", "0.0 s");
            g.lockUI(true);
            prepareVariation(MODE_KEYS[modeIndex]);
            if (modeIndex === 1) {
                var wr = modeAdvanced.isjs.values.width;
                grain.panWidths = [0, 1, 2].map(function () { return (wr[0] + (wr[1] - wr[0]) * liveRng()) / 100; });
                for (var j = 0; j < 3; j++) fireGrain(j);
            } else if (modeIndex === 2) {
                addLayer();
            } else {
                var result = CMPEModel.rmhsPlan(withAdv(drone, "rmhs"), sampleRate, liveRng);
                if (!result.voices.length) throw new Error("No audible partials at this frequency. Lower the fundamental.");
                droneVoices = result.voices; liveEnd = liveStarted + result.durationMs;
                for (var k = 0; k < result.voices.length; k++) {
                    var v = result.voices[k];
                    voice("drone_engine", k + 1, [["freq", v.frequencyHz], ["drift", 0, 0],
                        ["mod", v.modRateHz], ["modphase", (v.modPhase / (2 * Math.PI) + 0.75) % 1],
                        ["amp", v.amplitude], ["pan", v.pan],
                        ["env"].concat(lineList(v.envelope)), ["start"]]);
                    driftNext(k + 1, v);
                    (function (index, duration) { later(function () { voice("drone_engine", index, [["stop"]]); }, duration + 15); }(k + 1, v.durationMs));
                }
                ui("duration", "Length: " + (result.durationMs / 1000).toFixed(1) + " s");
                ui("selection_info", result.voices.length + " partials" + (result.skippedPartials ? "  /  " + result.skippedPartials + " above the audio range omitted" : ""));
            }
            if (recordArmed) startRecording();
            pulse();
        } catch (e) { haltLive(e.message); }
    }
    function pulse() {
        var elapsed = now() - liveStarted, suffix = recording ? "  /  REC " + (recordMs / 1000).toFixed(1) + " s" : (recordArmed ? "  /  record armed" : "");
        ui("time", (elapsed / 1000).toFixed(1) + " s" + suffix);
        if (modeIndex === 1) {
            ui("render_info", "Position " + Math.round(grain.position * 100) + "%  /  density " + (0.5 + 39.5 * grain.densityY).toFixed(1) + " Hz (sample 1)");
            status("Playing live. Move the pad; adjust rates and levels.");
        } else if (modeIndex === 2) {
            ui("render_info", layerCount + " layers started  /  next layer in " + Math.max(0, (nextLayer - now()) / 1000).toFixed(1) + " s");
            status(elapsed < 4000 ? "The ambient layers are fading in." : "Playing ambient layers. STOP fades and clears all tails.");
        } else {
            var length = liveEnd - liveStarted, remaining = Math.max(0, liveEnd - now());
            ui("progress", clamp(elapsed / length, 0, 1));
            ui("render_info", "Drone: " + (remaining / 1000).toFixed(1) + " s remaining");
            status(elapsed < modeAdvanced.rmhs.values.attack[1] * 1000 ? "Slow fade-in. The partials enter over " + attackText() + "." : "The drone is evolving...");
            if (remaining <= 0) { haltLive("Drone finished. Press START for another performance."); ui("progress", 1); return; }
        }
        later(pulse, 150);
    }
    g.stop = function () {
        if (pendingPreset) {
            cancelPresetRestore();
            haltLive("Settings load cancelled. The current source read can finish.");
            return;
        }
        if (state === "live" || liveMode()) {
            cancelTask(audioTask); audioTask = null;
            haltLive("Stopped. Press START when ready.");
            return;
        }
        base.stop();
    };
    g.dspstate = function (value) {
        if (Number(value) === 0 && state === "live") haltLive("Audio stopped. Check Max Audio Status, then press START.");
        base.dspstate(value);
    };
    g.samplerate = function (value) {
        value = Number(value);
        if (state === "live" && finite(value) && sampleRate > 0 && value !== sampleRate) haltLive("Audio settings changed. Press START again.");
        base.samplerate(value);
    };
    function startRecording() {
        if (!recordArmed || state !== "live") return;
        objectMessage("recorder", ["int", 1]);
        recording = true; recordArmed = false; recordMs = 0;
        recordRequested = now(); recordLastChange = now();
        textOf("record_button", "STOP REC");
        recordCheck = new Task(function () {
            if (!recording) return;
            if (now() - recordLastChange > 3000) {
                stopRecording();
                status("Recording did not advance. Check the destination and Max Console.");
                return;
            }
            recordCheck.schedule(1000);
        }, host);
        recordCheck.schedule(3500);
    }
    g.recordtoggle = function () {
        if (!liveMode()) return;
        if (recording || recordArmed) { stopRecording(); status("Recording stopped."); return; }
        if (state === "waiting") return;
        objectMessage("record_dialog", ["bang"]);
    };
    g.recordpath = function () {
        if (!liveMode()) return;
        var path = arrayfromargs(arguments).join(" ");
        if (!path) return;
        if (!/\.wav$/i.test(path)) path += ".wav";
        stopRecording(); recordFile = path;
        objectMessage("recorder", ["samptype", "int24"]);
        objectMessage("recorder", ["open", path, "wave"]);
        recordArmed = true; textOf("record_button", "ARMED");
        if (state === "live") startRecording();
        else status("Recording armed. START begins a 24-bit stereo WAV.");
    };
    g.recordelapsed = function (milliseconds) {
        milliseconds = Number(milliseconds);
        if (recording && finite(milliseconds) && milliseconds > recordMs) {
            recordMs = milliseconds; recordLastChange = now();
        }
    };
    function snapshot() {
        return {format: "cmpe-variety-pack", version: 1, mode: modeIndex,
            samples: paths.slice(0), apg: {repetitions: repetitions.slice(0), pitchRange: pitchRange, advanced: APGAdvancedModel.copy(apgAdvanced)},
            isjs: grain, many: many, rmhs: drone, sioe: cut, modeAdvanced: ModeAdvancedModel.copy(modeAdvanced), instrumentGainDb: instrumentGainDb.slice(0), matchLevels: matchLevels, monitorDb: monitorDb,
            sourceRegions: sourceRegions.map(function(r){return r.slice(0);}), loop: loopEnabled, fx: g.fxSaved || null};
    }
    g.presetsave = function () { objectMessage("preset_save_dialog", ["bang"]); };
    g.presetload = function () { if (!savePending) objectMessage("preset_load_dialog", ["bang"]); };
    g.presetwrite = function () {
        var path = arrayfromargs(arguments).join(" "), f;
        if (!path) return;
        if (!/\.json$/i.test(path)) path += ".json";
        try {
            f = new File(path, "write");
            if (!f.isopen) throw new Error("Cannot write that settings file.");
            f.eof = 0; f.writestring(JSON.stringify(snapshot(), null, 2) + "\n"); f.close();
            status("Settings saved: " + shortName(path));
        } catch (e) { if (f && f.isopen) f.close(); status(e.message); }
    };
    function validNumbers(values, count) {
        if (!values || values.length !== count) return false;
        for (var k = 0; k < count; k++) if (!finite(values[k])) return false;
        return true;
    }
    function validatePreset(p) {
        if(p&&p.sourceRegions!==undefined)SourceRegionModel.validate(p.sourceRegions);
        if(p&&p.apg&&p.apg.advanced!==undefined&&p.apg.advanced!==null)APGAdvancedModel.validate(p.apg.advanced);
        if (!p || p.format !== "cmpe-variety-pack" || p.version !== 1 ||
                !finite(p.mode) || p.mode < 0 || p.mode > 4 || Math.floor(p.mode) !== p.mode ||
                !p.apg || !validNumbers(p.apg.repetitions, 3) || !finite(p.apg.pitchRange) ||
                !p.isjs || !validNumbers(p.isjs.rates, 3) || !validNumbers(p.isjs.levels, 3) ||
                !finite(p.isjs.position) || !finite(p.isjs.densityY) ||
                !p.many || !validNumbers([p.many.level, p.many.delayMaxMs, p.many.intervalMaxMs, p.many.pitchSet], 4) ||
                !p.rmhs || !validNumbers([p.rmhs.level, p.rmhs.fundamentalHz, p.rmhs.intervalSemitones, p.rmhs.durationSeconds, p.rmhs.harmonics], 5) ||
                !p.sioe || !validNumbers([p.sioe.count, p.sioe.tempo, p.sioe.hitSeconds], 3) ||
                (p.sioe.form !== "short" && p.sioe.form !== "long") || !finite(p.monitorDb) ||
                !p.samples || p.samples.length !== 3) throw new Error("Choose a valid CMPE settings JSON file.");
        for (var k = 0; k < 3; k++) if (typeof p.samples[k] !== "string" || p.samples[k].length > 4096) throw new Error("Invalid sample path in settings.");
    }
    function restorePreset(p) {
        validatePreset(p);
        haltForChange();
        cancelTask(demoTask); demoTask = null;
        if (sourcesBusy()) {
            pendingPreset = p; state = "restoring"; g.lockUI(true);
            status("Waiting for the current source load before restoring settings...");
            presetTask = new Task(function () {
                if (pendingPreset) status("A source load is still pending. Settings will restore when it finishes; STOP cancels.");
            }, host);
            presetTask.schedule(30000);
            return;
        }
        applyPreset(p);
    }
    function applyPreset(p) {
        haltForChange();
        if (g.fxrestore) g.fxrestore(p.fx);
        var j;
        for (j = 0; j < 3; j++) clearSource(j);
        for (j = 0; j < 3; j++) repetitions[j] = Math.round(clamp(p.apg.repetitions[j], 1, 20));
        pitchRange = clamp(p.apg.pitchRange, 0, 1);
        apgAdvanced=APGAdvancedModel.restore(p.apg.advanced);apgSeedPrepared=false;
        modeAdvanced=ModeAdvancedModel.restore(p.modeAdvanced);
        matchLevels=p.matchLevels===false?false:true;matchLevelsUI();instrumentGainDb=GAIN_DEFAULTS.slice(0);if(p.instrumentGainDb&&p.instrumentGainDb.length===5)for(j=0;j<5;j++)if(finite(p.instrumentGainDb[j]))instrumentGainDb[j]=clamp(p.instrumentGainDb[j],-12,24);applyInstrumentGain();modeVarPrepared={isjs:false,many:false,rmhs:false,sioe:false};
        sourceRegions=SourceRegionModel.restore(p.sourceRegions);sourceRestorePending=[true,true,true];
        grain = CMPEModel.defaultSettings("isjs");
        grain.position = clamp(p.isjs.position, 0, 1); grain.densityY = clamp(p.isjs.densityY, 0, 1);
        for (j = 0; j < 3; j++) { grain.rates[j] = clamp(p.isjs.rates[j], 0.3, 1.7); grain.levels[j] = clamp(p.isjs.levels[j], 0, 1); }
        many = CMPEModel.defaultSettings("many");
        many.level = clamp(p.many.level, 0, 2); many.delayMaxMs = clamp(p.many.delayMaxMs, 100, 500);
        many.intervalMaxMs = clamp(p.many.intervalMaxMs, 5000, 20000); many.pitchSet = Math.round(clamp(p.many.pitchSet, 0, 4));
        if (validNumbers(p.many.microtonalSet, 12)) many.microtonalSet = p.many.microtonalSet.map(function (v) { return clamp(v, -0.15, 0.15); });
        drone = {level: clamp(p.rmhs.level, 0, 1), fundamentalHz: clamp(p.rmhs.fundamentalHz, 20, 20000),
            intervalSemitones: clamp(p.rmhs.intervalSemitones, 0, 24), durationSeconds: clamp(p.rmhs.durationSeconds, 1, 600),
            harmonics: Math.round(clamp(p.rmhs.harmonics, 3, 20))};
        cut = {count: Math.round(clamp(p.sioe.count, 1, 100)), tempo: clamp(p.sioe.tempo, 1, 1500),
            hitSeconds: clamp(p.sioe.hitSeconds, 0.1, 10), form: p.sioe.form};
        modeIndex = p.mode; loopEnabled = !!p.loop; monitor(clamp(p.monitorDb, -72, 18));
        for (j = 0; j < 3; j++) ui("repeat" + (j + 1), repetitions[j]);
        ui("pitch", pitchRange); ui("loop_toggle", loopEnabled ? 1 : 0);
        showMode(); ui("render_info", modeHint());
        for (j = 0; j < 3; j++) if (p.samples[j]) loadfile(j, p.samples[j]);
        status(sourcesBusy() ? "Settings restored. Loading referenced samples..." : "Settings restored. Press PLAY or START.");
    }
    g.presetread = function () {
        var path = arrayfromargs(arguments).join(" "), f, body = "";
        if (!path || savePending) return;
        try {
            f = new File(path, "read");
            if (!f.isopen || f.eof > 1048576) throw new Error("Cannot read that CMPE settings file.");
            while (f.position < f.eof) body += f.readline(8192) + "\n";
            f.close(); restorePreset(JSON.parse(body));
        } catch (e) { if (f && f.isopen) f.close(); status("Settings not loaded: " + e.message); }
    };
    g.shutdown = function () {
        cancelPresetRestore();
        cancelLiveTasks(); stopVoices(); stopRecording(); cutRenderer = null;
        base.shutdown();
    };
    g.notifydeleted = function () { g.shutdown(); };
    // Host integrations can preserve the same validated settings format without
    // writing an intermediate JSON file. Returned state is a detached snapshot;
    // restores still use the serialized native-buffer loading safeguards above.
    g.CMPEHost = {
        snapshot: function () { return JSON.parse(JSON.stringify(snapshot())); },
        validate: validatePreset,
        restore: restorePreset
    };
    // Read-only state for the developer harness; this does not expose audio data.
    g.CMPEState = function () {
        return {mode: modeIndex, state: state, settings: snapshot(), recording: recording,
            recordArmed: recordArmed, activeTasks: Object.keys(tasks).length, liveToken: liveToken,
            restoring: pendingPreset !== null, nativeBusy: nativeBusy.slice(0)};
    };
}(this));

/* CMPE audio settings. Append after cmpe_extension.js.
 * Native adstatus objects enumerate the active Max driver's own options.
 * No device names, driver indices, or option meanings are assumed here.
 * Startup, refresh, and polling only read global Max audio settings.
 */
(function (g) {
    "use strict";
    var base = {}, wrapped = ["loadbang", "lockUI", "requestAudio", "stop", "dspstate", "samplerate", "shutdown"];
    var k;
    for (k = 0; k < wrapped.length; k++) base[wrapped[k]] = g[wrapped[k]];
    var menus = {
        driver: {native: "audio_ad_driver", ui: "audio_driver_menu", items: [], index: -1, seen: -1, seenName: "", version: 0, catalogVersion: 0, completedCatalog: 0, changedAt: 0},
        option1: {native: "audio_ad_option1", ui: "audio_option1_menu", items: [], index: -1, seen: -1, seenName: "", version: 0, catalogVersion: 0, completedCatalog: 0, changedAt: 0},
        option2: {native: "audio_ad_option2", ui: "audio_option2_menu", items: [], index: -1, seen: -1, seenName: "", version: 0, catalogVersion: 0, completedCatalog: 0, changedAt: 0}
    };
    var labels = ["Driver option 1", "Driver option 2"];
    var disposed = false, started = false, updating = false, refreshing = false;
    var switchKnown = false, changing = false, pending = null, generation = 0;
    var bootTask = null, changeTask = null, settleTask = null, pollTask = null, externalTask = null;
    var refreshTask = null, refreshRequest = null, refreshGeneration = 0, switchVersion = 0;
    var refreshFault = false, notice = "", fadeMs = 30;

    function objectMessage(name, args) {
        var o = named(name);
        if (!o) return false;
        o.message.apply(o, args);
        return true;
    }
    function clickable(name, yes) { objectMessage(name, ["ignoreclick", yes ? 0 : 1]); }
    function currentMenu(kind) { return menus.hasOwnProperty(kind) ? menus[kind] : null; }
    function validIndex(m, index) {
        return m && finite(index) && Math.floor(index) === index && index >= 0 && index < m.items.length;
    }
    function mainStatus(text) { if (!disposed) status(text); }
    function display() {
        if (disposed) return;
        var text;
        if (changing) text = pending && pending.kind === "on" ? "Starting audio..." : "Applying audio settings...";
        else if (notice) text = notice;
        else if (!switchKnown) text = "Audio status unavailable · AUDIO SETUP";
        else if (!audioOn) text = "Audio off · press PLAY / START";
        else text = "Audio on" + (sampleRate > 0 ? " · " + (sampleRate / 1000).toFixed(sampleRate % 1000 ? 1 : 0) + " kHz" : "");
        ui("audio_status", text);
        objectMessage("audio_power", ["text", switchKnown ? (audioOn ? "AUDIO ON" : "AUDIO OFF") : "AUDIO ?"]);
        var bg = switchKnown && audioOn ? [23 / 255, 79 / 255, 203 / 255, 1] : [224 / 255, 229 / 255, 235 / 255, 1];
        var fg = switchKnown && audioOn ? [1, 1, 1, 1] : [23 / 255, 32 / 255, 43 / 255, 1];
        objectMessage("audio_power", ["bgcolor"].concat(bg));
        objectMessage("audio_power", ["bgoncolor"].concat(switchKnown && audioOn ? [16 / 255, 58 / 255, 154 / 255, 1] : [205 / 255, 212 / 255, 221 / 255, 1]));
        objectMessage("audio_power", ["textcolor"].concat(fg));
        objectMessage("audio_power", ["textoncolor"].concat(fg));
        objectMessage("audio_power", ["textovercolor"].concat(fg));
    }
    function locks() {
        var name, m;
        for (name in menus) if (menus.hasOwnProperty(name)) {
            m = menus[name];
            clickable(m.ui, !changing && !refreshing && !externalTask && !disposed && m.items.length > 0 &&
                (name === "driver" || validIndex(menus.driver, menus.driver.index)));
        }
        clickable("audio_power", !changing && !disposed);
        clickable("audio_setup", !changing && !disposed);
        clickable("audio_refresh", !changing && !disposed);
        if (changing) {
            clickable("play_button", false); clickable("new_button", false);
            clickable("test_audio", false); clickable("record_button", false);
        } else if (!disposed) clickable("test_audio", true);
    }
    function drawMenu(m) {
        // adstatus is wired directly to umenu. Its native clear/append/set
        // messages own the visible list, even before this controller is ready.
        // Rebuilding the list here would duplicate or erase native entries.
        drawIndex(m);
    }
    function drawIndex(m) {
        var previous = updating;
        updating = true;
        try { objectMessage(m.ui, ["set", validIndex(m, m.index) ? m.index : -1]); }
        finally { updating = previous; }
        locks();
    }
    function quiet() {
        // stop() cancels the controller's finite/live/render/record work. The
        // TEST SOUND delay and native gates need their separate native stops.
        base.stop();
        objectMessage("audio_test_stop", ["bang"]);
        objectMessage("live_stop", ["bang"]);
    }
    function read(name, selector) {
        if (disposed) return;
        try {
            if (!objectMessage(name, [selector])) refreshFault = true;
        } catch (e) { refreshFault = true; }
    }
    function cancelRefresh() {
        refreshGeneration++;
        cancelTask(refreshTask); refreshTask = null;
        refreshRequest = null; refreshing = false;
    }
    function freshMenu(kind, snapshot, enumerate, allowEmpty) {
        var m = menus[kind];
        if (m.catalogVersion > snapshot.catalogVersion) {
            // Only the left outlet's closing set completes a nonempty native
            // enumeration. A delayed value from an earlier poll is not proof
            // that the requested clear/append/set cycle has finished.
            return m.completedCatalog === m.catalogVersion ||
                (allowEmpty && !m.items.length && new Date().getTime() - m.changedAt >= 25);
        }
        return !enumerate && m.version > snapshot.version;
    }
    function finishRefresh(token) {
        var request = refreshRequest;
        if (disposed || !request || token !== refreshGeneration) return;
        refreshTask = null;
        var ready = switchVersion > request.switchVersion, name, snapshot;
        if (request.kind !== "switch") {
            ready = ready && freshMenu("driver", request.menus.driver, request.enumerate);
            for (name in menus) if (menus.hasOwnProperty(name) && name !== "driver") {
                snapshot = request.menus[name];
                // A previously populated option or an enumeration already in
                // progress must settle before controls are unlocked. Unused
                // driver options are allowed to remain silent and empty.
                if (request.kind === name || snapshot.count > 0 || menus[name].catalogVersion > snapshot.catalogVersion)
                    ready = ready && freshMenu(name, snapshot, request.enumerate, name !== request.kind);
            }
        }
        if (!ready && request.attempts++ < 20) {
            refreshTask = new Task(function () { finishRefresh(token); }, host);
            refreshTask.schedule(25);
            return;
        }
        refreshRequest = null; refreshing = false;
        if (refreshFault) notice = "Audio controls unavailable · AUDIO SETUP";
        locks(); display();
        if (request.done) request.done(ready);
    }
    function refreshAll(done, kind, enumerate) {
        if (disposed) return;
        cancelRefresh();
        var token = refreshGeneration, name, m, snapshots = {};
        refreshing = true; refreshFault = false;
        for (name in menus) if (menus.hasOwnProperty(name)) {
            m = menus[name]; snapshots[name] = {version: m.version, catalogVersion: m.catalogVersion, count: m.items.length};
        }
        refreshRequest = {done: done, kind: kind, enumerate: !!enumerate, menus: snapshots,
            switchVersion: switchVersion, attempts: 0};
        locks();
        // A read request is not a response. Preserve the last native list
        // until adstatus actually sends clear, and wait for fresh set/value
        // feedback before validating a pending hardware change.
        if (kind !== "switch") {
            read("audio_ad_driver", "loadbang");
            read("audio_name_option1", "loadbang"); read("audio_name_option2", "loadbang");
            read("audio_ad_option1", "loadbang"); read("audio_ad_option2", "loadbang");
        }
        read("audio_ad_switch", "bang");
        finishRefresh(token);
    }
    function queryCurrent() {
        if (disposed || changing || refreshing) return;
        read("audio_ad_driver", "bang");
        read("audio_ad_option1", "bang"); read("audio_ad_option2", "bang");
        read("audio_ad_switch", "bang");
    }
    function schedulePoll() {
        if (disposed) return;
        cancelTask(pollTask);
        pollTask = new Task(function () {
            if (disposed) return;
            queryCurrent(); schedulePoll();
        }, host);
        pollTask.schedule(2000);
    }
    function externalChange() {
        if (disposed || refreshing || changing || externalTask) return;
        quiet();
        mainStatus("Audio settings changed in Max. Refreshing devices; press PLAY or START when ready.");
        var token = generation;
        externalTask = new Task(function () {
            if (disposed || token !== generation || changing) return;
            externalTask = null;
            refreshAll();
        }, host);
        locks();
        externalTask.schedule(1);
    }
    function readIndex(kind, value) {
        var m = currentMenu(kind), previous, oldName, newName, n = Number(value);
        if (disposed || !m || !finite(n) || Math.floor(n) !== n) return;
        previous = m.seen; oldName = m.seenName; newName = validIndex(m, n) ? m.items[n] : "";
        m.version++;
        m.index = n; m.seen = n; m.seenName = newName;
        drawIndex(m);
        if (previous >= 0 && (n !== previous || (oldName && newName && oldName !== newName)) && !refreshing && !changing) externalChange();
    }
    function clearPending() {
        generation++;
        cancelRefresh();
        cancelTask(changeTask); cancelTask(settleTask); cancelTask(externalTask);
        changeTask = null; settleTask = null; externalTask = null;
        changing = false; pending = null;
    }
    function sameChoice(request) {
        var m = currentMenu(request.kind), driver = menus.driver;
        return validIndex(m, request.index) && m.items[request.index] === request.label &&
            (request.kind === "driver" || (validIndex(driver, driver.index) && driver.index === request.driverIndex &&
                driver.items[driver.index] === request.driverLabel));
    }
    function reportChange(token, confirmed) {
        if (disposed || token !== generation || !pending) return;
        var request = pending;
        changing = false; pending = null;
        notice = confirmed ? "" : "Audio setting unconfirmed · use AUDIO SETUP";
        g.lockUI(!mutable()); display();
        if (!confirmed) mainStatus("Max did not confirm the requested audio setting. Open AUDIO SETUP and check the driver and devices.");
        else if (request.kind === "on") mainStatus("Audio is on. Press PLAY or START to begin.");
        else if (request.kind === "setup") mainStatus("Audio Setup opened with playback stopped. Choose your interface, then press PLAY / START or turn audio on.");
        else mainStatus("Audio off. Press PLAY / START or turn audio on when ready.");
    }
    function finishChange(token) {
        if (disposed || token !== generation || !pending) return;
        settleTask = null;
        var request = pending;
        refreshAll(function (fresh) {
            if (disposed || token !== generation || pending !== request) return;
            var confirmed = false, identityChanged = fresh && currentMenu(request.kind) && !sameChoice(request);
            if (fresh) {
                if (request.kind === "on") confirmed = switchKnown && audioOn;
                else if (request.kind === "off" || request.kind === "setup") confirmed = switchKnown && !audioOn;
                else confirmed = !identityChanged && menus[request.kind].index === request.index && switchKnown && !audioOn;
            }
            if (confirmed || identityChanged || new Date().getTime() >= request.deadline) {
                reportChange(token, confirmed); return;
            }
            settleTask = new Task(function () { finishChange(token); }, host);
            settleTask.schedule(50);
        }, currentMenu(request.kind) ? request.kind : "switch", !!currentMenu(request.kind));
    }
    function awaitConfirmation(token) {
        if (disposed || token !== generation || !pending) return;
        pending.phase = "readback";
        pending.deadline = new Date().getTime() + 1000;
        settleTask = new Task(function () { finishChange(token); }, host);
        settleTask.schedule(150);
    }
    function rejectChoice(token) {
        if (disposed || token !== generation || !pending) return;
        clearPending(); notice = "Audio choices changed · press REFRESH";
        g.lockUI(!mutable()); display();
        mainStatus("Audio choices changed or Max did not confirm audio off. Press REFRESH, then choose the interface again, or open AUDIO SETUP.");
    }
    function applyChoice(token) {
        if (disposed || token !== generation || !pending) return;
        var request = pending;
        refreshAll(function (fresh) {
            if (disposed || token !== generation || pending !== request) return;
            if (fresh && !sameChoice(request)) { rejectChoice(token); return; }
            if (!fresh || !switchKnown || audioOn) {
                if (new Date().getTime() >= request.deadline) { rejectChoice(token); return; }
                settleTask = new Task(function () { applyChoice(token); }, host);
                settleTask.schedule(25); return;
            }
            try {
                if (!objectMessage(menus[request.kind].native, ["int", request.index])) throw new Error("Audio option unavailable");
                awaitConfirmation(token);
            } catch (e) { reportChange(token, false); }
        }, request.kind, true);
    }
    function beginChange(kind, index) {
        if (disposed || updating) return;
        if (changing) { mainStatus("Please wait for the current audio setting change."); return; }
        if (savePending && kind !== "off") { mainStatus("Wait for the WAV save to finish before changing audio settings."); return; }
        clearPending();
        var m = currentMenu(kind), driver = menus.driver;
        changing = true; pending = {kind: kind, index: index, phase: "fade",
            label: m ? m.items[index] : "", driverIndex: driver.index,
            driverLabel: validIndex(driver, driver.index) ? driver.items[driver.index] : ""}; notice = "";
        var token = generation;
        quiet();
        if (disposed || token !== generation || !pending) return;
        g.lockUI(true); display();
        mainStatus(kind === "on" ? "Starting audio..." : "Stopping playback before changing audio settings...");
        if (disposed || token !== generation || !pending) return;
        changeTask = new Task(function () {
            if (disposed || token !== generation || !pending) return;
            changeTask = null;
            try {
                pending.phase = "apply";
                // These are the only writes to global audio settings in this
                // module. They follow an explicit user action and a 30 ms fade.
                var switched = false;
                try { switched = objectMessage("audio_ad_switch", ["int", kind === "on" ? 1 : 0]); } catch (switchError) {}
                if (disposed || token !== generation || !pending) return;
                if (!switched) {
                    // dac~ stop/open remain a native recovery path if an
                    // adstatus object is missing or unavailable.
                    if (kind === "on" || !objectMessage("audio_driver", ["stop"])) throw new Error("Audio switch unavailable");
                }
                if (disposed || token !== generation || !pending) return;
                if (kind === "setup") {
                    var opened = false;
                    try { opened = objectMessage("audio_setup_native", ["bang"]); } catch (setupError) {}
                    if (disposed || token !== generation || !pending) return;
                    if (!opened && !objectMessage("audio_driver", ["open"])) throw new Error("Audio Setup unavailable");
                } else if (currentMenu(kind)) {
                    // Devices can disappear or be reordered during the fade.
                    // Re-enumerate and await fresh feedback before using an
                    // index. A delayed native response is not a failed choice.
                    pending.phase = "validate";
                    pending.deadline = new Date().getTime() + 1000;
                    applyChoice(token); return;
                }
                awaitConfirmation(token);
            } catch (e) {
                if (disposed || token !== generation) return;
                changing = false; pending = null;
                notice = "Audio controls unavailable · AUDIO SETUP";
                g.lockUI(!mutable()); display();
                mainStatus("Audio settings could not be changed. Open Max's Options > Audio Status and choose your interface there.");
            }
        }, host);
        changeTask.schedule(fadeMs);
    }

    g.audiomenu = function (kind, selector) {
        var m = currentMenu(String(kind)), args = arrayfromargs(arguments), text;
        if (disposed || !m) return;
        if (selector === "clear") {
            m.items = []; m.index = -1; m.catalogVersion++; m.completedCatalog = 0;
            m.changedAt = new Date().getTime(); locks();
        }
        else if (selector === "append") {
            text = args.slice(2).join(" ");
            if (text) { m.items.push(text); m.completedCatalog = 0; m.changedAt = new Date().getTime(); locks(); }
        } else if (selector === "set") {
            m.completedCatalog = m.catalogVersion;
            readIndex(String(kind), args[2]);
        }
    };
    g.audiovalue = function (kind, value) { readIndex(String(kind), value); };
    g.audioname = function (number, selector) {
        number = Number(number);
        if (disposed || (number !== 1 && number !== 2)) return;
        var args = arrayfromargs(arguments), text = "";
        if (selector === "clear") text = "Driver option " + number;
        else if (selector === "append" || selector === "set") {
            if (selector === "set" && args.length === 3 && finite(Number(args[2]))) return;
            text = args.slice(2).join(" ");
        } else text = args.slice(1).join(" ");
        if (text) { labels[number - 1] = text; ui("audio_option" + number + "_label", text); }
    };
    g.audioswitch = function (value) {
        value = Number(value);
        if (value === 0 || value === 1) g.dspstate(value);
    };
    g.audiochoose = function (kind, value) {
        kind = String(kind); value = Number(value);
        var m = currentMenu(kind);
        if (disposed || updating || refreshing || changing || externalTask || !m) return;
        if (!validIndex(m, value) ||
            (kind !== "driver" && !validIndex(menus.driver, menus.driver.index))) {
            mainStatus("No current device choices were reported. Press REFRESH or open AUDIO SETUP.");
            drawMenu(m); return;
        }
        if (value === m.index) return;
        beginChange(kind, value);
    };
    g.audiopower = function () {
        if (disposed || changing) return;
        queryCurrent();
        if (!switchKnown) {
            notice = "Audio status unavailable · AUDIO SETUP"; display();
            mainStatus("Max has not reported its audio state. Open AUDIO SETUP, or press REFRESH to try again.");
            return;
        }
        beginChange(audioOn ? "off" : "on", -1);
    };
    g.audiosetup = function () { beginChange("setup", -1); };
    g.audiorefresh = function () {
        if (disposed || changing) return;
        notice = "";
        refreshAll(function (fresh) {
            mainStatus(!fresh || refreshFault || !menus.driver.items.length ?
                "Audio choices were not reported. Open AUDIO SETUP to choose your interface." :
                "Audio choices refreshed from Max. Driver option names and devices depend on your audio driver.");
        });
    };
    g.loadbang = function () {
        base.loadbang();
        if (started || disposed) return;
        started = true;
        display(); locks();
        bootTask = new Task(function () {
            bootTask = null;
            if (disposed) return;
            if (!changing) refreshAll();
            schedulePoll();
        }, host);
        bootTask.schedule(80);
    };
    g.lockUI = function (flag) { base.lockUI(flag || changing); locks(); };
    g.requestAudio = function (action) {
        if (disposed) return;
        if (changing) { mainStatus("Please wait for the audio setting change, then press PLAY or START."); return; }
        notice = ""; queryCurrent(); display();
        base.requestAudio(action);
    };
    g.stop = function () {
        if (disposed) return;
        var cancelled = changing;
        if (cancelled) clearPending();
        quiet();
        if (cancelled) {
            notice = ""; refreshAll(); g.lockUI(!mutable());
            mainStatus("Audio change stopped. Check AUDIO SETUP if the setting had already been applied.");
        }
    };
    g.dspstate = function (value) {
        value = Number(value);
        if (disposed || (value !== 0 && value !== 1)) return;
        var stopped = switchKnown && audioOn && value === 0;
        switchVersion++;
        switchKnown = true;
        if (stopped && !changing) quiet();
        base.dspstate(value);
        display();
    };
    g.samplerate = function (value) {
        if (disposed) return;
        base.samplerate(value); display();
    };
    g.shutdown = function () {
        if (disposed) return;
        disposed = true; clearPending();
        cancelTask(bootTask); cancelTask(pollTask); bootTask = null; pollTask = null;
        objectMessage("audio_test_stop", ["bang"]); objectMessage("live_stop", ["bang"]);
        base.shutdown();
    };
    // Read-only diagnostic snapshot. Hardware/global preferences are deliberately
    // excluded from the instrument JSON preset produced by cmpe_extension.js.
    g.CMPEAudioState = function () {
        var result = {changing: changing, refreshing: refreshing, disposed: disposed,
            switchKnown: switchKnown, audioOn: audioOn, sampleRate: sampleRate,
            generation: generation, pending: pending ? {kind: pending.kind, index: pending.index, phase: pending.phase,
                label: pending.label, driverIndex: pending.driverIndex, driverLabel: pending.driverLabel} : null,
            labels: labels.slice(0), menus: {}, notice: notice,
            tasks: {boot: !!bootTask, change: !!changeTask, settle: !!settleTask, poll: !!pollTask, external: !!externalTask, refresh: !!refreshTask}};
        var name, m;
        for (name in menus) if (menus.hasOwnProperty(name)) {
            m = menus[name]; result.menus[name] = {items: m.items.slice(0), index: m.index};
        }
        return result;
    };
}(this));

/* CMPE standalone presentation feedback.
 * Append after cmpe_audio_settings.js. No DSP, scheduling, randomization, source
 * reads, or persisted settings are changed here. All new widgets are optional.
 */
(function (g) {
    "use strict";
    if (typeof g.CMPEUIFeedback === "function") return;

    var baseUI = g.ui, depth = 0, drawing = false, disposed = false;
    var bootPending = false, checkingSilence = false, fault = "";
    var currentStatus = "", renderInfo = "", heldNotice = "", elapsedSeconds = 0;
    var playbackFraction = 0, waveZoom = 1, zoomForResult = false, cache = {}, lastView = null;
    function rgba(hex) {
        return [parseInt(hex.substr(1, 2), 16) / 255,
            parseInt(hex.substr(3, 2), 16) / 255,
            parseInt(hex.substr(5, 2), 16) / 255, 1];
    }
    var white = rgba("#FFFFFF"), ink = rgba("#17202B"), muted = rgba("#465365");
    var inactive = rgba("#E0E5EB"), disabled = rgba("#D9DFE7"), disabledInk = rgba("#525C69");
    var blue = rgba("#174FCB"), charcoal = rgba("#263140"), pressed = rgba("#CDD4DD");
    var hover = rgba("#BFDBFE"), bluePressed = rgba("#103A9A"), fieldFill = rgba("#EBEFF4");
    var accents = [blue, blue, blue, blue, blue];
    var tints = [white, white, white, white, white];
    var amber = ink, amberTint = inactive;
    var red = rgba("#A82132"), redTint = rgba("#FFF1F2");

    function object(name) { return g.named(name); }
    function send(name, selector, values) {
        var o = object(name), key = name + ":" + selector, signature = JSON.stringify(values);
        if (!o || cache[key] === signature) return;
        cache[key] = signature;
        o.message.apply(o, [selector].concat(values));
    }
    function set(name, value) { send(name, "set", [value]); }
    function color(name, selector, value) { send(name, selector, value); }
    function hide(name, yes) { var o = object(name); if (o) o.hidden = yes ? 1 : 0; }
    function finiteNumber(value) { return typeof value === "number" && isFinite(value); }
    function unit(value) { return Math.max(0, Math.min(1, finiteNumber(value) ? value : 0)); }
    function transport(name, label, enabled, accent, tint, emphasized) {
        send(name, "text", [label]);
        // active=0 makes native textbutton substitute an illegible gray. Keep
        // its presentation active; the original lockUI owns click permissions.
        send(name, "active", [1]);
        send(name, "usebgoncolor", [1]);
        send(name, "usetextovercolor", [1]);
        var bg = enabled || emphasized ? (emphasized ? accent : tint) : disabled;
        var fg = enabled || emphasized ? (emphasized ? white : accent) : disabledInk;
        color(name, "bgcolor", bg);
        color(name, "bgoncolor", enabled || emphasized ? (emphasized ? ink : pressed) : disabled);
        color(name, "textcolor", fg); color(name, "textoncolor", fg); color(name, "textovercolor", fg);
    }
    function styleControl(name, enabled, accent, tint) {
        var load = /^load[123]$/.test(name);
        if(load) send(name, "ignoreclick", [enabled ? 0 : 1]);
        var button = load || /^(?:demo_button|save_button|clear_button)$/.test(name);
        var bg = enabled ? (load ? inactive : (tint || (button ? white : fieldFill))) : disabled;
        var fg = enabled ? (load ? ink : (accent || ink)) : disabledInk;
        color(name, name === "mode_menu" ? "bgfillcolor" : "bgcolor", bg);
        color(name, "textcolor", fg);
        if (name === "mode_menu") send(name, "applycolors", [1]);
        if (button) {
            // Preserve readable custom disabled colors without changing the
            // controller's ignoreclick lock or enabling a source during reads.
            send(name, "active", [1]);
            send(name, "usebgoncolor", [1]);
            send(name, "usetextovercolor", [1]);
            color(name, "bgoncolor", enabled ? pressed : disabled);
            color(name, "textoncolor", fg);
            color(name, "textovercolor", enabled && load ? blue : fg);
        }
    }
    function diagnostic(text) {
        return /(?:did not (?:start|advance|finish|complete)|has not finished|not loaded:|no audible partials|cannot be read|check the source file and max console|unconfirmed)/i.test(text);
    }
    function clearNotice() { heldNotice = ""; fault = ""; }
    function info() {
        return typeof g.CMPEState === "function" ? g.CMPEState() :
            {mode: 0, state: g.state, recording: false, recordArmed: false, nativeBusy: [false, false, false]};
    }
    function refresh() {
        if (drawing || disposed || depth > 0) return;
        drawing = true;
        try {
            var cmpe = info(), mode = cmpe.mode, rendered = mode === 0 || mode === 4;
            var audio = typeof g.CMPEAudioState === "function" ? g.CMPEAudioState() : {};
            var state = g.state, required = sourceCountFor(mode);
            var loading = false, stalled = false, missing = false, i, sourceState;
            var accent = accents[mode] || accents[0], tint = tints[mode] || tints[0];
            for (i = 0; i < 3; i++) {
                var nativeBusy = !!(cmpe.nativeBusy && cmpe.nativeBusy[i]);
                var reading = !!(g.loading && g.loading[i]);
                var available = !!(g.sources && g.sources[i]);
                sourceState = nativeBusy && !reading ? "WAITING" :
                    (nativeBusy || reading ? "LOADING" : (available ? "READY" : "EMPTY"));
                hide("source_state" + (i + 1), i >= required || (mode === 2 && i > 0));
                send("load" + (i + 1), "text", [mode === 2 && i > 0 ? "LOAD S" + (i + 1) : "LOAD"]);
                set("source_state" + (i + 1), sourceState);
                color("source_state" + (i + 1), "textcolor", sourceState === "WAITING" ? red :
                    (sourceState === "LOADING" ? amber : (available ? ink : muted)));
                color("source_card" + (i + 1), "bgfillcolor", i >= required ? white : (sourceState === "WAITING" ? redTint :
                    (sourceState === "LOADING" ? amberTint : white)));
                color("source_accent" + (i + 1), "bgfillcolor", charcoal);
                if (i < required) {
                    loading = loading || nativeBusy || reading;
                    stalled = stalled || (nativeBusy && !reading);
                    if (!(mode === 2 && i > 0)) missing = missing || !available; // extra Many sources are optional
                }
            }
            var groupLabels = mode === 3 ? ["DRONE", "HARMONICS", "INTERVAL"] :
                (mode === 2 ? ["", "SPACE", "TIMING + PITCH"] : ["", "PACE", "SHAPE"]);
            var groupHelp = mode === 3 ? (typeof g.rmhsGuidance === "function" ? g.rmhsGuidance() : ["Sine-wave drone.\nNo sample files needed.", "Tune the fundamental and\nnumber of partials.", "Transpose the side banks\nin semitones."]) :
                (mode === 2 ? (typeof g.manyGuidance === "function" ? g.manyGuidance() : ["", "Set the longest delay in\nthe layered reverb.", "Control layer spacing and\nthe pitch collection."]) :
                    ["", "Tempo shapes the Long form.\nShort plays all slices together.", "Choose the slice length and\na short burst or a gradual build."]);
            for (i = 1; i <= 3; i++) {
                var grouped = mode === 3 || ((mode === 2 || mode === 4) && i > 1);
                hide("group_label" + i, !grouped); hide("group_help" + i, !grouped);
                if (grouped) {
                    set("group_label" + i, groupLabels[i - 1]); set("group_help" + i, groupHelp[i - 1]);
                    color("group_label" + i, "textcolor", ink); color("group_help" + i, "textcolor", muted);
                }
            }
            var label, heading, badgeColor = accent, panelColor = tint, fraction = 0;
            var canEdit = state === "idle" || state === "ready";
            var busy = state === "waiting" || state === "rendering" || state === "stopping" || state === "restoring" || audio.changing;
            if (audio.changing) {
                label = audio.pending && audio.pending.kind === "on" ? "STARTING AUDIO" : "AUDIO SETTINGS";
                heading = audio.pending && audio.pending.kind === "on" ? "Waiting for Max audio" : "Applying audio settings";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "restoring" || cmpe.restoring) {
                label = "RESTORING SET"; heading = "Waiting for the current sample read";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "waiting") {
                label = "STARTING AUDIO"; heading = "Waiting for Max audio";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "rendering") {
                if (checkingSilence && mode === 0) {
                    label = "CHECKING SILENCE"; heading = "Checking the beginning and ending";
                    fraction = unit(g.scanLimit > 0 ? g.scanFrame / g.scanLimit : 0);
                    badgeColor = amber; panelColor = amberTint;
                } else {
                    fraction = unit(g.renderHalf > 0 ? g.renderFrame / g.renderHalf : 0);
                    label = "RENDERING " + Math.floor(fraction * 100) + "%";
                    heading = "Building the audio waveform";
                }
            } else if (state === "playing") {
                label = g.loopEnabled ? "LOOPING" : "PLAYING";
                heading = g.loopEnabled ? "Playing the selected loop" : "Playing the rendered take";
                fraction = playbackFraction;
            } else if (state === "live") {
                var fading = (mode === 2 && elapsedSeconds < modeAdvanced.many.values.fade[1]) || (mode === 3 && elapsedSeconds < modeAdvanced.rmhs.values.attack[1]);
                label = cmpe.recording ? "RECORDING" : (fading ? "FADING IN" : "LIVE");
                heading = mode === 1 ? "Move the pad to shape the grains" :
                    (mode === 2 ? (fading ? "The ambient layers are fading in" : "Playing overlapping ambient layers") :
                        (fading ? "Harmonics enter over " + attackText() : "The harmonic drone is evolving"));
                if (cmpe.recording) { badgeColor = red; panelColor = redTint; }
                // RMHS already sends the true planned-duration fraction. Live
                // ISJS and Many have no finite completion percentage.
                fraction = mode === 3 ? null : 0;
            } else if (state === "stopping") {
                label = "STOPPING"; heading = "Fading the output";
                badgeColor = amber; panelColor = amberTint;
            } else if (stalled) {
                label = "LOAD STALLED"; heading = "A sample read has not finished";
                badgeColor = red; panelColor = redTint;
            } else if (loading || (bootPending && required > 0)) {
                label = "LOADING SAMPLES"; heading = "Reading the source audio";
                badgeColor = amber; panelColor = amberTint;
            } else if (fault) {
                label = fault === "cancelled" ? "CANCELLED" : "RENDER ERROR";
                heading = fault === "cancelled" ? "Generation cancelled · no complete take" : "Generation did not complete";
                badgeColor = fault === "cancelled" ? amber : red;
                panelColor = fault === "cancelled" ? amberTint : redTint;
            } else if (rendered && g.outputReady && g.dirty) {
                label = "CHANGES PENDING"; heading = "Cached waveform · generate the new settings";
                badgeColor = amber; panelColor = amberTint; fraction = 1;
            } else if (rendered && g.outputReady) {
                label = "READY TO PLAY"; heading = "Waveform ready · select a range or play"; fraction = 1;
            } else if (mode === 3 && /^Drone finished\./.test(currentStatus)) {
                label = "COMPLETE"; heading = "Drone finished · START makes another performance"; fraction = 1;
            } else if (missing) {
                label = "LOAD SAMPLES"; heading = required === 1 ? "Load sample 1 or choose DEMO" : "Load three samples or choose DEMO";
                badgeColor = muted; panelColor = inactive;
            } else if (cmpe.recordArmed) {
                label = "RECORD ARMED"; heading = "START begins the performance and recording";
                badgeColor = red; panelColor = redTint;
            } else {
                label = rendered ? "READY TO GENERATE" : "READY TO START";
                heading = rendered ? "Generate a new take from your samples" :
                    (mode === 3 ? "Start a harmonic drone · no samples needed" : "Start the live instrument");
            }
            if (g.savePending && canEdit) { label = "SAVING WAV"; heading = "Writing the complete rendered take"; badgeColor = amber; panelColor = amberTint; }

            send("state_badge", "active", [1]);
            send("state_badge", "ignoreclick", [1]);
            send("state_badge", "text", [label]);
            color("state_badge", "bgcolor", badgeColor); color("state_badge", "bgoncolor", badgeColor);
            color("state_badge", "textcolor", white); color("state_badge", "textoncolor", white); color("state_badge", "textovercolor", white);
            color("feedback_panel", "bgfillcolor", panelColor);
            set("activity_heading", heading); color("activity_heading", "textcolor", ink);
            color("status", "textcolor", heldNotice ? red : ink);
            color("progress", "knobcolor", badgeColor);
            if (fraction !== null) set("progress", fraction);
            hide("wave_scale", !rendered);
            var waveHelp = zoomForResult ? "View x" + waveZoom.toFixed(1) + " \u00b7 visual only" :
                (fault ? "Incomplete waveform" : (state === "rendering" ? "Preparing waveform" : "Generate to see waveform"));
            set("wave_scale", waveHelp);
            send("wave_l", "vzoom", [1 / waveZoom]); send("wave_r", "vzoom", [1 / waveZoom]);
            set("wave_magnify",waveZoom);
            var extraControls=["wave_magnify","wave_mag_label","range_start_label","range_start","range_end_label","range_end","range_help"];for(var ec=0;ec<extraControls.length;ec++)hide(extraControls[ec],!rendered);
            for(var se=0;se<3;se++)hide("source_edit_button"+se,se>=required);

            for (i = 0; i < 5; i++) {
                color("mode" + i, "bgcolor", i === mode ? blue : inactive);
                color("mode" + i, "bgoncolor", i === mode ? bluePressed : pressed);
                color("mode" + i, "textcolor", i === mode ? white : ink);
                color("mode" + i, "textoncolor", i === mode ? white : ink);
                color("mode" + i, "textovercolor", i === mode ? white : ink);
            }
            var readySources = !missing && !loading && !(bootPending && required > 0);
            var playLabel = busy ? "PREPARING..." : (state === "playing" ? "PLAYING" :
                (state === "live" ? "LIVE" : (rendered ? (g.dirty || !g.outputReady ? "GENERATE + PLAY" : "PLAY") : "START")));
            if (state === "stopping") playLabel = "STOPPING...";
            transport("play_button", playLabel, canEdit && !busy && readySources, accent, tint,
                state === "playing" || state === "live" || (canEdit && readySources && !busy));
            transport("new_button", rendered ? "NEW TAKE" : (mode === 3 ? "RANDOMIZE" : "RESET"),
                canEdit && !busy && !g.savePending && (rendered ? readySources : true), ink, inactive, false);
            transport("stop_button", state === "rendering" || state === "waiting" ? "CANCEL" : "STOP",
                state !== "idle" || loading || audio.changing || cmpe.recordArmed || cmpe.recording || !!g.fxSaved, red, redTint, false);
            transport("record_button", g.fxRecording ? "STOP REC" : "RECORD FX",
                state !== "waiting" && !audio.changing, red, redTint, !!g.fxRecording);
            for (i = 1; i <= 3; i++) styleControl("load" + i, !audio.changing && !(cmpe.nativeBusy && cmpe.nativeBusy[i - 1]));
            var paramsEditable = canEdit || (state === "live" && (mode === 1 || mode === 2));
            for (i = 0; i < 6; i++) {
                var activeParam = paramsEditable && !audio.changing;
                if (mode === 4 && i === 1 && cmpe.settings && cmpe.settings.sioe && cmpe.settings.sioe.form === "short") activeParam = false;
                styleControl("param" + i, activeParam);
            }
            for (i = 1; i <= 3; i++) styleControl("repeat" + i, canEdit && !busy);
            styleControl("pitch", canEdit && !busy); styleControl("mode_menu", paramsEditable && !audio.changing);
            styleControl("demo_button", canEdit && !busy && required > 0, ink, inactive);
            styleControl("save_button", !busy && !!g.outputReady, ink, inactive);
            styleControl("clear_button", !busy && !!g.outputReady, ink, inactive);
            lastView = {mode: mode, state: state, badge: label, heading: heading,
                phase: state === "rendering" ? (checkingSilence && mode === 0 ? "scan" : "render") : state,
                progress: fraction, notice: heldNotice, sourceLoading: loading, sourceStalled: stalled,
                outputReady: !!g.outputReady, dirty: !!g.dirty, waveZoom: waveZoom};
        } finally { drawing = false; }
    }

    g.ui = function (name, value) {
        if (name === "status") {
            g.tmLastStatus = String(value);
            currentStatus = String(value);
            if (diagnostic(currentStatus)) heldNotice = currentStatus;
            if (heldNotice) value = heldNotice;
        } else if (name === "render_info") renderInfo = String(value);
        else if (name === "time") {
            var parsed = parseFloat(value); if (finiteNumber(parsed)) elapsedSeconds = parsed;
        }
        // A renderer or native readback can write a property that this adapter
        // last wrote. Invalidate only that key before restoring the state view.
        delete cache[name + ":set"];
        var result = baseUI.call(this, name, value);
        refresh();
        return result;
    };
    function wrap(name, before, after) {
        var fn = g[name];
        if (typeof fn !== "function") return;
        g[name] = function () {
            depth++;
            try {
                if (before) before.apply(this, arguments);
                var result = fn.apply(this, arguments);
                if (after) after.apply(this, arguments);
                return result;
            } finally { depth--; refresh(); }
        };
    }
    wrap("loadbang", function () { if (!g.initialized) bootPending = true; });
    wrap("demos", function () { bootPending = false; clearNotice(); });
    wrap("loadfile", function () { bootPending = false; clearNotice(); });
    wrap("loaded", null, function (slot) {
        if (g.sources && g.sources[Number(slot)] && /(?:source load|source file|load did not finish)/i.test(heldNotice)) {
            var native = info().nativeBusy || [];
            if (!native[0] && !native[1] && !native[2]) {
                heldNotice = "";
                baseUI.call(g, "status", currentStatus);
            }
        }
    });
    wrap("beginRender", function () {
        clearNotice(); checkingSilence = info().mode === 0; playbackFraction = 0; elapsedSeconds = 0;
        waveZoom = 1; zoomForResult = false;
    });
    wrap("prepareOutput", function () { checkingSilence = false; });
    wrap("renderFailed", function (message) {
        fault = /cancel/i.test(String(message)) ? "cancelled" : "error"; checkingSilence = false;
        waveZoom = 1; zoomForResult = false;
    });
    wrap("renderComplete", function () { checkingSilence = false; fault = ""; }, function () {
        if (!g.outputReady) return;
        var peak = Number(g.renderPeak);
        if (info().mode === 4) peak = Math.min(peak, 0.98);
        waveZoom = finiteNumber(peak) && peak > g.silenceThreshold ? Math.max(1, Math.min(512, 0.82 / peak)) : 1;
        zoomForResult = true;
    });
    wrap("beginPlayback", function () { playbackFraction = 0; });
    wrap("phase", function (value) { if (g.state === "playing" && finiteNumber(Number(value))) playbackFraction = unit(Number(value)); });
    wrap("ended", null, function () { if (g.state === "ready") playbackFraction = 1; });
    wrap("mode", function (value) {
        value = Number(value);
        if (finiteNumber(value) && value >= 0 && value <= 4 && Math.floor(value) === value && value !== info().mode && !g.savePending) {
            clearNotice(); checkingSilence = false; elapsedSeconds = 0; waveZoom = 1; zoomForResult = false;
        }
    }, function () {
        // showMode writes its own colors and labels outside ui(). Force just
        // those presentation attributes to be refreshed after a mode change.
        cache = {};
    });
    wrap("lockUI", null, function () { cache = {}; });
    var actions = ["play", "newpiece", "stop", "repeats", "pitch", "param", "choice", "recordtoggle", "recordpath", "presetread", "audiopower", "audiochoose", "audiosetup"];
    for (var k = 0; k < actions.length; k++) wrap(actions[k], clearNotice);
    var updates = ["loaded", "scanOpening", "renderTick", "allocateOutput", "finishPlayback", "markDirty", "commitSelection", "loopmode", "clearloop", "recordelapsed", "saved", "dspstate", "samplerate"];
    for (k = 0; k < updates.length; k++) wrap(updates[k], null, function () {
        // showMode() is private and is also called by loaded()/param(). Those
        // public hooks finish with a fresh view rather than leaving its labels.
        delete cache["play_button:text"]; delete cache["new_button:text"]; delete cache["stop_button:text"];
    });
    wrap("shutdown", null, function () { disposed = true; });
    g.feedbackwavezoom = function (value) {
        value = Number(value); if (!finiteNumber(value) || value <= 0) return;
        waveZoom = value; zoomForResult = true; refresh();
    };
    g.feedbackrefresh = refresh;
    g.CMPEUIFeedback = function () { return lastView ? JSON.parse(JSON.stringify(lastView)) : null; };
}(this));

/* Instance-local Tape + Memory host bridge. */
(function(g) {
    g.fxSaved = null; g.fxRecording = false;
    g.fxsend = function() { var b = named("fx_bus"); var p = b ? b.subpatcher() : null; var c = p ? p.getnamed("fx_control") : null; if (c) c.message.apply(c, arrayfromargs(arguments)); };
    g.fxsettings = function(value) { try { g.fxSaved = JSON.parse(String(value)); } catch(e) { post("FX settings: " + e.message + "\n"); } };
    g.fxrestore = function(value) { g.fxsend("restore", JSON.stringify(value || {})); };
    g.fxstatus = function(recording, message) { g.fxRecording = !!Number(recording); if (g.feedbackrefresh) g.feedbackrefresh(); };
    function wrap(name, action) { var old=g[name]; if(typeof old !== "function") return; g[name]=function(){ var r=old.apply(this,arguments); action.apply(this,arguments); return r; }; }
    wrap("loadbang",function(){var t=new Task(function(){g.fxsend("snapshot");},g);t.schedule(100);});
    wrap("stop",function(){g.fxsend("halt","stop");});
    var oldMode=g.mode;
    g.mode=function(v){var before=g.CMPEState().mode; var r=oldMode.apply(this,arguments);if(g.CMPEState().mode!==before)g.fxsend("halt","mode");return r;};
    wrap("audiochoose",function(){g.fxsend("halt","audiochoose");});
    wrap("audiosetup",function(){g.fxsend("halt","audiosetup");});
    wrap("dspstate",function(v){if(Number(v)===0)g.fxsend("halt","dspstate0");});
    wrap("shutdown",function(){g.fxsend("shutdown");});
}(this));

// Optional native verification entry: never runs during ordinary use.
function tmprobe(path, action) {
    var data={action:action}, f;
    try {
        data.before=this.CMPEState();
        data.fxSaved=this.fxSaved;
        var bus=named("fx_bus"), bp=bus.subpatcher();
        data.bus=!!bp; data.controller=!!bp.getnamed("fx_control");
        if(action==="start") { this.monitor(-60); this.mode(1); this.play(); }
        if(action==="stop")this.stop();
        data.sources=sources;data.loadEnabled=[named("load1").getattr("ignoreclick"),named("load2").getattr("ignoreclick"),named("load3").getattr("ignoreclick")];data.trace=this.tmTrace;data.status=this.tmLastStatus;data.audioOn=audioOn;data.sampleRate=sampleRate;data.audio=this.CMPEAudioState();data.after=this.CMPEState();data.ui=this.CMPEUIFeedback();data.fxRecording=this.fxRecording;
    }catch(e){data.error=String(e);}
    f=new File(String(path),"write");f.eof=0;var raw=JSON.stringify(data,null,2);for(var offset=0;offset<raw.length;offset+=4096)f.writestring(raw.slice(offset,offset+4096));f.close();
}

function list() {
 var a=arrayfromargs(arguments);
 if(a.length && typeof a[0] === "string" && typeof this[a[0]] === "function" && a[0]!=="list") this[a[0]].apply(this,a.slice(1));
 else post("CMPE ignored untagged message: "+JSON.stringify(a)+"\n");
}

(function(g){g.tmTrace=[];["dspstate","samplerate","audioswitch","audiochoose","stop"].forEach(function(n){var old=g[n];g[n]=function(){g.tmTrace.push({t:Date.now(),n:n,a:arrayfromargs(arguments),sr:sampleRate,on:audioOn,state:state});if(g.tmTrace.length>150)g.tmTrace.shift();return old.apply(this,arguments);};});}(this));

/* dspstate~ briefly reports 0 during graph rebuilds (including poly~ changes).
 * Confirm a stop against the driver's switch before shutting down instruments. */
(function(g){
    var previous=g.dspstate, previousShutdown=g.shutdown, pendingOff=null, checking=false, last=0;
    g.dspstate=function(value){
        value=Number(value);if(value!==0&&value!==1)return;last=value;
        if(checking)return;
        if(value===1){if(pendingOff){pendingOff.cancel();pendingOff=null;}previous.call(this,1);return;}
        if(pendingOff)return;
        pendingOff=new Task(function(){
            pendingOff=null;checking=true;
            try{named('audio_ad_switch').message('bang');}finally{checking=false;}
            previous.call(g,last);
        },g);pendingOff.schedule(200);
    };
    g.shutdown=function(){if(pendingOff){pendingOff.cancel();pendingOff=null;}return previousShutdown.apply(this,arguments);};
}(this));

/* A sample choice is an explicit stop-and-replace action, including live modes. */
var chooseSampleTask=null;
function choosefile(slot){
 slot=Number(slot);if(!slotOK(slot))return;
 var info=this.CMPEState(), audio=this.CMPEAudioState();
 if(audio.changing){status("Wait for the audio-device change, then choose a sample.");return;}
 if(info.nativeBusy&&info.nativeBusy[slot]){if(!loading[slot]&&this.sampleloadreset)this.sampleloadreset(slot);else{status("That sample is still loading. Wait for it to finish.");return;}}
 if(chooseSampleTask){chooseSampleTask.cancel();chooseSampleTask=null;}
 this.stop();
 status("Choose an audio file for sample "+(slot+1)+". Cancel keeps the current sample.");
 chooseSampleTask=new Task(function(){chooseSampleTask=null;var dialog=named("sample_dialog"+(slot+1));if(dialog)dialog.message("bang");},this);
 chooseSampleTask.schedule(80);
}
(function(g){var old=g.shutdown;g.shutdown=function(){if(chooseSampleTask){chooseSampleTask.cancel();chooseSampleTask=null;}return old.apply(this,arguments);};}(this));

/* Native Advanced panel. Values are stored in SAVE SET, independent of FX. */
var advManualSeconds=4.8;
function advrefresh(){
 try{
  var panel=named("advanced_panel");if(!panel)return;var p=panel.subpatcher();
  var info=this.CMPEState(),audio=this.CMPEAudioState();
  var enabled=info.mode===0&&(state==="idle"||state==="ready")&&!info.restoring&&!audio.changing;
  for(var q=0;q<3;q++)if(info.nativeBusy[q])enabled=false;
  var autoSeconds=.1;for(var i=0;i<3;i++)if(sources[i])autoSeconds=Math.max(autoSeconds,2*sources[i].durationMs/1000);
  function set(n,v){var o=p.getnamed(n);if(o)o.message("set",v);}
  function active(n,on){var o=p.getnamed(n);if(o)o.message("ignoreclick",on?0:1);}
  set("adv_auto",apgAdvanced.lengthSeconds===0?1:0);
  set("adv_seconds",apgAdvanced.lengthSeconds||Math.min(600,autoSeconds));
  active("adv_auto",enabled);active("adv_seconds",enabled);
  for(i=0;i<3;i++){set("adv_slider"+i,apgAdvanced.levels[i]*100);set("adv_level"+i,apgAdvanced.levels[i]*100);active("adv_slider"+i,enabled);active("adv_level"+i,enabled);}
  set("adv_lock",apgAdvanced.variationLocked?1:0);active("adv_lock",enabled);active("adv_new",enabled);
  set("adv_seed","Seed "+apgAdvanced.seed);
  set("adv_status",!enabled?"Select APG and stop playback to edit. Changes apply to the next generated take.":apgAdvanced.variationLocked?"Variation locked: keep the arrangement while changing length or balance. NEW VARIATION chooses a new seed.":"Variation unlocked: each newly generated take gets a fresh arrangement. PLAY reuses an unchanged take.");
 }catch(e){/* Panel may not exist yet during patch construction. */}
}
function apgadv(key,value){
 var info=this.CMPEState(),audio=this.CMPEAudioState();
 if(info.mode!==0||(state!=="idle"&&state!=="ready")||info.restoring||audio.changing){this.advrefresh();return;}
 for(var i=0;i<3;i++)if(info.nativeBusy[i]){this.advrefresh();return;}
 var changed=false,v=Number(value),old=apgAdvanced.seed;
 if(key==="auto"){
  if(v){if(apgAdvanced.lengthSeconds>0)advManualSeconds=apgAdvanced.lengthSeconds;changed=apgAdvanced.lengthSeconds!==0;apgAdvanced.lengthSeconds=0;}
  else{changed=apgAdvanced.lengthSeconds!==advManualSeconds;apgAdvanced.lengthSeconds=advManualSeconds;}
 }else if(key==="length"&&isFinite(v)){v=Math.max(.1,Math.min(600,v));changed=v!==apgAdvanced.lengthSeconds;apgAdvanced.lengthSeconds=v;advManualSeconds=v;}
 else if(/^level[012]$/.test(key)&&isFinite(v)){i=Number(key.charAt(5));v=Math.max(0,Math.min(200,v))/100;changed=v!==apgAdvanced.levels[i];apgAdvanced.levels[i]=v;}
 else if(key==="lock"){apgAdvanced.variationLocked=!!v;}
 else if(key==="new"){apgAdvanced.seed=APGAdvancedModel.freshSeed();if(apgAdvanced.seed===old)apgAdvanced.seed=1+old%2147483646;apgSeedPrepared=true;changed=true;}
 if(changed)this.markDirty();this.advrefresh();
}
(function(g){
 var names=["loadbang","ui","lockUI","mode","markDirty","stop"],i;
 for(i=0;i<names.length;i++)(function(n,old){if(typeof old!=="function")return;g[n]=function(){var r=old.apply(this,arguments);if(apgAdvanced.lengthSeconds>0)advManualSeconds=apgAdvanced.lengthSeconds;g.advrefresh();return r;};}(names[i],g[names[i]]));
}(this));

/* Source editor, working buffers and dry preview. Original buffer/files remain intact. */
var fullSources=[null,null,null],regionDrafts=[[0,0],[0,0],[0,0]],regionJobs=[null,null,null],previewTask=null,previewSlot=-1,regionUpdating=false;
function regionPanel(slot){var o=named("source_editor"+slot);return o?o.subpatcher():null;}
function regionUI(slot){
 var s=fullSources[slot],p=regionPanel(slot);if(!s||!p)return;
 regionUpdating=true;try{
 p.getnamed("editor_wave").message("set",s.name,1);
 p.getnamed("editor_link").message("list",0,s.durationMs,regionDrafts[slot][0],regionDrafts[slot][1]);
 p.getnamed("editor_start").message("set",regionDrafts[slot][0]/1000);p.getnamed("editor_end").message("set",regionDrafts[slot][1]/1000);
 p.getnamed("editor_status").message("set",regionJobs[slot]?"Applying region…":((sourceRegions[slot][1]-sourceRegions[slot][0])*s.durationMs/1000).toFixed(3)+" s used by generators · drag and APPLY to change");
 ui("file"+(slot+1),shortName(paths[slot])+"\nUsing "+((sourceRegions[slot][1]-sourceRegions[slot][0])*s.durationMs/1000).toFixed(2)+" s of "+(s.durationMs/1000).toFixed(2)+" s"+matchLabel(slot));
 }catch(editorError){post("CMPE editor display unavailable: "+editorError+"\n");}finally{regionUpdating=false;}
}
function regionloaded(slot){
 if(regionJobs[slot]){regionJobs[slot].cancel();regionJobs[slot]=null;}
 fullSources[slot]={name:sources[slot].name,frames:sources[slot].frames,durationMs:sources[slot].durationMs,channels:sources[slot].channels};
 var s=fullSources[slot];regionDrafts[slot]=[sourceRegions[slot][0]*s.durationMs,sourceRegions[slot][1]*s.durationMs];regionUI(slot);
 if(sourceRegions[slot][0]!==0||sourceRegions[slot][1]!==1)applySourceRegion(slot);
}
function applySourceRegion(slot){
 var s=fullSources[slot];if(!s||regionJobs[slot])return;
 var ab=SourceRegionModel.frames(regionDrafts[slot][0]*s.frames/s.durationMs,regionDrafts[slot][1]*s.frames/s.durationMs,s.frames),count=ab[1]-ab[0];
 var newRegion=[ab[0]/s.frames,ab[1]/s.frames];
 if(ab[0]===0&&ab[1]===s.frames){sources[slot]={name:s.name,frames:s.frames,durationMs:s.durationMs,channels:s.channels};sourceBuffers[slot]=new Buffer(s.name);sourceRegions[slot]=newRegion;this.markDirty();regionUI(slot);return;}
 var name=prefix+"_clip"+slot,b=named("clip_buffer"+slot);b.message("name",name);b.message("sr",s.frames*1000/s.durationMs);b.message("sizeinsamps",count,s.channels);
 var original=new Buffer(s.name),clip=new Buffer(name),pos=0,g=this;
 if(clip.framecount()!==count||clip.channelcount()!==s.channels){status("Region buffer could not be allocated; original selection retained.");return;}
 regionJobs[slot]=new Task(function(){
  try{var start=Date.now();do{var n=Math.min(8192,count-pos);for(var ch=1;ch<=s.channels;ch++)clip.poke(ch,pos,original.peek(ch,ab[0]+pos,n));pos+=n;}while(pos<count&&Date.now()-start<8);
   if(pos<count){regionJobs[slot].schedule(1);return;}
   regionJobs[slot]=null;sourceRegions[slot]=newRegion;sources[slot]={name:name,frames:count,durationMs:count*s.durationMs/s.frames,channels:s.channels};sourceBuffers[slot]=clip;g.markDirty();regionUI(slot);status("Sample "+(slot+1)+" region applied. Generate a new take to use it.");
  }catch(e){regionJobs[slot]=null;status("Region not applied: "+e.message);}
 },this);regionJobs[slot].schedule(1);regionUI(slot);
}
var previewLoop=[false,false,false];
function previewStatus(slot){var p=regionPanel(slot);if(p)p.getnamed("editor_status").message("set",previewLoop[slot]?"LOOPING selected region \u00b7 drag or type START / END to adjust \u00b7 STOP to end":"PREVIEWING selected region once \u00b7 dry monitoring only");}
function stoppreview(){if(previewTask){previewTask.cancel();previewTask=null;}var was=previewSlot;previewSlot=-1;var o=named("source_preview");if(o)o.message("stop");if(was>=0)regionUI(was);}
function sourceedit(slot,action,key,value){
 slot=Number(slot);if(!slotOK(slot))return;var s=fullSources[slot];
 if(action==="previewstop"){stoppreview();return;}
 if(action==="open"){if(!s){status("Load sample "+(slot+1)+" first.");return;}regionUI(slot);this.inlinepanel("source"+slot);return;}
 if(!s||!mutable()||savePending||regionJobs[slot]){status("Stop playback and wait for loading before editing a source region.");return;}
 if(action==="draft"||action==="draftms"){
  if(regionUpdating)return;
  var v=Number(value);if(!isFinite(v))return;v=clamp(v*(action==="draft"?1000:1),0,s.durationMs);regionDrafts[slot][key==="start"?0:1]=v;
  if(action==="draft")regionUI(slot);else{var panel=regionPanel(slot);panel.getnamed("editor_start").message("set",regionDrafts[slot][0]/1000);panel.getnamed("editor_end").message("set",regionDrafts[slot][1]/1000);}return;
 }
 if(action==="regionfull"){regionDrafts[slot]=[0,s.durationMs];regionUI(slot);return;}
 if(action==="regionapply"){
  stoppreview();if(regionDrafts[slot][1]<=regionDrafts[slot][0]){status("Region end must be after its start.");return;}applySourceRegion(slot);return;
 }
 if(action==="loop"){previewLoop[slot]=Number(key)!==0;if(previewSlot===slot)previewStatus(slot);else if(!previewLoop[slot])regionUI(slot);return;}
 if(action==="preview"){
  stoppreview();var a=Math.min(regionDrafts[slot][0],regionDrafts[slot][1]),end=Math.max(regionDrafts[slot][0],regionDrafts[slot][1]);if(end-a<1){status("Choose a source region first.");return;}
  named("audio_driver").message("startwindow");var tries=0;
  previewTask=new Task(function(){if(!audioOn||sampleRate<=0){if(++tries<100){previewTask.schedule(50);return;}previewTask=null;status("Preview audio did not start. Check AUDIO SETUP.");return;}
   previewTask=null;previewSlot=slot;named("preview_mono").message("float",s.channels===1?1:0);var player=named("source_preview");player.message("set",s.name);player.message("start",a,end,end-a);previewStatus(slot);
  },this);previewTask.schedule(350);
 }
}
function previewended(){
 var slot=previewSlot;if(slot<0)return;
 var s=fullSources[slot];
 if(previewLoop[slot]&&s&&audioOn){
  // Loop: restart with the current draft so region edits apply on the next pass.
  var a=Math.min(regionDrafts[slot][0],regionDrafts[slot][1]),end=Math.max(regionDrafts[slot][0],regionDrafts[slot][1]);
  if(end-a>=1){named("source_preview").message("start",a,end,end-a);return;}
 }
 previewSlot=-1;regionUI(slot);
}
function viewzoom(v){v=Number(v);if(!isFinite(v))return;v=clamp(v,1,512);this.feedbackwavezoom(v);ui("wave_magnify",v);}
function outputrange(key,value){if(!outputReady||!plan)return;var v=Number(value)*1000;if(!isFinite(v))return;var a=key==="start"?clamp(v,0,outputDurationMs):selectedStart,b=key==="end"?clamp(v,0,outputDurationMs):selectedEnd;if(b-a<2*1000/plan.sampleRate){status("Range end must be after its start.");this.selectionLabel();return;}pendingSelection=[a,b];this.commitSelection();}
(function(g){
 var previousLoaded=g.loaded;g.loaded=function(slot){var r=previousLoaded.apply(this,arguments);if(fullSources[slot])regionUI(slot);return r;};
 var previousLoad=g.loadfile;g.loadfile=function(slot){g.stoppreview();var incoming=arrayfromargs(arguments).slice(1).join(" ");if(!mutable()||!slotOK(Number(slot))||!incoming)return previousLoad.apply(this,arguments);if(regionJobs[slot]){regionJobs[slot].cancel();regionJobs[slot]=null;}fullSources[slot]=null;if(!sourceRestorePending[slot])sourceRegions[slot]=[0,1];sourceRestorePending[slot]=false;return previousLoad.apply(this,arguments);};
 var names=["play","newpiece","mode"],i;for(i=0;i<names.length;i++)(function(n,old){g[n]=function(){for(var k=0;k<3;k++)if(regionJobs[k]){status("Wait for the sample region to finish applying.");return;}g.stoppreview();return old.apply(this,arguments);};}(names[i],g[names[i]]));
 var oldStop=g.stop;g.stop=function(){g.stoppreview();return oldStop.apply(this,arguments);};
 var oldLabel=g.selectionLabel;g.selectionLabel=function(){var r=oldLabel.apply(this,arguments);ui("range_start",selectedStart/1000);ui("range_end",selectedEnd/1000);return r;};
 var oldComplete=g.renderComplete;g.renderComplete=function(){var r=oldComplete.apply(this,arguments);var info=g.CMPEUIFeedback();if(info)ui("wave_magnify",info.waveZoom);return r;};
 var oldShut=g.shutdown;g.shutdown=function(){g.stoppreview();for(var j=0;j<3;j++)if(regionJobs[j]){regionJobs[j].cancel();regionJobs[j]=null;}return oldShut.apply(this,arguments);};
}(this));
// Optional developer readout; never runs on normal startup.
function regionprobe(path){var d={regions:sourceRegions,drafts:regionDrafts,fullSources:fullSources,sources:sources,jobs:regionJobs.map(function(x){return !!x;}),monitorDb:monitorDb,loop:loopEnabled,range:[selectedStart,selectedEnd],previewSlot:previewSlot,state:state,waveZoom:this.CMPEUIFeedback()?this.CMPEUIFeedback().waveZoom:null};var f=new File(String(path),"write");f.eof=0;var s=JSON.stringify(d,null,2);for(var i=0;i<s.length;i+=4096)f.writestring(s.slice(i,i+4096));f.close();}

/* Collapsible presentation sections; no panel creates a separate window. */
var inlineSections={advanced:false,fx:false,source:-1};
var inlineBase={"title":[20,10,252,36],"demo_button":[620,12,90,32],"test_audio":[718,12,126,32],"credit_rule":[20,834,1060,1],"source_label1":[32,208,112,22],"load1":[260,206,92,30],"file1":[32,240,320,36],"repeat_label1":[32,280,152,20],"repeat1":[32,302,152,28],"source_label2":[390,208,112,22],"load2":[618,206,92,30],"file2":[390,240,320,36],"repeat_label2":[390,280,152,20],"repeat2":[390,302,152,28],"source_label3":[748,208,112,22],"load3":[976,206,92,30],"file3":[748,240,320,36],"repeat_label3":[748,280,152,20],"repeat3":[748,302,152,28],"pitch_label":[200,280,152,20],"pitch":[200,302,152,28],"monitor_label":[716,393,106,24],"monitor_level":[824,390,76,28],"meter_L":[916,391,152,12],"meter_R":[916,406,152,12],"output_label":[32,392,172,24],"duration":[206,393,134,24],"time":[856,638,212,22],"channel_l":[32,464,20,24],"wave_l":[56,428,1012,96],"channel_r":[32,570,20,24],"wave_r":[56,534,1012,96],"selection_info":[32,638,580,22],"loop_toggle":[632,638,22,22],"loop_label":[664,636,180,28],"clear_button":[608,708,130,44],"save_button":[750,708,144,44],"play_button":[20,708,270,44],"stop_button":[302,708,132,44],"new_button":[446,708,150,44],"progress":[32,814,228,10],"render_info":[276,762,792,22],"status":[276,788,792,38],"original_credit":[24,840,680,20],"original_link":[812,838,268,22],"save_preset":[852,12,110,32],"load_preset":[970,12,110,32],"audio_status":[736,54,332,20],"audio_setup":[736,78,124,28],"audio_refresh":[868,78,92,28],"audio_power":[968,78,100,28],"audio_panel":[20,52,1060,64],"audio_driver_label":[32,54,182,20],"audio_driver_menu":[32,78,182,28],"audio_option1_label":[226,54,242,20],"audio_option1_menu":[226,78,242,28],"audio_option2_label":[480,54,242,20],"audio_option2_menu":[480,78,242,28],"mode0":[20,124,200,36],"mode1":[235,124,200,36],"mode2":[450,124,200,36],"mode3":[665,124,200,36],"mode4":[880,124,200,36],"mode_info":[24,168,398,22],"param_label0":[32,280,152,20],"param0":[32,302,152,28],"param_label1":[390,280,152,20],"param1":[390,302,152,28],"param_label2":[748,280,152,20],"param2":[748,302,152,28],"param_label3":[200,280,152,20],"param3":[200,302,152,28],"param_label4":[558,280,152,20],"param4":[558,302,152,28],"param_label5":[916,280,152,20],"param5":[916,302,152,28],"menu_label":[916,280,152,20],"mode_menu":[916,302,152,28],"scope_l":[56,428,1012,96],"scope_r":[56,534,1012,96],"xy_pad":[56,428,684,202],"scope_xy":[756,428,312,202],"record_button":[906,708,174,44],"source_card1":[20,198,344,176],"source_accent1":[21,199,342,4],"source_state1":[150,210,100,20],"group_label1":[32,208,320,22],"group_help1":[32,240,320,36],"source_card2":[378,198,344,176],"source_accent2":[379,199,342,4],"source_state2":[508,210,100,20],"group_label2":[390,208,320,22],"group_help2":[390,240,320,36],"source_card3":[736,198,344,176],"source_accent3":[737,199,342,4],"source_state3":[866,210,100,20],"group_label3":[748,208,320,22],"group_help3":[748,240,320,36],"output_panel":[20,382,1060,318],"feedback_panel":[20,758,1060,72],"state_badge":[32,772,228,28],"wave_scale":[342,396,176,20],"fxopen":[398,12,208,32],"advanced_button":[278,12,112,32],"wave_magnify":[522,392,62,25],"wave_mag_label":[590,394,64,21],"range_start_label":[34,665,80,24],"range_start":[116,663,112,26],"range_end_label":[252,665,80,24],"range_end":[330,663,112,26],"range_help":[472,665,590,26],"source_edit_button0":[32,338,320,28],"source_edit_button1":[390,338,320,28],"source_edit_button2":[748,338,320,28],"drop1":[20,198,344,176],"drop2":[378,198,344,176],"drop3":[736,198,344,176],"preset_label":[560,167,62,22],"preset_menu":[624,164,220,28],"gain_label":[860,167,84,22],"gain_field":[946,164,76,28],"match_levels":[426,164,130,28],"layer_source_label":[200,280,152,20],"layer_source_menu":[200,302,152,28]};
function inlineLayout(){
 var advH=(this.CMPEState&&this.CMPEState().mode===3)?390:340;
 var top=(inlineSections.advanced?advH:0)+(inlineSections.fx?742:0), source=inlineSections.source>=0?410:0;
 var driver=named("inline_layout_driver");
 function rect(n,r){driver.message("script","sendbox",n,"presentation_rect",r[0],r[1],r[2],r[3]);}
 function visible(n,v){driver.message("script","sendbox",n,"hidden",v?0:1);}
 for(var n in inlineBase)if(inlineBase.hasOwnProperty(n)){var r=inlineBase[n].slice(0);if(r[1]>=124)r[1]+=top;if(inlineBase[n][1]>=382)r[1]+=source;rect(n,r);}
 var apgMode=!this.CMPEState||this.CMPEState().mode===0;
 var y=124;rect("advanced_panel",[20,y,1060,340]);visible("advanced_panel",inlineSections.advanced&&apgMode);rect("mode_advanced_panel",[20,y,1060,advH]);visible("mode_advanced_panel",inlineSections.advanced&&!apgMode);if(inlineSections.advanced)y+=advH;
 rect("fx_bus",[20,y,1060,742]);visible("fx_bus",inlineSections.fx);
 for(var i=0;i<3;i++){rect("source_editor"+i,[20,382+top,1060,410]);visible("source_editor"+i,inlineSections.source===i);named("source_edit_button"+i).message("text",inlineSections.source===i?"▼ CLOSE SAMPLE REGION":"▶ EDIT / PREVIEW");}
 named("advanced_button").message("text",inlineSections.advanced?"▼ ADVANCED":"▶ ADVANCED");named("fxopen").message("text",inlineSections.fx?"▼ TAPE + MEMORY":"▶ TAPE + MEMORY");
 disclosure("advanced_button",inlineSections.advanced);disclosure("fxopen",inlineSections.fx);for(var di=0;di<3;di++)disclosure("source_edit_button"+di,inlineSections.source===di);
}
function disclosure(name,open){var o=named(name);if(!o)return;var bg=open?[232/255,239/255,252/255,1]:[224/255,229/255,235/255,1],fg=open?[23/255,79/255,203/255,1]:[23/255,32/255,43/255,1];
 o.message("bgcolor",bg[0],bg[1],bg[2],1);o.message("bgoncolor",205/255,212/255,221/255,1);o.message("textcolor",fg[0],fg[1],fg[2],1);o.message("textoncolor",fg[0],fg[1],fg[2],1);o.message("textovercolor",23/255,79/255,203/255,1);}
function inlinepanel(which){
 if(which==="advanced")inlineSections.advanced=!inlineSections.advanced;
 else if(which==="fx")inlineSections.fx=!inlineSections.fx;
 else if(/^source[012]$/.test(which)){var i=Number(which.charAt(6));inlineSections.source=inlineSections.source===i?-1:i;}
 inlineLayout();
}
(function(g){var old=g.loadbang;g.loadbang=function(){var r=old.apply(this,arguments);g.inlineLayout();return r;};var mode=g.mode;g.mode=function(){var r=mode.apply(this,arguments);g.inlineLayout();return r;};}(this));
function inlineprobe(path){var d={sections:inlineSections,sources:sources,paths:paths,state:state,loaded:[!!fullSources[0],!!fullSources[1],!!fullSources[2]]};var f=new File(String(path),"write");f.eof=0;f.writestring(JSON.stringify(d));f.close();}

/* Buffer metadata polling backs up the native completion bang. */
function failSourceLoad(slot,message){
 cancelTask(loadTasks[slot]);loadTasks[slot]=null;loading[slot]=false;sources[slot]=null;sourceBuffers[slot]=null;
 if(this.sampleloadreset)this.sampleloadreset(slot);
 ui("file"+(slot+1),"Import failed \u00b7 drop another file or click LOAD");status(String(message)+" Choose another audio file with LOAD.");
}
function watchSourceLoad(slot){
 cancelTask(loadTasks[slot]);var started=Date.now(),lastFrames=0,stable=0,g=this;
 loadTasks[slot]=new Task(function(){
  if(!loading[slot]){cancelTask(loadTasks[slot]);loadTasks[slot]=null;return;}
  try{var b=new Buffer(prefix+"_source"+slot),frames=b.framecount(),channels=b.channelcount(),duration=b.length();
   if(frames>=2&&duration>0){
    if(channels!==1&&channels!==2){g.failSourceLoad(slot,"Use a mono or stereo audio file.");return;}
    stable=frames===lastFrames?stable+1:0;lastFrames=frames;
    if(stable>=1){g.loaded(slot);return;}
   }
   if(Date.now()-started>=20000){g.failSourceLoad(slot,"Max could not read that file as audio.");return;}
   loadTasks[slot].schedule(100);
  }catch(e){g.failSourceLoad(slot,"Import failed: "+e.message);}
 },this);loadTasks[slot].schedule(100);
}

/* Loader 3: a sample request is never dropped silently.
 * LOAD during playback opens the picker while the controller is still
 * stopping; the old loadfile ignored any request outside idle/ready. Requests
 * now stop playback, wait until the controller is editable, then load. */
var AUDIO_FILE=/\.(wav|wave|bwf|aif|aiff|aifc|au|snd|mp3|m4a|mp4|aac|flac|caf|ogg|oga|opus)$/i;
var queuedLoads=[null,null,null],queuedLoadTask=null,queuedLoadTries=0;
function sampleLabel(slot){return sources[slot]&&paths[slot]?shortName(paths[slot])+"\n"+(sources[slot].durationMs/1000).toFixed(2)+" s":"No sample \u00b7 drop audio here or click LOAD";}
(function(g){
 var inner=g.loadfile;
 function flush(){
  queuedLoadTask=null;
  var audio=g.CMPEAudioState?g.CMPEAudioState():{},pending=false,k;
  for(k=0;k<3;k++)if(queuedLoads[k])pending=true;
  if(!pending)return;
  if(!mutable()||audio.changing){
   if(++queuedLoadTries>100){
    for(k=0;k<3;k++)if(queuedLoads[k]){queuedLoads[k]=null;ui("file"+(k+1),sampleLabel(k));}
    status("Playback did not stop, so the new sample was not loaded. Press STOP, then LOAD again.");return;
   }
   if(state==="playing"||state==="live")g.stop();
   queuedLoadTask=new Task(flush,g);queuedLoadTask.schedule(50);return;
  }
  for(k=0;k<3;k++)if(queuedLoads[k]){var p=queuedLoads[k];queuedLoads[k]=null;inner.call(g,k,p);}
 }
 g.loadfile=function(slot){
  var a=arrayfromargs(arguments);slot=Number(a[0]);var path=a.slice(1).join(" ");
  if(!slotOK(slot)||!path)return;
  if(!AUDIO_FILE.test(path)){ui("file"+(slot+1),"Not an audio file: "+shortName(path)+(sources[slot]?"\nStill using "+shortName(paths[slot]):"\nDrop a WAV, AIFF or MP3 here"));status("\u201c"+fileName(path)+"\u201d is not an audio file. Use WAV, AIFF, MP3, M4A, FLAC or CAF.");return;}
  var audio=g.CMPEAudioState?g.CMPEAudioState():{};
  if(mutable()&&!audio.changing&&!queuedLoadTask)return inner.apply(this,[slot,path]);
  queuedLoads[slot]=path;queuedLoadTries=0;
  ui("file"+(slot+1),"Queued: "+shortName(path));
  status("Stopping playback, then loading sample "+(slot+1)+"\u2026");
  if(state==="playing"||state==="live")g.stop();
  if(!queuedLoadTask){queuedLoadTask=new Task(flush,g);queuedLoadTask.schedule(20);}
 };
 var oldShut=g.shutdown;g.shutdown=function(){if(queuedLoadTask){queuedLoadTask.cancel();queuedLoadTask=null;}return oldShut.apply(this,arguments);};
}(this));
/* Drag an audio file from Finder onto a sample card. */
function dropsample(slot){
 var a=arrayfromargs(arguments);slot=Number(a[0]);var path=a.slice(1).join(" ");
 if(!slotOK(slot)||!path)return;
 if(!AUDIO_FILE.test(path)){status("\u201c"+fileName(path)+"\u201d is not an audio file Max can load. Use WAV, AIFF, MP3, M4A, FLAC or CAF.");return;}
 var info=this.CMPEState?this.CMPEState():{},need=sourceCountFor(info.mode);
 if(slot>=need){status(need===0?"RMHS uses no samples. Switch to APG, ISJS, Many or SIOE to load audio.":"This instrument uses Sample 1 only. Drop the file on Sample 1, or choose more Layer sources in Many.");return;}
 this.loadfile(slot,path);
}

/* snapshot~ sends phase ~30x/s whenever audio is on, even when stopped. Each
 * wrapped call restyled the whole UI, flooding Max's low-priority queue so
 * buffer~ completion and the load watchdog waited seconds behind it. */
(function(g){
 var full=g.phase,lastFull=0;
 g.phase=function(value){
  if(state!=="playing")return;
  var now=Date.now();
  if(now-lastFull>=250){lastFull=now;return full.apply(this,arguments);}
  return basePhase.call(this,value);
 };
}(this));
/* When Max reloads an open patch after its files change on disk, neither
 * loadbang path fires and the UI stays at "Waiting for controller startup".
 * Start once the rebuilt patch has settled. */
var bootFallback=typeof Task==="undefined"?null:new Task(function(){
 bootFallback=null;
 if(initialized)return;
 post("CMPE: starting controller after patch reload.\n");
 try{loadbang();}catch(e){post("CMPE startup error: "+e+"\n");}
},this);
if(bootFallback)bootFallback.schedule(1500);
(function(g){var old=g.shutdown;g.shutdown=function(){if(bootFallback){bootFallback.cancel();bootFallback=null;}return old.apply(this,arguments);};}(this));
/* During patch teardown Max may delete the voice abstractions before this
 * object; cleanup must not raise errors about objects that are already gone. */
(function(g){var old=g.notifydeleted;g.notifydeleted=function(){try{return old.apply(this,arguments);}catch(e){}};}(this));

/* ADVANCED panel for ISJS, Many, RMHS and SIOE. */
var MODE_TITLES={isjs:"ISJS",many:"MANY",rmhs:"RMHS",sioe:"SIOE"};
var MODE_NOTES={isjs:"Ranges pick a new random value for every grain. Changes apply to the next grains; stereo width applies at the next START.",
 many:"Ranges pick a new random value for every layer. Changes apply to the next layer.",
 rmhs:"Ranges pick a new random value for every partial. Changes apply at the next START.",
 sioe:"Ranges pick a new random value for every slice. Changes apply to the next generated take."};
function modeAdvKey(){var info=this.CMPEState?this.CMPEState():{mode:0};return MODE_KEYS[info.mode]||"apg";}
function modeAdvEditable(key){var info=this.CMPEState?this.CMPEState():{},audio=this.CMPEAudioState?this.CMPEAudioState():{};
 if(info.restoring||audio.changing||savePending)return false;
 if(key==="sioe")return state==="idle"||state==="ready";
 return true;}
function decimals(step){return step>=1?0:(step>=0.1?1:(step>=0.01?2:3));}
function modeadvrefresh(){
 try{
  var panel=named("mode_advanced_panel");if(!panel)return;var p=panel.subpatcher();
  var key=modeAdvKey();if(key==="apg")return;
  var specs=ModeAdvancedModel.SPECS[key],adv=modeAdvanced[key],en=modeAdvEditable(key),i;
  function o(n){return p.getnamed(n);}
  function set(n,v){var x=o(n);if(x)x.message("set",v);}
  function hide(n,h){var x=o(n);if(x)x.hidden=h?1:0;}
  function active(n,on){var x=o(n);if(x)x.message("ignoreclick",on?0:1);}
  set("madv_title",MODE_TITLES[key]+" / ADVANCED");set("madv_note",MODE_NOTES[key]);
  for(i=0;i<4;i++){
   var sp=specs[i],show=!!sp;
   ["madv_label","madv_min","madv_to","madv_max","madv_unit","madv_help"].forEach(function(n){hide(n+i,!show);});
   if(!show)continue;
   var v=adv.values[sp.key],dp=decimals(sp.step);
   ["madv_min","madv_max"].forEach(function(n){var x=o(n+i);if(x){x.message("minimum",sp.lo);x.message("maximum",sp.hi);x.message("numdecimalplaces",dp);}});
   set("madv_label"+i,sp.label);set("madv_unit"+i,sp.unit);set("madv_help"+i,sp.help);
   hide("madv_to"+i,!sp.range);hide("madv_max"+i,!sp.range);
   set("madv_min"+i,sp.range?v[0]:v);if(sp.range)set("madv_max"+i,v[1]);
   active("madv_min"+i,en);active("madv_max"+i,en);
  }
  var rm=key==="rmhs",H=adv.harmony;
  ["madv_hlabel0","madv_hlabel1","madv_hlabel2","madv_hlabel3","madv_tuning","madv_series","madv_snap","madv_tilt","madv_tilthelp"].forEach(function(n){hide(n,!rm);});
  if(rm){set("madv_tuning",H.tuning);set("madv_series",H.series);set("madv_snap",H.snap);set("madv_tilt",H.tilt);["madv_tuning","madv_series","madv_snap","madv_tilt"].forEach(function(n){active(n,en);});}
  var bg=o("madv_bg"),st=o("madv_status");if(bg)bg.message("presentation_rect",16,16,1004,rm?336:276);if(st)st.message("presentation_rect",28,rm?356:296,940,30);
  set("madv_lock",adv.locked?1:0);set("madv_seed","Seed "+adv.seed);active("madv_lock",en);active("madv_new",en);
  set("madv_status",!en?(key==="sioe"?"Stop playback to edit. Changes apply to the next generated take.":"Wait for the current operation to finish."):
   adv.locked?"Variation locked: the same random choices repeat at every START or take. NEW VARIATION picks a new seed.":
   "Variation unlocked: each START or take gets fresh random choices. Lock to keep one you like.");
 }catch(e){/* panel may not exist during construction */}
}
function modeadv(row,which,value){
 var key=modeAdvKey();if(key==="apg"||!modeAdvEditable(key)){modeadvrefresh();return;}
 var adv=modeAdvanced[key],changed=false;
 if(row==="harmony"&&key==="rmhs"){var H=adv.harmony,v=Number(value);if(!isFinite(v)){modeadvrefresh();return;}
  if(which==="tuning")H.tuning=v?1:0;else if(which==="series")H.series=Math.max(0,Math.min(2,Math.round(v)));else if(which==="snap")H.snap=v?1:0;else if(which==="tilt")H.tilt=Math.max(0.3,Math.min(3,v));
  H.preset=0;if(this.showRMHSMenu)this.showRMHSMenu();if(this.feedbackrefresh)this.feedbackrefresh();modeadvrefresh();return;}
 if(row==="lock"){adv.locked=Number(which)!==0;}
 else if(row==="new"){var old=adv.seed;adv.seed=APGAdvancedModel.freshSeed();if(adv.seed===old)adv.seed=1+old%2147483646;modeVarPrepared[key]=true;changed=true;}
 else{var sp=ModeAdvancedModel.SPECS[key][Number(row)];if(!sp){modeadvrefresh();return;}
  changed=ModeAdvancedModel.setValue(modeAdvanced,key,sp.key,sp.range?which:"value",Number(value));
  if(changed){if(key==="isjs"||key==="many")adv.preset=0;else if(key==="rmhs")adv.harmony.preset=0;if(this.presetMenuRefresh)this.presetMenuRefresh();if(this.feedbackrefresh)this.feedbackrefresh();}}
 if(changed&&key==="sioe")this.markDirty();
 modeadvrefresh();
}
(function(g){
 var names=["loadbang","lockUI","mode","stop","markDirty"],i;
 for(i=0;i<names.length;i++)(function(n,old){if(typeof old!=="function")return;g[n]=function(){var r=old.apply(this,arguments);g.modeadvrefresh();return r;};}(names[i],g[names[i]]));
}(this));

/* Keep RMHS theory guidance current after parameter and preset edits. */
(function(g){["param","choice"].forEach(function(n){var old=g[n];if(typeof old!=="function")return;g[n]=function(){var r=old.apply(this,arguments);if(g.feedbackrefresh)g.feedbackrefresh();g.modeadvrefresh();return r;};});}(this));

/* Apply each instrument's gain on start-up and whenever the instrument changes. */
(function(g){["loadbang","mode"].forEach(function(n){var old=g[n];if(typeof old!=="function")return;g[n]=function(){var r=old.apply(this,arguments);g.applyInstrumentGain();return r;};});
 var pr=g.presetread;if(typeof pr==="function")g.presetread=function(){var r=pr.apply(this,arguments);g.applyInstrumentGain();return r;};
 g.presetMenuRefresh=function(){var m=g.CMPEState().mode,sel=m===3?modeAdvanced.rmhs.harmony.preset:(m===1||m===2?modeAdvanced[MODE_KEYS[m]].preset:0);var o=g.named("preset_menu");if(o)o.message("set",sel);};
}(this));

/* Match levels: bring each loaded sample's peak to a common level (-8 dBFS,
 * the loudest demo sample; the default instrument gains assume it). Only the loaded buffer
 * changes; files on disk are untouched. Boost is capped at +30 dB so near-silent
 * files do not turn into amplified noise. */
var matchLevels=true,MATCH_TARGET=Math.pow(10,-8/20),MATCH_MAX_BOOST=Math.pow(10,30/20),sourceMatchDb=[null,null,null];
function matchLabel(slot){var d=sourceMatchDb[slot];if(!matchLevels||d===null)return "";return " \u00b7 "+(Math.abs(d)<0.05?"0.0 dB":(d>0?"+":"\u2212")+Math.abs(d).toFixed(1)+" dB");}
function bufferPeak(b,frames,channels){var peak=0,ch,pos,n,chunk,i,v;for(ch=1;ch<=channels;ch++){for(pos=0;pos<frames;pos+=65536){n=Math.min(65536,frames-pos);chunk=b.peek(ch,pos,n);if(typeof chunk==="number")chunk=[chunk];for(i=0;i<chunk.length;i++){v=chunk[i]<0?-chunk[i]:chunk[i];if(v>peak)peak=v;}}}return peak;}
function matchSource(slot){
 sourceMatchDb[slot]=null;
 if(!matchLevels||!sources[slot])return;
 var name=prefix+"_source"+slot,b=new Buffer(name);
 if(typeof b.peek!=="function")return;
 var peak=bufferPeak(b,sources[slot].frames,sources[slot].channels);
 if(!(peak>0.00001))return;
 var target=Math.min(MATCH_TARGET,peak*MATCH_MAX_BOOST),gain=target/peak;
 if(Math.abs(gain-1)<0.0001){sourceMatchDb[slot]=0;return;}
 var o=named("source"+(slot+1));if(o)o.message("normalize",target);
 sourceMatchDb[slot]=20*Math.log(gain)/Math.LN10;
}
(function(g){var old=g.regionloaded;g.regionloaded=function(slot){try{matchSource(slot);}catch(e){sourceMatchDb[slot]=null;post("CMPE level match skipped: "+e+"\n");}return old.apply(this,arguments);};}(this));
/* Turning the option off (or on) reloads loaded samples, keeping their regions. */
function matchlevels(v){
 var on=Number(v)!==0;if(on===matchLevels){matchLevelsUI();return;}
 matchLevels=on;matchLevelsUI();
 var any=false;for(var k=0;k<3;k++)if(sources[k]&&paths[k]){sourceRestorePending[k]=true;this.loadfile(k,paths[k]);any=true;}
 status(on?"Match levels on: samples are brought to a common peak level (files on disk are unchanged).":"Match levels off: samples play at their original recorded level."+(any?" Reloading samples...":""));
}
function matchLevelsUI(){var o=named("match_levels");if(o)o.message("set",matchLevels?1:0);}
(function(g){var lb=g.loadbang;g.loadbang=function(){var r=lb.apply(this,arguments);matchLevelsUI();return r;};}(this));
