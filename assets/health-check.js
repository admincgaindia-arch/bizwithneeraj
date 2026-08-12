(function(){
'use strict';
var Q=[
 {k:'type',q:'Aapka business kis form mein hai?',h:'Jo abhi registered hai wahi chuniye.',o:[
   ['prop','Proprietorship / apne naam par'],
   ['firm','Partnership firm ya LLP'],
   ['pvt','Private Limited / OPC / Public Ltd'],
   ['trust','Trust, Society ya Section 8 (NGO)'],
   ['none','Abhi kuch register nahi hua']]},
 {k:'turn',q:'Pichhle saal ka approximate turnover?',h:'Andaza chalega — exact number ki zaroorat nahi.',o:[
   ['t0','20 lakh se kam'],
   ['t1','20 lakh se 1 crore'],
   ['t2','1 crore se 5 crore'],
   ['t3','5 crore se zyada'],
   ['tx','Abhi shuruaat hai / kuch khaas nahi']]},
 {k:'gst',q:'GST registration hai?',h:'',o:[
   ['y','Haan, GSTIN hai'],
   ['n','Nahi hai'],
   ['x','Pata nahi / confirm karna hai']]},
 {k:'gstr',q:'GST returns kahan tak bhare hue hain?',h:'GSTR-1 aur 3B dono ko milakar sochiye.',o:[
   ['ok','Sab up to date hain'],
   ['few','Ek-do mahine pending hain'],
   ['many','Teen ya usse zyada pending hain'],
   ['na','GST hai hi nahi'],
   ['x','Pata nahi']]},
 {k:'emp',q:'Payroll par kitne log hain?',h:'Salary lene wale sab — permanent aur contract dono.',o:[
   ['e0','Koi nahi'],
   ['e1','1 se 10'],
   ['e2','11 se 50'],
   ['e3','50 se zyada']]},
 {k:'tds',q:'TDS kaat kar jama karte hain?',h:'Salary, rent, contractor, professional fees — kisi bhi par.',o:[
   ['ok','Haan, katta bhi hai aur return bhi filed hai'],
   ['pend','Katta hai, par return pending hai'],
   ['no','Nahi kaatte'],
   ['x','Pata nahi']]},
 {k:'books',q:'Accounts kaise maintain hote hain?',h:'',o:[
   ['sw','Tally ya koi accounting software'],
   ['xl','Excel ya register mein'],
   ['ca','CA ke paas hi rehta hai, mere paas kuch nahi'],
   ['no','Theek se kuch nahi hai']]},
 {k:'not',q:'Pichhle kuch samay mein koi notice aaya?',h:'Portal par aaya message bhi notice hota hai.',o:[
   ['none','Koi nahi'],
   ['it','Income tax se'],
   ['gst','GST se'],
   ['both','Dono se'],
   ['roc','MCA / ROC se']]},
 {k:'itr',q:'Pichhle saal ka ITR file hua tha?',h:'',o:[
   ['ok','Haan, time par'],
   ['late','Haan, par der se'],
   ['no','Nahi hua'],
   ['x','Pata nahi']]},
 {k:'roc',q:'Company ya LLP hai toh ROC filing up to date hai?',h:'Annual return aur financial statements.',o:[
   ['ok','Haan, up to date hai'],
   ['no','Nahi, pending hai'],
   ['x','Pata nahi'],
   ['na','Company ya LLP nahi hai']]}
];

var A={},i=0;
var $=function(id){return document.getElementById(id);};
var box=$('hcBox'),ask=$('hcAsk'),res=$('hcRes'),bar=$('hcBar');

function esc(s){return String(s).replace(/[&<>"]/g,function(c){
 return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

function draw(){
 var q=Q[i];
 $('hcStep').textContent='Sawaal '+(i+1)+' / '+Q.length;
 $('hcQ').textContent=q.q;
 var hp=$('hcHelp');
 hp.textContent=q.h||'';
 hp.style.display=q.h?'':'none';
 bar.style.width=(i/Q.length*100)+'%';
 var w=$('hcOpts');
 w.innerHTML='';
 q.o.forEach(function(o,n){
  var b=document.createElement('button');
  b.type='button';
  b.innerHTML='<b>'+String.fromCharCode(65+n)+'</b><span>'+esc(o[1])+'</span>';
  b.addEventListener('click',function(){
    A[q.k]=o[0];
    if(i<Q.length-1){i++;draw();}else{finish();}
  });
  w.appendChild(b);
 });
 $('hcBack').hidden=(i===0);
}

$('hcBack').addEventListener('click',function(){if(i>0){i--;draw();}});

function F(sev,title,body,link,label){
 return {s:sev,t:title,b:body,l:link,ll:label};
}

function assess(){
 var f=[],good=[];
 var isCo=(A.type==='pvt'||A.type==='firm');
 var big=(A.turn==='t2'||A.turn==='t3');

 // notices first — most urgent
 if(A.not==='both'){
   f.push(F(2,'Do department se notice pending hai',
    'Income tax aur GST dono taraf se notice aaya hai. Har notice ka apna reply window hota hai aur wo chhota hota hai. Sabse pehle ye dekhna chahiye ki dono mein kya maanga gaya hai aur kis par kitna waqt bacha hai.',
    'gst-notice-sos.html','GST Notice SOS dekhiye'));
 } else if(A.not==='gst'){
   f.push(F(2,'GST notice ka reply pending lag raha hai',
    'GST notice bina jawab ke chhod dene se maamla apne aap aage badh jata hai — demand ban sakti hai ya registration par asar aa sakta hai. Notice ka form number dekh kar hi pata chalta hai ki kya maanga gaya hai.',
    'gst-notice-sos.html','Notice decoder istemaal kijiye'));
 } else if(A.not==='it'){
   f.push(F(2,'Income tax notice aaya hai',
    'Har income tax notice ka matlab problem nahi hota — kuch sirf information maangte hain. Lekin section dekhe bina ye tay nahi hota. Reply na dene par assessment ektarfa ho sakti hai.',
    'article-itr-notice.html','ITR notice guide padhiye'));
 } else if(A.not==='roc'){
   f.push(F(2,'MCA / ROC se notice aaya hai',
    'ROC ke notices aksar pending filings ya director compliance se jude hote hain. Ye company aur directors dono par asar daal sakte hain, isliye ise pending nahi rakhna chahiye.',
    'services.html','Corporate compliance dekhiye'));
 }

 // GST
 if(A.gst==='x'){
   f.push(F(2,'GST registration ka status hi clear nahi hai',
    'Registration hai ya nahi — ye sabse pehle pakka karna chahiye. Agar hai aur returns nahi ja rahe toh late fee chalti rehti hai. Agar nahi hai aur zaroorat thi, toh pichhla period bhi dekhna padta hai.',
    'services.html','GST services dekhiye'));
 } else if(A.gst==='n'&&(A.turn==='t1'||big)){
   f.push(F(2,'Turnover ke hisaab se GST registration check hona chahiye',
    'Registration ki zaroorat turnover, business ke type aur state par depend karti hai — aur inter-state supply ya online selling mein alag rule lagta hai. Aapke turnover band par ye check zaroori hai.',
    'services.html','GST registration dekhiye'));
 } else if(A.gst==='n'&&A.turn==='t0'){
   good.push('GST abhi lagoo nahi lagta, par turnover badhne par ye check dobara karna chahiye.');
 }

 if(A.gstr==='many'){
   f.push(F(2,'GST returns kaafi pending hain',
    'Lagatar returns na jaane par late fee roz badhti hai, buyer ka input credit atak jata hai, aur department registration par action le sakta hai. Jitni der, utna mehnga.',
    'gst-notice-sos.html','Pending returns par baat kijiye'));
 } else if(A.gstr==='few'){
   f.push(F(1,'Ek-do GST return pending hain',
    'Abhi ye chhoti baat hai, isiliye abhi hi nipta lena sasta padta hai. Pending return agle return ko bhi rok deta hai, isliye ye aage jaakar chain ban jati hai.',
    'retainers.html','Monthly filing retainer dekhiye'));
 } else if(A.gstr==='x'){
   f.push(F(1,'GST filing status confirm karna chahiye',
    'Portal par status khud dekhna aasan hai aur ek baar mein pata chal jata hai. Jo cheez pata nahi hoti wahi baad mein late fee banti hai.',
    'services.html','GST filing dekhiye'));
 } else if(A.gstr==='ok'){
   good.push('GST returns up to date hain — ye sabse badi rahat hai, kyunki yahi sabse jaldi mehnga padta hai.');
 }

 // TDS
 if(A.tds==='pend'){
   f.push(F(2,'TDS kata hai par return nahi gaya',
    'Kata hua TDS jama na ho ya return na jaye — dono alag cheezein hain aur dono par alag asar padta hai. Saath hi, deductee ko credit nahi milta aur wo aapse poochhega.',
    'payroll-hr.html','TDS aur payroll dekhiye'));
 } else if(A.tds==='no'&&(A.emp==='e1'||A.emp==='e2'||A.emp==='e3')){
   f.push(F(2,'Payroll hai par TDS nahi kat raha',
    'Salary par TDS ki zimmedari employer ki hoti hai, aur ye sirf salary tak nahi rukti — rent, contractor aur professional fees par bhi lag sakta hai. Ye check karwa lena chahiye.',
    'payroll-hr.html','Payroll compliance dekhiye'));
 } else if(A.tds==='x'){
   f.push(F(1,'TDS ki position clear nahi hai',
    'Zyadatar businesses kisi na kisi payment par TDS ke daayre mein aa jate hain. Ek baar dekh lena chahiye ki kaunse payments par lagta hai aur kya chhoot raha hai.',
    'payroll-hr.html','TDS check karwaiye'));
 } else if(A.tds==='ok'){
   good.push('TDS katta bhi hai aur return bhi ja raha hai — ye wo area hai jahan zyadatar log phaste hain.');
 }

 // ITR
 if(A.itr==='no'){
   f.push(F(2,'Pichhle saal ka ITR file nahi hua',
    'Return na jaane par late fee aur interest toh lagta hi hai, saath mein loss carry forward jaisa fayda bhi haath se nikal jata hai. Bank loan aur tender mein bhi return maanga jata hai.',
    'services.html','ITR filing dekhiye'));
 } else if(A.itr==='x'){
   f.push(F(1,'ITR ka status confirm nahi hai',
    'Income tax portal par apne last few years ka filing status khud dekha ja sakta hai. Ye 5 minute ka kaam hai aur bahut kuch saaf kar deta hai.',
    'services.html','ITR filing dekhiye'));
 } else if(A.itr==='late'){
   f.push(F(1,'Pichhla ITR der se gaya tha',
    'Der se jaane par kuch faayde nahi milte aur late fee lagti hai. Agar ye har saal ho raha hai toh wajah aksar documents ka waqt par na milna hoti hai — usi ko theek karna chahiye.',
    'retainers.html','Retainer se ye repeat nahi hota'));
 } else if(A.itr==='ok'){
   good.push('ITR time par gaya tha — isse aapki filing history saaf rehti hai.');
 }

 // ROC
 if(isCo&&A.roc==='no'){
   f.push(F(2,'ROC filings pending hain',
    'Company aur LLP ki annual filings par roz ke hisaab se additional fee lagti hai, jo kam nahi hoti. Lambe samay tak pending rehne par director par bhi asar aa sakta hai.',
    'services.html','Corporate compliance dekhiye'));
 } else if(isCo&&A.roc==='x'){
   f.push(F(1,'ROC filing ka status dekh lena chahiye',
    'MCA portal par company ka filing status public hota hai. Ye ek baar dekh lena chahiye, kyunki yahan late fee sabse tezi se badhti hai.',
    'services.html','Corporate compliance dekhiye'));
 } else if(isCo&&A.roc==='ok'){
   good.push('ROC filings up to date hain — company side saaf hai.');
 }

 // structure
 if(A.type==='none'){
   f.push(F(1,'Business abhi kisi structure mein nahi hai',
    'Proprietor, LLP ya Pvt Ltd — ye faisla tax, liability, funding aur client ke bharose, sab par asar daalta hai. Baad mein badalna mumkin hai par mehnga aur lamba hota hai.',
    'startup.html','Structure ka faisla dekhiye'));
 }
 if(A.type==='prop'&&big){
   f.push(F(1,'Is turnover par structure aur audit dono dekhne layak hain',
    'Is level par proprietorship mein poori personal liability aapke sar par rehti hai. Saath hi audit ki applicability turnover, cash ke ratio aur profit percentage par depend karti hai — ye check karwa lena chahiye.',
    'startup.html','Structure ke option dekhiye'));
 }
 if(A.type==='trust'){
   f.push(F(1,'Trust / NGO ke apne registrations dekhne chahiye',
    '12A ke bina income par tax lag sakta hai, aur 80G ke bina donor ko deduction nahi milta — dono ke apne renewal cycle hote hain. Annual return alag se lagta hai.',
    'article-12ab-80g.html','12AB aur 80G samjhiye'));
 }

 // payroll
 if(A.emp==='e2'||A.emp==='e3'){
   f.push(F(1,'Employee count ke hisaab se labour side dekhna chahiye',
    'Kitne log payroll par hain, isse PF, ESI aur register maintain karne ki zimmedari tay hoti hai. Saath hi salary structure mein basic ka hissa bhi dekhna chahiye, kyunki uska seedha asar PF aur gratuity ki cost par padta hai.',
    'labour-code-restructuring.html','Salary structure check karwaiye'));
 } else if(A.emp==='e1'){
   f.push(F(1,'Chhoti team par bhi kuch cheezein lagoo ho jati hain',
    'Employee count badhte hi PF aur ESI ki applicability aa sakti hai, aur salary par TDS pehle se lagoo hota hai. Ek baar dekh lena chahiye ki kya-kya lagoo hai.',
    'payroll-hr.html','Payroll compliance dekhiye'));
 }

 // books
 if(A.books==='no'){
   f.push(F(2,'Accounts theek se maintain nahi ho rahe',
    'Bina books ke na sahi return banta hai, na notice ka jawab. Agar kabhi scrutiny aayi toh sabse pehla sawaal yahi aata hai — aur uska jawab baad mein banaya nahi ja sakta.',
    'retainers.html','Bookkeeping retainer dekhiye'));
 } else if(A.books==='xl'&&big){
   f.push(F(1,'Is turnover par Excel se kaam chalana risky hai',
    'Is size par GST reconciliation, TDS aur stock ek saath sambhalna Excel mein mushkil ho jata hai. Galti pakadne ka koi system nahi hota, aur galti pata tab chalti hai jab notice aata hai.',
    'retainers.html','Accounting support dekhiye'));
 } else if(A.books==='ca'){
   f.push(F(1,'Books aapke apne paas honi chahiye',
    'CA ke paas rehna galat nahi hai, par data aapka hai. Kabhi professional badalna pade ya notice aa jaye toh apni copy ka na hona sabse mehngi problem ban jati hai.',
    'retainers.html','Monthly reporting dekhiye'));
 } else if(A.books==='sw'){
   good.push('Accounting software par kaam ho raha hai — reconciliation aur notice ka jawab dono aasan rehte hain.');
 }

 if(A.not==='none'){
   good.push('Filhaal koi notice pending nahi hai — chizein pehle se theek rakhna hi sabse sasta rehta hai.');
 }

 f.sort(function(a,b){return b.s-a.s;});
 return {f:f,good:good};
}

function waText(r){
 var lbl={};
 Q.forEach(function(q){q.o.forEach(function(o){lbl[q.k+':'+o[0]]=o[1];});});
 var lines=['HEALTH — Compliance health check ka result','',
  'Business: '+lbl['type:'+A.type],
  'Turnover: '+lbl['turn:'+A.turn],
  'GST: '+lbl['gst:'+A.gst]+' / returns: '+lbl['gstr:'+A.gstr],
  'Payroll: '+lbl['emp:'+A.emp]+' / TDS: '+lbl['tds:'+A.tds],
  'Books: '+lbl['books:'+A.books],
  'Notice: '+lbl['not:'+A.not],
  'ITR: '+lbl['itr:'+A.itr]+' / ROC: '+lbl['roc:'+A.roc],''];
 if(r.f.length){
   lines.push('Tool ne ye points nikale:');
   r.f.slice(0,5).forEach(function(x,n){lines.push((n+1)+'. '+x.t);});
 } else {
   lines.push('Tool ne koi bada point nahi nikala.');
 }
 lines.push('','Ispar baat karni hai.');
 return lines.join(String.fromCharCode(10));
}

function finish(){
 var r=assess();
 var hi=0,md=0;
 r.f.forEach(function(x){if(x.s===2)hi++;else md++;});
 var band,cls,dial,note;
 if(hi>=2){band='Kuch cheezein turant dekhni chahiye';cls='r';dial=hi;
   note='Yahan neeche jo laal mein hai, wo aam taur par sabse pehle nipatana padta hai — kyunki inme waqt ke saath cost badhti hai.';}
 else if(hi===1||md>=3){band='Zyadatar theek hai, kuch points dekhne layak hain';cls='a';dial=hi+md;
   note='Koi emergency nahi lagti, par neeche wali cheezein chhodne par baad mein mehngi padti hain.';}
 else if(md>0){band='Kaafi haad tak theek chal raha hai';cls='a';dial=md;
   note='Sirf kuch chhoti cheezein hain jinhe ek baar dekh lena chahiye.';}
 else{band='Aapke jawab ke hisaab se koi bada point nahi mila';cls='g';dial='0';
   note='Das sawaal se sirf itna hi pata chalta hai. Documents dekhne par tasveer badal sakti hai, isliye ise clean chit na maaniye.';}

 var h='<div class="hc-score '+cls+'"><div class="hc-dial">'+dial+'</div><div>'
  +'<b>'+esc(band)+'</b><p>'+esc(note)+'</p></div></div>';

 if(r.f.length){
   h+='<p class="eyebrow" style="margin-bottom:14px">Dekhne layak</p>';
   r.f.forEach(function(x){
     h+='<div class="hc-find '+(x.s===2?'hi':'md')+'">'
       +'<span class="hc-tag">'+(x.s===2?'Pehle dekhiye':'Dekh lena chahiye')+'</span>'
       +'<h4>'+esc(x.t)+'</h4><p>'+esc(x.b)+'</p>'
       +'<a class="hc-link" href="'+esc(x.l)+'">'+esc(x.ll)+' &rarr;</a></div>';
   });
 }
 if(r.good.length){
   h+='<p class="eyebrow" style="margin:26px 0 14px">Jo theek hai</p>';
   r.good.forEach(function(g){
     h+='<div class="hc-clean"><h4>&#10003; Ye theek chal raha hai</h4><p>'+esc(g)+'</p></div>';
   });
 }

 var wa='https://wa.me/919996647888?text='+encodeURIComponent(waText(r));
 h+='<div class="hc-act">'
  +'<p class="hc-hint">Aage baat karni ho toh ye button aapke jawab saath le jata hai — dobara sab likhna nahi padega.</p>'
  +'<a class="btn btn-gold" data-wa href="'+wa+'" target="_blank" rel="noopener">Ye result WhatsApp par bhejiye</a>'
  +'<button class="hc-again" type="button" id="hcAgain">Dobara shuru kariye</button>'
  +'</div>';
 h+='<p class="hc-disc">Ye ek self-assessment tool hai, professional advice nahi. Iska nateeja sirf aapke diye gaye das jawabon par bana hai — na koi document dekha gaya hai, na koi return. Aap par kya lagoo hota hai ye aapke facts par depend karta hai, isliye koi bhi kadam uthane se pehle apni situation par baat kar lijiye. Government fees, jahan lagti hai, alag se dey hoti hai.</p>';

 res.innerHTML=h;
 ask.style.display='none';
 res.classList.add('show');
 bar.style.width='100%';
 if(typeof fbq==='function'){try{fbq('trackCustom','HealthCheckComplete');}catch(e){}}
 var ag=document.getElementById('hcAgain');
 if(ag)ag.addEventListener('click',function(){
   A={};i=0;res.classList.remove('show');res.innerHTML='';ask.style.display='';draw();
   box.scrollIntoView({behavior:'smooth',block:'start'});
 });
 box.scrollIntoView({behavior:'smooth',block:'start'});
}

draw();
})();
