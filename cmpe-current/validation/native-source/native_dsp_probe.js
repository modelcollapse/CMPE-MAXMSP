autowatch=0;inlets=1;outlets=1;
var begun=false,host=this,task,steps=[],index=0,fx,gain;
function loadbang(){if(begun)return;begun=true;task=new Task(begin,host);task.schedule(1000);}
function write(n,d){var f=new File('/tmp/'+n,'write');f.eof=0;f.writestring(JSON.stringify(d));f.close();}
function begin(){try{fx=host.patcher.getnamed('bus').subpatcher().getnamed('fx_control');gain=host.patcher.getnamed('gain');host.patcher.getnamed('dac').message('int',1);steps=[
 [600,function(){fx.message('resume');fx.message('recordpath','/tmp/cmpe_dsp_dry.wav');}],
 [2200,function(){fx.message('stoprec');fx.message('set','tapeOn',1);fx.message('set','wow',.8);fx.message('set','sat',.65);}],
 [400,function(){fx.message('recordpath','/tmp/cmpe_dsp_tape.wav');}],
 [2200,function(){fx.message('stoprec');fx.message('set','tapeOn',0);fx.message('set','memoryOn',1);fx.message('set','memoryMix',1);}],
 [6000,function(){fx.message('set','hold',1);gain.message('float',0);fx.message('recordpath','/tmp/cmpe_dsp_hold.wav');}],
 [2200,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_dsp_hold.json');fx.message('clear');}],
 [500,function(){fx.message('recordpath','/tmp/cmpe_dsp_clear.wav');}],
 [1800,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_dsp_clear.json');gain.message('float',.08);fx.message('set','tapeOn',1);fx.message('set','memoryMix',.4);}],
 [700,function(){fx.message('recordpath','/tmp/cmpe_dsp_chain.wav');}],
 [2200,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_dsp_chain.json');fx.message('halt');host.patcher.getnamed('dac').message('stop');write('cmpe_dsp_complete.json',{complete:true});}]
 ];next();}catch(e){write('cmpe_dsp_error.json',{error:String(e),phase:index});}}
function next(){if(index>=steps.length)return;var s=steps[index++];task=new Task(function(){try{s[1]();next();}catch(e){write('cmpe_dsp_error.json',{error:String(e),phase:index});}},host);task.schedule(s[0]);}
