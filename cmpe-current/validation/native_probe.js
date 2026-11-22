autowatch=0;inlets=1;outlets=1;
var host=this,task;
function loadbang(){task=new Task(run,host);task.schedule(1200);}
function run(){
 try {var sut=host.patcher.getnamed('sut').subpatcher(),c=sut.getnamed('controller');c.message('tmprobe','/tmp/cmpe_native_initial.json','inspect');post('CMPE NATIVE initial probe finished\n');}
 catch(e){var f=new File('/tmp/cmpe_native_initial.json','write');f.eof=0;f.writestring(JSON.stringify({error:String(e)}));f.close();}
}
function bang(){run();}
post('CMPE NATIVE probe script compiled\n');
