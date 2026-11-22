autowatch=0;inlets=1;outlets=1;
var begun=false;var host=this,task,steps=[],index=0,sut,c,bus,fx,osc,gain;
function write(name,data){var f=new File('/tmp/'+name,'write');f.eof=0;f.writestring(JSON.stringify(data,null,2));f.close();}
function loadbang(){if(begun)return;begun=true;task=new Task(begin,host);task.schedule(1500);}
function begin(){try{
 sut=host.patcher;c=sut.getnamed('controller');bus=sut.getnamed('fx_bus');fx=bus.subpatcher().getnamed('fx_control');
 steps=[
 [0,function(){sut.getnamed('audio_driver').message('int',1);c.message('tmprobe','/tmp/cmpe_native_initial.json','start');}],
 [1800,function(){c.message('tmprobe','/tmp/cmpe_native_started.json','inspect');fx.message('recordpath','/tmp/cmpe_native_instrument.wav');}],
 [3000,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_native_instrument_status.json');c.message('stop');}],
 [300,function(){osc=sut.newdefault(1750,1200,'cycle~',330);gain=sut.newdefault(1750,1240,'*~',.08);sut.connect(osc,0,gain,0);sut.connect(gain,0,bus,0);sut.connect(gain,0,bus,1);sut.getnamed('audio_driver').message('int',1);fx.message('resume');fx.message('set','tapeOn',0);fx.message('set','memoryOn',0);fx.message('recordpath','/tmp/cmpe_native_bypass.wav');}],
 [2200,function(){fx.message('stoprec');fx.message('set','tapeOn',1);fx.message('set','wow',.8);fx.message('set','sat',.65);}],
 [500,function(){fx.message('recordpath','/tmp/cmpe_native_tape.wav');}],
 [2500,function(){fx.message('stoprec');fx.message('set','tapeOn',0);fx.message('set','memoryOn',1);fx.message('set','memoryMix',1);fx.message('set','feedback',.75);}],
 [6000,function(){fx.message('set','hold',1);gain.message('float',0);fx.message('recordpath','/tmp/cmpe_native_memory_hold.wav');}],
 [3000,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_native_memory_status.json');fx.message('clear');}],
 [500,function(){fx.message('probe','/tmp/cmpe_native_clear_status.json');fx.message('recordpath','/tmp/cmpe_native_memory_clear.wav');}],
 [1800,function(){fx.message('stoprec');fx.message('set','tapeOn',1);fx.message('set','memoryMix',.4);gain.message('float',.08);}],
 [1000,function(){fx.message('recordpath','/tmp/cmpe_native_chain.wav');}],
 [3000,function(){fx.message('stoprec');fx.message('probe','/tmp/cmpe_native_chain_status.json');c.message('tmprobe','/tmp/cmpe_native_finished.json','stop');sut.remove(osc);sut.remove(gain);sut.getnamed('audio_driver').message('stop');write('cmpe_native_complete.json',{complete:true,phases:6});}]
 ];index=0;next();
 }catch(e){write('cmpe_native_error.json',{error:String(e),phase:index});}}
function next(){if(index>=steps.length)return;var step=steps[index++];task=new Task(function(){try{step[1]();next();}catch(e){write('cmpe_native_error.json',{error:String(e),phase:index});}},host);task.schedule(step[0]);}
post('CMPE NATIVE verification runner compiled\n');
