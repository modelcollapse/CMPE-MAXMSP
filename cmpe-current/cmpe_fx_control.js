/* Control adapter for the borrowed Tape and Drifting Memory DSP. No global buses. */
autowatch=0; inlets=1; outlets=5;
var host=this, initialized=false, recording=false, armed=false, opening=false, active=false, recordMs=0, lastAdvance=0;
var haltReason="",lastL=0,lastR=0,clearTask=null, recordTask=null;
var defaults={tapeOn:0,tapeMix:1,wow:.3,flutter:.2,age:.3,hiss:0,drop:0,sat:.3,tone:.6,speed:.5,memoryOn:0,memoryMix:.35,feedback:.72,blur:.32,drift:.45,drive:0,width:1,pitch:0,hold:0,reverse:0,half_speed:0,mode:0,size:0,record:3,tempo:120,beats_per_bar:4};
var state={}, tapeKeys=['wow','flutter','age','hiss','drop','sat','tone','speed'];
var limits={tapeOn:[0,1],tapeMix:[0,1],memoryOn:[0,1],memoryMix:[0,1],feedback:[0,.98],blur:[0,1],drift:[0,1],drive:[0,1],width:[0,2],pitch:[-12,0],hold:[0,1],reverse:[0,1],half_speed:[0,1],mode:[0,4],size:[0,2],record:[0,3],tempo:[20,400],beats_per_bar:[.5,32]};
var discrete={tapeOn:1,memoryOn:1,hold:1,reverse:1,half_speed:1,mode:1,size:1,record:1};
function obj(n){return host.patcher.getnamed(n);}
function msg(n){var o=obj(n),a=arrayfromargs(arguments).slice(1);if(typeof a[0]==='number')a.unshift(a.length>1?'list':'int');if(o)o.message.apply(o,a);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function status(text){outlet(2,'status',String(text));outlet(4,'fxstatus',recording?1:0,String(text));}
function publish(){var s=JSON.stringify(state);outlet(2,'state',s);outlet(4,'fxsettings',s);}
function memory(k,v){outlet(1,k,v);}
function apply(k){
 var i=tapeKeys.indexOf(k);
 if(i>=0)outlet(0,'k'+(i+1),state[k]);
 else if(k==='tapeOn'||k==='tapeMix')msg('tape_mix',state.tapeOn?state.tapeMix:0,35);
 else if(k==='memoryOn')memory('enabled',state.memoryOn);
 else if(k==='memoryMix')memory('mix',state.memoryMix*100);
 else if(k==='feedback'||k==='blur'||k==='drift'||k==='drive'||k==='width')memory(k,state[k]*100);
 else memory(k,state[k]);
}
function resetState(){for(var k in defaults)if(defaults.hasOwnProperty(k))state[k]=defaults[k];}
function loadbang(){if(initialized)return;initialized=true;resetState();for(var k in state)if(state.hasOwnProperty(k))apply(k);msg('fx_run',0,0);publish();status('Start a CMPE instrument, then enable Tape or Memory.');}
function set(k,v){if(!defaults.hasOwnProperty(k))return;v=Number(v);if(!isFinite(v))return;var r=limits[k]||[0,1];state[k]=clamp(v,r[0],r[1]);if(discrete[k])state[k]=Math.round(state[k]);apply(k);publish();}
function xy(x,y){set('blur',x);set('drift',y);}
function restore(raw){var incoming;try{incoming=JSON.parse(String(raw));}catch(e){status('FX settings could not be read.');return;}halt();resetState();for(var k in defaults)if(defaults.hasOwnProperty(k)&&incoming&&typeof incoming[k]==='number'&&isFinite(incoming[k])){var r=limits[k]||[0,1];state[k]=clamp(incoming[k],r[0],r[1]);if(discrete[k])state[k]=Math.round(state[k]);}state.hold=0;for(k in state)if(state.hasOwnProperty(k))apply(k);publish();status('Effects restored. Audio memory is cleared; capture starts fresh.');}
function snapshot(){publish();}
function resume(){if(clearTask){clearTask.cancel();clearTask=null;memory('clear',1);}active=true;apply('record');msg('fx_run',1,35);if(armed)beginRecording();status(recording?'Recording processed stereo WAV.':'Tape -> Drifting Memory -> processed output');}
function stoprec(){if(recordTask){recordTask.cancel();recordTask=null;}if(recording||armed)msg('fx_recorder',0);var was=recording;recording=false;armed=false;opening=false;outlet(2,'recording',0,0,recordMs);if(was)status('Processed recording stopped. Performance continues.');else status('Recorder ready.');}
function halt(reason){
 haltReason=String(reason||"direct");
 active=false;stoprec();msg('fx_run',0,25);state.hold=0;apply('hold');memory('record',0);
 if(clearTask)clearTask.cancel();
 clearTask=new Task(function(){memory('panic',1);clearTask=null;},host);clearTask.schedule(40);publish();status('Stopped. Memory cleared; settings kept.');
}
function panic(){halt();}
function clear(){memory('clear',1);state.hold=0;apply('hold');publish();status('Memory cleared. Tape and the instrument keep running.');}
function recordtoggle(){if(recording||armed){stoprec();return;}if(opening)return;opening=true;outlet(3,'bang');}
function recordpath(){
 var path=arrayfromargs(arguments).join(' ');opening=false;if(!path)return;
 if(!/\.wav$/i.test(path))path+='.wav';
 msg('fx_recorder','samptype','int24');msg('fx_recorder','open',path,'wave');armed=true;recordMs=0;
 outlet(2,'recording',0,1,0);
 if(active)beginRecording();else status('Recording armed. PLAY or START begins processed capture.');
}
function beginRecording(){if(!armed)return;msg('fx_recorder',1);recording=true;armed=false;lastAdvance=Date.now();outlet(2,'recording',1,0,0);status('Recording processed stereo WAV. STOP REC leaves playback running.');recordTask=new Task(function(){if(!recording)return;if(Date.now()-lastAdvance>3500){stoprec();status('Recording did not advance. Check DSP, destination and Max Console.');return;}recordTask.schedule(1000);},host);recordTask.schedule(4000);}
function elapsed(ms){ms=Number(ms);if(recording&&isFinite(ms)&&ms>recordMs){recordMs=ms;lastAdvance=Date.now();outlet(2,'recording',1,0,recordMs);}}
function level(ch,v){v=Number(v);if(!isFinite(v))return;if(ch==='L')lastL=v;else lastR=v;outlet(2,'levels',lastL,lastR);}
function reset(){halt();resetState();for(var k in state)if(state.hasOwnProperty(k))apply(k);publish();status('Effects reset to bypass. Start a CMPE instrument.');}
function shutdown(){halt();if(clearTask){clearTask.cancel();clearTask=null;}memory('panic',1);}
function notifydeleted(){shutdown();}

function recordcancel(){opening=false;status("Recording destination cancelled.");}

function bang(){loadbang();}

function probe(path){var f=new File(String(path),"write");f.eof=0;f.writestring(JSON.stringify({state:state,haltReason:haltReason,active:active,recording:recording,armed:armed,elapsedMs:recordMs,peakL:lastL,peakR:lastR}));f.close();}
