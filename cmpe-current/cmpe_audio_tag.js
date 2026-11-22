/* Preserve adstatus's set/clear/append selectors; prepend consumes set. */
inlets=1;outlets=1;var tag=jsarguments.slice(1);
function anything(){outlet(0,tag.concat([messagename],arrayfromargs(arguments)));}
function list(){outlet(0,tag.concat(arrayfromargs(arguments)));}
function msg_int(v){outlet(0,tag.concat([v]));}
function msg_float(v){outlet(0,tag.concat([v]));}
