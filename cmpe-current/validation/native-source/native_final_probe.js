autowatch=0;inlets=1;outlets=1;var host=this,t,started=false,steps=[],index=0,c,fx,ui;
function write(n,d){var f=new File('/tmp/'+n,'write');f.eof=0;f.writestring(JSON.stringify(d));f.close();}
function loadbang(){if(started)return;started=true;t=new Task(begin,host);t.schedule(1500);}
function begin(){try{
 c=host.patcher.getnamed('controller');var bus=host.patcher.getnamed('fx_bus').subpatcher();fx=bus.getnamed('fx_control');ui=bus.getnamed('fx_canvas');
 steps=[
 [0,function(){c.message('tmprobe','/tmp/cmpe_final_started.json','start');}],
 [6500,function(){host.patcher.getnamed('fxpcontrol').message('open');}],
 [500,function(){ui.message('onclick',430,105);ui.message('onclick',940,105);ui.message('onclick',260,450);ui.message('ondrag',400,420,1);ui.message('onmouseup');fx.message('probe','/tmp/cmpe_final_ui.json');fx.message('recordpath','/tmp/cmpe_final_isjs.wav');}],
 [4000,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_final_isjs_status.json');c.message('tmprobe','/tmp/cmpe_final_isjs_state.json','inspect');c.message('presetwrite','/tmp/cmpe_final_set.json');fx.message('set','wow',0);fx.message('set','blur',0);c.message('presetread','/tmp/cmpe_final_set.json');}],
 [2000,function(){fx.message('probe','/tmp/cmpe_final_restored.json');c.message('mode',0);fx.message('recordpath','/tmp/cmpe_final_apg.wav');c.message('play');}],
 [7500,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_final_apg_status.json');c.message('tmprobe','/tmp/cmpe_final_apg_state.json','inspect');c.message('stop');host.patcher.getnamed('audio_driver').message('stop');write('cmpe_final_complete.json',{complete:true,tests:['native visual controls','ISJS processed WAV','FX Set restore','APG armed processed WAV']});}]
 ];next();}catch(e){write('cmpe_final_error.json',{error:String(e),phase:index});}}
function next(){if(index>=steps.length)return;var s=steps[index++];t=new Task(function(){try{s[1]();next();}catch(e){write('cmpe_final_error.json',{error:String(e),phase:index});}},host);t.schedule(s[0]);}
