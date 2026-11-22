/* Visual performance panel inspired by FX Patcher's colored slots and Field Kit's pad. */
autowatch=0;inlets=1;outlets=1;
mgraphics.init();mgraphics.relative_coords=0;mgraphics.autofill=0;
var S={}, regions=[],drag=null,notice='Loading effects...',rec=false,armed=false,elapsedMs=0,levL=0,levR=0;
var amber=[.604,.29,0,1],blue=[.09,.31,.796,1],ink=[.09,.125,.169,1],muted=[.275,.325,.396,1],bg=[1,1,1,1];
var secondary=[.878,.898,.922,1],track=[.835,.863,.898,1],card=[.965,.973,.984,1],gridc=[.835,.863,.898,1],danger=[.659,.129,.196,1],white=[1,1,1,1];
var tape=[['wow','Wow'],['flutter','Flutter'],['age','Age'],['hiss','Hiss'],['drop','Dropouts'],['sat','Saturation'],['tone','Tone'],['speed','Tape speed']];
var mem=[['memoryMix','Mix',0,1],['feedback','Feedback',0,.98],['blur','Blur',0,1],['drift','Drift',0,1],['drive','Drive',0,1],['width','Width',0,2],['pitch','Pitch',-12,0],['tempo','BPM',20,400]];
function state(raw){try{S=JSON.parse(String(raw));}catch(e){}mgraphics.redraw();}
function status(t){notice=String(t);mgraphics.redraw();}
function recording(a,b,ms){rec=!!a;armed=!!b;elapsedMs=Number(ms)||0;mgraphics.redraw();}
function levels(l,r){levL=Number(l)||0;levR=Number(r)||0;mgraphics.redraw();}
function col(c,a){mgraphics.set_source_rgba(c[0],c[1],c[2],a===undefined?c[3]:a);}
function rect(x,y,w,h,c){col(c);mgraphics.rectangle(x,y,w,h);mgraphics.fill();}
function txt(t,x,y,size,c,bold){col(c||ink);mgraphics.select_font_face('Arial','normal',bold?'bold':'normal');mgraphics.set_font_size(size||13);mgraphics.move_to(x,y);mgraphics.show_text(String(t));}
function line(x,y,x2,y2,c,w){col(c);mgraphics.set_line_width(w||1);mgraphics.move_to(x,y);mgraphics.line_to(x2,y2);mgraphics.stroke();}
function hit(x,y,w,h,data){data.x=x;data.y=y;data.w=w;data.h=h;regions.push(data);}
function button(label,x,y,w,key,on,c,action){rect(x,y,w,30,on?c:secondary);txt(label,x+12,y+20,13,on?white:ink,true);hit(x,y,w,30,{type:action?'action':'toggle',key:key,action:action});}
function knob(k,label,x,y,min,max,c){var v=typeof S[k]==='number'?S[k]:min,n=Math.max(0,Math.min(1,(v-min)/(max-min))),cx=x+40,cy=y+34,r=25,a0=Math.PI*.75,a1=Math.PI*2.25;
 col(track);mgraphics.set_line_width(5);mgraphics.arc(cx,cy,r,a0,a1);mgraphics.stroke();col(c);mgraphics.arc(cx,cy,r,a0,a0+n*(a1-a0)+.0001);mgraphics.stroke();
 var a=a0+n*(a1-a0);line(cx,cy,cx+Math.cos(a)*18,cy+Math.sin(a)*18,c,2);
 txt(label,x+2,y+83,13,muted,false);var labelV=k==='pitch'?v.toFixed(1)+' st':k==='tempo'?Math.round(v)+' BPM':Math.round(v*100)+'%';txt(labelV,x+2,y+104,15,ink,true);
 hit(x,y,82,112,{type:'knob',key:k,min:min,max:max,value:v});}
