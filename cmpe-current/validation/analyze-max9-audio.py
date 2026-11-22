import pathlib,struct,json,hashlib,math
base=pathlib.Path('/tmp');out={}
def wav(label):
 p=base/('cmpe_adv9b_'+label+'.wav');b=p.read_bytes();pos=12;fmt=None;data=None
 while pos+8<=len(b):
  tag=b[pos:pos+4];n=struct.unpack_from('<I',b,pos+4)[0];v=b[pos+8:pos+8+n];pos+=8+n+(n%2)
  if tag==b'fmt ':fmt=struct.unpack_from('<HHIIHH',v)
  if tag==b'data':data=v
 kind,ch,sr,br,align,bits=fmt
 if kind==3:values=struct.unpack('<'+'f'*(len(data)//4),data)
 elif bits==24:values=[int.from_bytes(data[i:i+3],'little',signed=True)/8388608 for i in range(0,len(data),3)]
 elif bits in [16,32]:values=[x/(2**(bits-1)) for x in struct.unpack('<'+('h' if bits==16 else 'i')*(len(data)//(bits//8)),data)]
 else:raise Exception(fmt)
 d={'seconds':len(data)/align/sr,'channels':ch,'sampleRate':sr,'bits':bits,'frames':len(data)//align,'peak':max(map(abs,values),default=0),'rms':math.sqrt(sum(x*x for x in values)/max(1,len(values))),'pcmHash':hashlib.sha256(data).hexdigest()}
 if label not in ['record_dry','record_fx']:d['palindrome']=all(values[i*ch+j]==values[(d['frames']-1-i)*ch+j] for i in range(d['frames']//2) for j in range(ch))
 out[label]=d;return d
for label in ['locked_a','locked_b','level2_muted','all_muted','new_variation','unlocked_a','unlocked_b','record_dry','record_fx']:
 p=base/('cmpe_adv9b_'+label+'.wav')
 if p.exists():wav(label)
print(json.dumps(out,indent=2));pathlib.Path('/tmp/cmpe_adv9b_audio_analysis.json').write_text(json.dumps(out,indent=2))
