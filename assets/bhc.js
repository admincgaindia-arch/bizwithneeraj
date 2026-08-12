
(function(){
  'use strict';
  var WA = 'https://wa.me/919996647888?text=';
  var NL = String.fromCharCode(10);

  var Q = [
    { k:'who', q:'Sabse pehle — aap kaun hain?',
      h:'Isi se tay hota hai ki aage kaun se sawal poochhne hain.',
      o:[['sal','Naukri karta/karti hoon (salaried)'],
         ['free','Freelancer ya professional — apna kaam karta hoon'],
         ['shop','Dukaan, thela, chhota vyapaar ya service'],
         ['firm','Proprietorship ya partnership firm'],
         ['co','Private Limited, LLP ya OPC'],
         ['ngo','Trust, Society ya NGO']] },

    { k:'size', q:'Saal bhar ki aamdani ya turnover kitni ke aas-paas hai?',
      h:'Andaaza kaafi hai. Isse pata chalta hai kaun se registration ka sawal banta hai.',
      o:[['t0','5 lakh se kam'],
         ['t1','5 se 20 lakh'],
         ['t2','20 lakh se 1 crore'],
         ['t3','1 se 10 crore'],
         ['t4','10 crore se zyada'],
         ['tx','Abhi shuruaat hai / kuch nahi']] },

    { k:'gst', q:'GST registration hai?',
      h:'',
      o:[['y','Haan, GST number hai'],
         ['n','Nahi hai'],
         ['q','Pata nahi / soch rahe hain']] },

    { k:'emp', q:'Kitne log kaam karte hain aapke saath?',
      h:'Salary par rakhe gaye log — khud ko mat giniye.',
      o:[['e0','Koi nahi'],
         ['e1','1 se 10'],
         ['e2','11 se 50'],
         ['e3','50 se zyada']] },

    { k:'itr', q:'Pichhle saal ki income tax return file hui thi?',
      h:'',
      o:[['y','Haan, time par ho gayi thi'],
         ['l','Haan, lekin late ya belated'],
         ['n','Nahi hui'],
         ['q','Pata nahi']] },

    { k:'notice', q:'Koi notice aaya hai department se?',
      h:'GST portal par ya income tax ke e-filing account par.',
      o:[['no','Nahi, koi notice nahi'],
         ['gst','Haan — GST ka notice'],
         ['it','Haan — Income Tax ka notice'],
         ['both','Dono taraf se'],
         ['q','Pata nahi, kabhi check hi nahi kiya']] },

    { k:'books', q:'Accounts aur books kaun sambhalta hai?',
      h:'',
      o:[['ca','Ek CA ya consultant, regular'],
         ['self','Main khud ya ghar/office ka koi'],
         ['none','Theek se kuch nahi hota'],
         ['team','Apni andar ki accounts team hai']] },

    { k:'want', q:'Aage kya karna chahte hain?',
      h:'Ek se zyada chun sakte hain.', multi:true,
      o:[['start','Naya business ya company shuru karni hai'],
         ['clean','Purani gadbad theek karwani hai'],
         ['month','Har mahine ka kaam kisi ko dena hai'],
         ['notice','Notice ka jawab dena hai'],
         ['brand','Naam / brand register karwana hai'],
         ['grow','Funding, tender ya bade client ke liye taiyaar hona hai']] }
  ];

  // ---- packages: every price here is already published on this site -------
  var PK = {
    vyakti: { name:'Vyakti', who:'Salaried · freelancer · individual',
      price:'Rs. 499 se', per:'per return + GST',
      items:['Income tax return filing','Regime aur deduction ka comparison','Form 26AS aur AIS milaan','Notice aaye toh pehla review'],
      href:'services.html' },
    dukaan: { name:'Dukaan', who:'Dukaan · thela · chhoti service',
      price:'Rs. 2,500', per:'per month + GST (retainer R1)',
      items:['Har mahine GST return','Saal ki income tax return','Books ka basic rakh-rakhav','Portal par notice ki nigrani'],
      href:'retainers.html' },
    vyapaar: { name:'Vyapaar', who:'Badhta hua vyapaar · firm',
      price:'Rs. 6,000', per:'per month + GST (retainer R2)',
      items:['GST returns aur reconciliation','TDS returns','Income tax return aur advance tax','Saal bhar salah, har baar fees nahi'],
      href:'retainers.html' },
    launch: { name:'Launch Kit', who:'Nayi company · startup',
      price:'Rs. 15,000 se', per:'one-time + GST (government fees alag)',
      items:['Name approval aur incorporation','PAN, TAN aur bank documents','GST registration','Pehle saal ka compliance calendar'],
      href:'startup.html' },
    sme: { name:'SME Complete', who:'Badhti hui SME · 15-50 log',
      price:'Rs. 12,500', per:'per month + GST (retainer R3)',
      items:['GST, TDS aur ROC — sab ek desk se','Payroll aur PF/ESI ka kaam','Monthly MIS aur book closure','Notice aur assessment ka handling'],
      href:'retainers.html' },
    corp: { name:'Corporate', who:'Company · multi-state · 50+ log',
      price:'Rs. 30,000', per:'per month + GST (retainer R4)',
      items:['Multi-state GST aur reconciliation','Poora payroll aur labour compliance','ROC, board aur secretarial support','Audit ke liye poori taiyaari'],
      href:'retainers.html' },
    mnc: { name:'Group / MNC', who:'Group · foreign parent · large',
      price:'Rs. 60,000', per:'per month + GST (retainer R5)',
      items:['Consolidated compliance calendar','Transfer pricing aur Form 3CEB','15CA/15CB remittance certification','Virtual CFO aur board reporting'],
      href:'international-tax.html' },
    ngo: { name:'Sanstha', who:'Trust · Society · NGO',
      price:'Rs. 12,000 se', per:'registration + GST (government fees alag)',
      items:['Trust ya Society registration','12A aur 80G application','Saal ki return aur Form 10B','Donor ke liye certificate ka process'],
      href:'services.html' }
  };

  function pick(a){
    var w=a.who, s=a.size, e=a.emp, want=a.want||[];
    if(w==='ngo') return 'ngo';
    if(w==='sal') return 'vyakti';
    if(w==='free') return (s==='t2'||s==='t3'||s==='t4') ? 'vyapaar' : 'vyakti';
    if(want.indexOf('start')>-1 && (w==='shop'||w==='free')) return 'launch';
    if(w==='co'){
      if(s==='t4'||e==='e3') return 'mnc';
      if(s==='t3'||e==='e2') return 'corp';
      if(s==='tx'||s==='t0') return 'launch';
      return 'sme';
    }
    if(w==='firm'){
      if(s==='t4') return 'corp';
      if(s==='t3'||e==='e2'||e==='e3') return 'sme';
      if(s==='t2') return 'vyapaar';
      return 'dukaan';
    }
    // shop
    if(s==='t3'||s==='t4') return 'sme';
    if(s==='t2'||e==='e2'||e==='e3') return 'vyapaar';
    return 'dukaan';
  }

  function flags(a){
    var f=[], w=a.who, s=a.size, e=a.emp, want=a.want||[];
    var big = (s==='t2'||s==='t3'||s==='t4');

    if(a.notice==='gst'||a.notice==='both')
      f.push(['hi','GST notice pending hai','Notice ka apna time limit hota hai. Jitna intezaar, utne option kam. Sabse pehle yahi dekhna chahiye.']);
    if(a.notice==='it'||a.notice==='both')
      f.push(['hi','Income tax notice pending hai','Har notice ka apna section aur apni deadline hoti hai. Jawab dene se pehle ye tay karna zaroori hai ki notice hai kis baare mein.']);
    if(a.notice==='q')
      f.push(['md','Portal kabhi check nahi kiya','Aajkal zyadatar notice sirf portal par aate hain, dak se nahi. Log ho jaate hain aur pata tab chalta hai jab deadline nikal chuki hoti hai. Ek baar login karke dekh lena chahiye.']);

    if(a.itr==='n')
      f.push(['hi','Pichhle saal ki ITR file nahi hui','Return na bharne par late fee aur interest to lagta hi hai, aur refund bhi atak jaata hai. Loan ya visa ke waqt yahi sabse pehle maanga jaata hai.']);
    if(a.itr==='l')
      f.push(['md','ITR late gayi thi','Belated return mein kuch cheezein miss ho jaati hain — jaise loss carry forward aur kuch cases mein regime ka chunav. Is saal time par bharna chahiye.']);
    if(a.itr==='q')
      f.push(['md','ITR ka status hi pata nahi','Ye e-filing account mein do minute mein dikh jaata hai. Bina iske aage ka koi bhi plan andhere mein hoga.']);

    if(a.gst==='n' && big)
      f.push(['hi','Turnover hai, GST registration nahi','Aapke turnover par GST registration ka sawal seedha banta hai. Kis din se banta hai ye aapke business ki nature aur state par depend karta hai — lekin ye check karwana taalna nahi chahiye, kyunki pichhli tareekh se liability ban sakti hai.']);
    if(a.gst==='q')
      f.push(['md','GST par confusion hai','Registration lagta hai ya nahi — ye turnover, aapka state, aur aap goods bechte hain ya service dete hain, teenon par depend karta hai. Ek baar saaf karwa lena behtar hai.']);
    if(a.gst==='y' && a.books==='none')
      f.push(['hi','GST number hai lekin books nahi','GST number lene ke baad return har mahine ya har quarter bharna hi padta hai, chahe koi kaam hua ho ya nahi. Na bharne par late fee chalti rehti hai aur registration suspend tak ho sakta hai.']);

    if(e==='e1'||e==='e2'||e==='e3'){
      f.push(['md','Salary par log rakhe hain','Jahan salary di jaati hai wahan TDS, PF aur ESI ke sawal aate hain — aur ye employer ki zimmedari hoti hai, employee ki nahi. Kaun sa lagta hai ye headcount aur salary level par tay hota hai.']);
      f.push(['md','Salary structure dobara dekhna chahiye','Naye labour codes ke tehat wages ki paribhasha badal gayi hai, jiska seedha asar PF aur gratuity par padta hai. Zyadatar purane CTC breakup us paribhasha par khare nahi utarte.']);
    }

    if(a.who==='co')
      f.push(['md','Company hai toh ROC bhi chalta hai','Company ya LLP ki annual filing income tax se alag hoti hai aur alag se chalti hai. Yahan late fees roz ke hisaab se badhti hai, aur uski koi upper limit nahi hoti.']);

    if(a.who==='ngo')
      f.push(['md','12A aur 80G ki sthiti check kariye','12A ke bina sanstha ki income par tax ka sawal khada hota hai, aur 80G ke bina donor ko deduction nahi milta — jiska seedha asar donation par padta hai. Dono ka renewal ka apna cycle bhi hota hai.']);

    if(a.books==='none')
      f.push(['hi','Books theek se nahi ban rahin','Notice ka jawab, loan ki file, ya kisi bhi return ka aadhaar — sab books par tikta hai. Yahi ek cheez hai jise theek karne se baaki sab aasan ho jaata hai.']);
    if(a.books==='self' && big)
      f.push(['md','Is size par khud sambhalna risky hai','Turnover badhne ke saath reconciliation aur mismatch ke sawal badhte hain. Ek galti ka pata aksar do saal baad notice se chalta hai.']);

    if(want.indexOf('brand')>-1)
      f.push(['lo','Naam register karwana chahte hain','Naam par haq apne aap nahi ban jaata — registration ke baad banta hai. Pehle search hoti hai, phir filing. Kaun sa class lagega ye kaam par tay hota hai.']);
    if(want.indexOf('grow')>-1)
      f.push(['lo','Funding ya bade client ke liye taiyaari','Bada client aur investor dono pehle compliance record dekhte hain — GST, ROC aur ITR ka. Ye cheez pehle se saaf honi chahiye, deal ke beech mein nahi banayi jaati.']);

    if(!f.length)
      f.push(['lo','Abhi tak koi badi red flag nahi dikhi','Aapke jawab ke hisaab se turant kuch chhoot nahi raha. Ek baar detail mein dekh lena phir bhi theek rehta hai — kyunki ye 8 sawal sab kuch nahi poochh sakte.']);

    return f;
  }

  // ---------- rendering ----------
  var root = document.getElementById('bhc');
  if(!root) return;
  var step = 0, ans = {};

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  // The site nav is position:sticky, so a plain scrollIntoView hides the top of
  // the card behind it. Scroll manually with the nav's real height as offset.
  function bring(el, force){
    var nav = document.querySelector('nav');
    var pad = (nav ? nav.getBoundingClientRect().height : 0) + 14;
    var r = el.getBoundingClientRect();
    if(!force && r.top >= pad && r.bottom <= window.innerHeight) return;
    var y = r.top + window.pageYOffset - pad;
    try { window.scrollTo({ top: y, behavior: 'smooth' }); }
    catch(e){ window.scrollTo(0, y); }
  }

  function draw(){
    if(step >= Q.length){ result(); return; }
    var q = Q[step];
    var cur = ans[q.k];
    var pct = Math.round((step / Q.length) * 100);
    var h = '<div class="bhc-bar"><i style="width:' + pct + '%"></i></div>' +
      '<p class="bhc-step">Sawal ' + (step+1) + ' of ' + Q.length + '</p>' +
      '<p class="bhc-q">' + q.q + '</p>' +
      (q.h ? '<p class="bhc-help">' + q.h + '</p>' : '') +
      '<div class="bhc-opts">';
    for(var i=0;i<q.o.length;i++){
      var v = q.o[i][0], lab = q.o[i][1];
      var on = q.multi ? (cur && cur.indexOf(v)>-1) : (cur===v);
      h += '<button type="button" class="bhc-opt' + (on?' sel':'') + '" data-v="' + v + '">' +
           '<span class="tick">✓</span><span>' + esc(lab) + '</span></button>';
    }
    h += '</div>';
    if(q.multi) h += '<p class="bhc-multi">Jitne chahein chun lijiye, phir Aage dabaiye.</p>';
    h += '<div class="bhc-nav">' +
         '<button type="button" class="bhc-next" id="bhcNext">Aage →</button>' +
         (step>0 ? '<button type="button" class="bhc-back" id="bhcBack">← Peeche</button>' : '') +
         '</div>';
    root.innerHTML = h;
    bring(root, false);

    var nx = document.getElementById('bhcNext');
    function refresh(){
      var c = ans[q.k];
      var ok = q.multi ? (c && c.length>0) : !!c;
      nx.disabled = !ok;
    }
    refresh();

    root.querySelectorAll('.bhc-opt').forEach(function(b){
      b.addEventListener('click', function(){
        var v = b.getAttribute('data-v');
        if(q.multi){
          var c = ans[q.k] || [];
          var i = c.indexOf(v);
          if(i>-1) c.splice(i,1); else c.push(v);
          ans[q.k] = c;
          b.classList.toggle('sel');
          refresh();
        } else {
          ans[q.k] = v;
          root.querySelectorAll('.bhc-opt').forEach(function(x){ x.classList.remove('sel'); });
          b.classList.add('sel');
          refresh();
          setTimeout(function(){ step++; draw(); }, 170);
        }
      });
    });
    nx.addEventListener('click', function(){ if(!nx.disabled){ step++; draw(); } });
    var bk = document.getElementById('bhcBack');
    if(bk) bk.addEventListener('click', function(){ step--; draw(); });
  }

  function label(k,v){
    for(var i=0;i<Q.length;i++){ if(Q[i].k!==k) continue;
      for(var j=0;j<Q[i].o.length;j++){ if(Q[i].o[j][0]===v) return Q[i].o[j][1]; } }
    return v;
  }

  function result(){
    var f = flags(ans), key = pick(ans), p = PK[key];
    var hi = 0, md = 0;
    f.forEach(function(x){ if(x[0]==='hi') hi++; else if(x[0]==='md') md++; });
    var cls, head, sub;
    if(hi>=2){ cls='r'; head='Turant dekhne layak'; sub='Kuch cheezein aisi hain jo intezaar nahi kar sakteen. Neeche list mein laal wale points pehle.'; }
    else if(hi===1 || md>=3){ cls='a'; head='Dhyaan dene layak'; sub='Abhi aag nahi lagi, lekin kuch cheezein khuli padi hain. Theek karne mein aasani abhi hai.'; }
    else { cls='g'; head='Halat theek dikh rahi hai'; sub='Aapke jawab ke hisaab se koi badi cheez chhootti nahi dikh rahi.'; }

    var lines = ['Business Health Check ka result:'];
    Q.forEach(function(q){
      var v = ans[q.k];
      if(!v) return;
      var t = q.multi ? v.map(function(x){ return label(q.k,x); }).join(', ') : label(q.k,v);
      lines.push('• ' + q.q.replace(/—/g,'-') + ' ' + t);
    });
    lines.push('');
    lines.push('Suggested package: ' + p.name + ' (' + p.price + ')');
    lines.push('Isi par baat karni hai.');
    var wa = WA + encodeURIComponent(lines.join(NL));

    var h = '<div class="bhc-res">' +
      '<p class="bhc-step">Aapka result</p>' +
      '<div class="bhc-score"><div class="dial ' + cls + '">' + (hi+md) + '</div>' +
      '<div><b>' + head + '</b><p>' + sub + '</p></div></div>' +
      '<h3>Aapke jawab par ye cheezein dikhti hain</h3><div class="bhc-list">';
    f.forEach(function(x){
      h += '<div class="bhc-item ' + x[0] + '"><span class="dot"></span><div><b>' +
           esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div></div>';
    });
    h += '</div>' +
      '<div class="bhc-pick"><p class="lbl">Aapke liye jo sahi baithta hai</p>' +
      '<h4>' + esc(p.name) + '</h4>' +
      '<p style="color:var(--slate);font-size:.92rem">' + esc(p.who) + '</p>' +
      '<p class="pr">' + esc(p.price) + ' <span style="font-weight:500;color:var(--slate)">— ' + esc(p.per) + '</span></p>' +
      '<ul>' + p.items.map(function(i){ return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:12px"><a href="' + p.href + '" style="color:var(--navy);font-weight:600">Poori detail dekhiye →</a></p></div>' +
      '<div class="bhc-acts">' +
      '<a class="btn btn-gold" href="' + wa + '" target="_blank" rel="noopener">Ye result WhatsApp par bhejiye</a>' +
      '<button type="button" class="bhc-redo" id="bhcRedo">Dobara bhariye</button></div>' +
      '<p class="bhc-note">Ye ek shuruaati self-check hai, professional opinion nahi. Aath sawal aapka poora case nahi jaan sakte — asli sthiti aapke documents dekhne ke baad hi tay hoti hai. Koi bhi faisla lene se pehle baat kar lijiye.</p>' +
      '</div>';
    root.innerHTML = h;
    bring(root, true);
    document.getElementById('bhcRedo').addEventListener('click', function(){
      step = 0; ans = {}; draw();
    });
  }

  draw();
})();