function paint(){regions=[];rect(0,0,1040,596,bg);
 txt('CMPE / TAPE + MEMORY',18,31,24,ink,true);txt('A performance layer for all five instruments',20,54,13,muted);
 txt('SOURCE',652,29,12,muted,true);txt('TAPE',736,29,12,amber,true);txt('MEMORY',813,29,12,blue,true);txt('REC / OUT',930,29,12,ink,true);line(704,25,724,25,muted);line(778,25,801,25,muted);line(877,25,918,25,muted);
 rect(18,76,492,292,card);rect(18,76,492,3,amber);rect(526,76,496,292,card);rect(526,76,496,3,blue);
 txt('01 / TAPE',36,110,18,amber,true);txt('Wow, flutter and worn magnetic colour',36,133,12,muted);button(S.tapeOn?'\u25cf TAPE ON':'OFF \u00b7 CLICK TO TURN ON',282,91,210,'tapeOn',S.tapeOn,amber);
 for(var i=0;i<4;i++)knob(tape[i][0],tape[i][1],36+i*116,146,0,1,amber);
 for(i=4;i<8;i++)knob(tape[i][0],tape[i][1],36+(i-4)*116,252,0,1,amber);
 txt('02 / DRIFTING MEMORY',544,110,18,blue,true);txt('Capture, smear and recirculate the present',544,133,12,muted);button(S.memoryOn?'\u25cf MEMORY ON':'OFF \u00b7 CLICK TO TURN ON',794,91,210,'memoryOn',S.memoryOn,blue);
 for(i=0;i<4;i++)knob(mem[i][0],mem[i][1],544+i*116,146,mem[i][2],mem[i][3],blue);
 for(i=4;i<8;i++)knob(mem[i][0],mem[i][1],544+(i-4)*116,252,mem[i][2],mem[i][3],blue);
 // The lower controls and XY gesture area remain in the same window.
 button('HOLD',544,384,87,'hold',S.hold,blue);button('REVERSE',640,384,107,'reverse',S.reverse,blue);button('HALF SPEED',756,384,122,'half_speed',S.half_speed,blue);button('CLEAR',888,384,116,'',false,blue,'clear');
 var modes=['Two delays','Four delays','Giant reverb','Granular delay','Rhythmic'],sizes=['Small','Medium','Large'];button(modes[S.mode||0]+'  >',544,425,146,'mode',true,blue);regions[regions.length-1].type='cycle';regions[regions.length-1].max=4;
 button(sizes[S.size||0]+'  >',700,425,146,'size',false,blue);regions[regions.length-1].type='cycle';regions[regions.length-1].max=2;
 button(['Capture OFF','Capture A','Capture B','Capture ALL'][S.record||0]+'  >',856,425,148,'record',false,blue);regions[regions.length-1].type='cycle';regions[regions.length-1].max=3;
 rect(18,384,492,132,card);for(i=1;i<8;i++)line(18+i*61.5,384,18+i*61.5,516,gridc);for(i=1;i<4;i++)line(18,384+i*33,510,384+i*33,gridc);
 var px=18+(S.blur||0)*492,py=516-(S.drift||0)*132;line(px,384,px,516,blue);line(18,py,510,py,blue);col(blue);mgraphics.ellipse(px-5,py-5,10,10);mgraphics.fill();txt('BLUR  →',31,507,12,muted,true);txt('DRIFT  ↑',31,403,12,muted,true);hit(18,384,492,132,{type:'xy'});
 txt('OUTPUT',544,493,12,muted,true);meter(612,478,187,9,levL);meter(612,492,187,9,levR);txt('Linked stereo ceiling  −0.18 dBFS',815,494,12,muted);
 button(rec?'STOP REC':armed?'CANCEL ARM':'RECORD FX',18,536,150,'',rec||armed,danger,'recordtoggle');button('STOP REC',180,536,112,'',false,blue,'stoprec');button('PANIC / STOP FX',304,536,174,'',false,blue,'panic');button('RESET FX',490,536,120,'',false,blue,'reset');
 txt(rec?'● REC '+(elapsedMs/1000).toFixed(1)+' s':armed?'ARMED · start CMPE':'24-bit stereo WAV · processed · before listening volume',628,556,12,rec?danger:muted,rec);
 txt(notice.slice(0,130),20,589,12,muted);
}
function meter(x,y,w,h,v){rect(x,y,w,h,track);var n=Math.max(0,Math.min(1,(20*Math.log(Math.max(.001,v))/Math.LN10+60)/60));rect(x,y,w*n,h,v>.96?danger:blue);}
function select(x,y){for(var i=regions.length-1;i>=0;i--){var r=regions[i];if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return r;}return null;}
function send(k,v){S[k]=v;outlet(0,'set',k,v);mgraphics.redraw();}
function pad(x,y,r){var a=Math.max(0,Math.min(1,(x-r.x)/r.w)),b=Math.max(0,Math.min(1,1-(y-r.y)/r.h));S.blur=a;S.drift=b;outlet(0,'xy',a,b);mgraphics.redraw();}
function onclick(x,y){var r=select(x,y);drag=null;if(!r)return;if(r.type==='action'){outlet(0,r.action);return;}if(r.type==='toggle'){send(r.key,S[r.key]?0:1);return;}if(r.type==='cycle'){send(r.key,((S[r.key]||0)+1)%(r.max+1));return;}drag={region:r,y:y,value:S[r.key]};if(r.type==='xy')pad(x,y,r);}
function ondrag(x,y,button,cmd,shift){if(!drag)return;var r=drag.region;if(r.type==='xy')pad(x,y,r);else if(r.type==='knob'){var scale=shift?800:160,v=drag.value+(drag.y-y)*(r.max-r.min)/scale;send(r.key,Math.max(r.min,Math.min(r.max,v)));}}
function onmouseup(){drag=null;}
function onresize(){mgraphics.redraw();}
