autowatch=0;inlets=1;outlets=1;var host=this,t,started=false,checks=0;
function loadbang(){if(started)return;started=true;t=new Task(function(){host.patcher.getnamed('controller').message('tmprobe','/tmp/cmpe_load_start.json','start');t=new Task(function(){var c=host.patcher.getnamed('controller');c.message('tmprobe','/tmp/cmpe_load_before.json','inspect');host.patcher.getnamed('load1').message('bang');watch();},host);t.schedule(6500);},host);t.schedule(1500);}
function watch(){t=new Task(function(){host.patcher.getnamed('controller').message('tmprobe','/tmp/cmpe_load_after.json','inspect');if(++checks<120)watch();},host);t.schedule(1000);}
function notifydeleted(){if(t)t.cancel();}
