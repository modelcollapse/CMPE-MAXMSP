const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(root,'cmpe_current_controller_20261122.js'),'utf8');
const c={};vm.createContext(c);vm.runInContext(src.slice(0,src.indexOf('var host =')),c);
const A=c.APGAdvancedModel,P=c.APGPlan;let tests=[];
function test(n,f){f();tests.push(n)}
const sources=[0,1,2].map(i=>({name:'s'+i,durationMs:1000+i*300,frames:1000+i*300,channels:1}));
function plan(a){return P.makePlan(sources,[4,6,8],.5,1000,A.random(a.seed),a)}
const a=A.defaults();
test('Auto retains twice the longest source duration',()=>assert.equal(plan(a).totalFrames,3200));
test('Manual length is exact at the output sample rate',()=>{a.lengthSeconds=2.123;assert.equal(plan(a).totalFrames,2123);assert(plan(a).exactLength)});
test('Short compositions retain valid mirrored pairs',()=>{a.lengthSeconds=.1;let p=plan(a);for(let i=0;i<p.events.length;i+=2){let x=p.events[i],y=p.events[i+1];assert(x.lengthFrames<=100);assert.equal(x.startFrame+y.startFrame+x.lengthFrames,100);assert.equal(x.direction,-y.direction);assert(x.positionStartMs>=0);assert(x.startFrame>=0)}});
test('Same seed reproduces the entire arrangement',()=>assert.equal(JSON.stringify(plan(a)),JSON.stringify(plan(A.copy(a)))));
test('Changing levels retains event count, pitch, timing and direction',()=>{let before=plan(a);a.levels=[0,.5,2];let after=plan(a);assert.equal(before.events.length,after.events.length);for(let i=0;i<before.events.length;i++){for(let k of ['slot','pair','startFrame','lengthFrames','rate','direction'])assert.equal(before.events[i][k],after.events[i][k]);assert.equal(after.events[i].amplitude,before.events[i].amplitude*a.levels[after.events[i].slot])}});
test('Older sets restore default Advanced settings',()=>assert.equal(JSON.stringify(A.restore()),JSON.stringify(A.defaults())));
test('Saved settings preserve independent level values and seed',()=>{a.variationLocked=true;assert.equal(JSON.stringify(A.restore(JSON.parse(JSON.stringify(a)))),JSON.stringify(a));let b=A.copy(a);b.levels[0]=1;assert.equal(a.levels[0],0)});
test('Malformed settings are rejected',()=>{for(let change of [{lengthSeconds:601},{levels:[1,NaN,1]},{seed:0},{variationLocked:1}])assert.throws(()=>A.restore(Object.assign(A.defaults(),change)))});
// Exercise actual message handlers without Max's native audio layer.
let dirty=0;Object.assign(c,{apgAdvanced:A.defaults(),apgSeedPrepared:false,state:'ready',CMPEState:()=>({mode:0,restoring:false,nativeBusy:[false,false,false]}),CMPEAudioState:()=>({changing:false}),markDirty:()=>dirty++,named:()=>null,sources:[]});
vm.runInContext(src.slice(src.indexOf('/* Native Advanced panel.')),c);
test('Panel messages set length, sample balance and lock',()=>{c.apgadv('length',8);c.apgadv('level1',65);c.apgadv('lock',1);assert.equal(c.apgAdvanced.lengthSeconds,8);assert.equal(c.apgAdvanced.levels[1],.65);assert.equal(c.apgAdvanced.variationLocked,true);assert.equal(dirty,2)});
test('Auto toggle remembers manual length',()=>{c.apgadv('auto',1);assert.equal(c.apgAdvanced.lengthSeconds,0);c.apgadv('auto',0);assert.equal(c.apgAdvanced.lengthSeconds,8)});
test('New Variation changes seed even while locked',()=>{let seed=c.apgAdvanced.seed;c.apgadv('new',1);assert.notEqual(c.apgAdvanced.seed,seed);assert(c.apgSeedPrepared);assert(c.apgAdvanced.variationLocked)});
test('Playing disables Advanced edits',()=>{c.state='playing';c.apgadv('length',12);assert.equal(c.apgAdvanced.lengthSeconds,8)});
const p=JSON.parse(fs.readFileSync(path.join(root,'CMPE_CURRENT.maxpat'))).patcher;
test('Advanced panel is embedded and connected to the controller',()=>{let b=p.boxes.find(x=>x.box.varname==='advanced_panel').box;assert(b.patcher);assert(p.lines.some(x=>x.patchline.source[0]==='advanced_panel'&&x.patchline.destination[0]==='controller'));for(let key of ['auto','length','level0','level1','level2','lock','new'])assert(b.patcher.boxes.some(x=>x.box.text==='prepend apgadv '+key))});
test('Advanced window-control connection has a real subpatch inlet',()=>{const panel=p.boxes.find(x=>x.box.id==='advanced_panel').box;assert.equal(panel.numinlets,1);assert(panel.patcher.boxes.some(x=>x.box.maxclass==='inlet'));const button=p.boxes.find(x=>x.box.id==='advanced_button').box;assert.equal(button.ignoreclick,0);for(const [a,b] of [['advanced_button','advanced_open'],['advanced_open','controller']])assert(p.lines.some(x=>x.patchline.source[0]===a&&x.patchline.destination[0]===b));});
const result={passed:tests.length,tests,nativeMax:false};fs.writeFileSync(path.join(__dirname,'advanced-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
