autowatch=0;var h=this,t,c,fx,started=false,step=0,waitSince=0,reports=[];
var base='/tmp/cmpe_adv9_';
function write(n,d){var f=new File(base+n+'.json','write');f.eof=0;f.writestring(JSON.stringify(d,null,2));f.close();}
function read(n){var f=new File(base+n+'.json','read'),s='';while(f.position<f.eof)s+=f.readstring(32768);f.close();return JSON.parse(s);}
function later(fn,ms){t=new Task(function(){try{fn();}catch(e){fail(e);}},h);t.schedule(ms);}
function fail(e){try{c.message('stop');fx.message('stoprec');}catch(x){}write('error',{phase:step,error:String(e)});}
function loadbang(){if(started)return;started=true;later(begin,2000);}
function begin(){c=h.patcher.getnamed('controller');fx=h.patcher.getnamed('fx_bus').subpatcher().getnamed('fx_control');c.message('monitor',-36);c.message('apgadv','length',2);c.message('apgadv','lock',1);render();}
function state(){c.message('tmprobe',base+'state.json','inspect');return read('state');}
function render(){c.message('newpiece');waitSince=Date.now();later(poll,300);}
function poll(){var s=state();if(s.error)throw new Error(s.error);if(s.after.state==='ready'){capture();return;}if(Date.now()-waitSince>60000)throw new Error('Render timed out: '+JSON.stringify(s));later(poll,200);}
function capture(){var labels=['locked_a','locked_b','level2_muted','all_muted','new_variation','unlocked_a','unlocked_b'];var label=labels[step];h.patcher.getnamed('output_buffer').message('writewave',base+label+'.wav');reports.push({label:label,settings:state().after.settings});write('progress',reports);later(advance,250);}
function advance(){step++;
 if(step===1){render();}
 else if(step===2){c.message('apgadv','level1',0);render();}
 else if(step===3){c.message('apgadv','level0',0);c.message('apgadv','level2',0);render();}
 else if(step===4){for(var i=0;i<3;i++)c.message('apgadv','level'+i,100);c.message('apgadv','length',3);c.message('apgadv','new',1);render();}
 else if(step===5){c.message('apgadv','lock',0);render();}
 else if(step===6){render();}
 else{c.message('apgadv','lock',1);c.message('presetwrite',base+'set.json');c.message('apgadv','length',9);c.message('apgadv','level0',25);c.message('apgadv','lock',0);c.message('presetread',base+'set.json');later(afterRestore,2000);}
}
function afterRestore(){write('restored',state());c.message('loop',1);fx.message('recordpath',base+'record_dry.wav');c.message('play');later(function(){fx.message('probe',base+'dry_record_status.json');fx.message('stoprec');c.message('stop');later(processed,500);},4200);}
function processed(){fx.message('set','tapeOn',1);fx.message('set','wow',.6);fx.message('set','sat',.5);fx.message('set','memoryOn',1);fx.message('set','memoryMix',.4);fx.message('recordpath',base+'record_fx.wav');c.message('play');later(function(){fx.message('probe',base+'fx_record_status.json');fx.message('stoprec');write('play_after_stoprec',state());c.message('stop');write('complete',{complete:true,runtime:max.version,reports:reports});},4200);}
function notifydeleted(){if(t)t.cancel();}
