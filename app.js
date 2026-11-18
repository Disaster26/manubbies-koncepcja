(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>40);if(window.pageYOffset<innerHeight*.4)links.forEach(function(l){l.classList.remove('on')});tk=false})}
  addEventListener('scroll',sc,{passive:true});

  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.btn)'));sc();
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
    var st=document.getElementById('start');if(st)io.observe(st);
    var mob=document.getElementById('mob');
    if(mob)new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)},{threshold:0}).observe(document.querySelector('.hero .btn'));
    var m=document.getElementById('mapa');
    if(m){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.t||'Mapa';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f);mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}
  }

  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){moved=false},0)});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){var bs=nav.querySelectorAll('button');
      bs.forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
      function upd(){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;nav.hidden=tor.scrollWidth<=tor.clientWidth+2}
      tor.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
    }
  });


  document.querySelectorAll('[data-kar]').forEach(function(k){
    var tor=k.querySelector('.kar-tor'),imgs=tor.querySelectorAll('img'),n=imgs.length;if(n<2)return;
    var dots=document.createElement('div');dots.className='kar-kropki';
    var l=document.createElement('button'),r=document.createElement('button');
    l.className='kar-strz l';r.className='kar-strz r';l.innerHTML='&#8592;';r.innerHTML='&#8594;';l.setAttribute('aria-label','Poprzednie zdjęcie');r.setAttribute('aria-label','Następne zdjęcie');
    for(var i=0;i<n;i++){(function(i){var b=document.createElement('button');b.setAttribute('aria-label','Zdjęcie '+(i+1)+' z '+n);b.addEventListener('click',function(){go(i)});dots.appendChild(b)})(i)}
    k.appendChild(dots);k.appendChild(l);k.appendChild(r);
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth)}
    function go(i){tor.scrollTo({left:Math.max(0,Math.min(n-1,i))*tor.clientWidth,behavior:'smooth'})}
    function upd(){var c=idx();[].forEach.call(dots.children,function(b,j){b.setAttribute('aria-current',j===c)});l.disabled=c<=0;r.disabled=c>=n-1}
    l.addEventListener('click',function(){go(idx()-1)});r.addEventListener('click',function(){go(idx()+1)});
    tor.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
    var down=false,sx=0,sl=0;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=tor.scrollLeft;tor.style.scrollSnapType='none'});
    addEventListener('pointermove',function(e){if(down)tor.scrollLeft=sl-(e.clientX-sx)});
    addEventListener('pointerup',function(e){if(!down)return;down=false;tor.style.scrollSnapType='';var d=sx-e.clientX;var c=Math.round(sl/tor.clientWidth)+(Math.abs(d)>40?(d>0?1:-1):0);go(c)});
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
  });

  var lb=document.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p'),cur=0,last=null,grp=[];
  function opis(b){var f=b.closest('figure'),c=f&&f.querySelector('figcaption');var img=b.querySelector('img');return c?c.innerText.replace(/\n+/g,' - '):(img?img.alt:'')}
  function pokaz(i){cur=(i+grp.length)%grp.length;var b=grp[cur];li.src=b.dataset.lb;var im=b.querySelector('img');li.alt=im?im.alt:'';lp.textContent=opis(b)+'  ('+(cur+1)+'/'+grp.length+')'}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();last=b;var g=b.closest('[data-grupa]');grp=[].slice.call((g||document).querySelectorAll('[data-lb]'));pokaz(grp.indexOf(b));lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.x').focus()})});
  function zam(){lb.classList.remove('otw');document.body.style.overflow='';li.removeAttribute('src');if(last)last.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){pokaz(cur-1)});
  lb.querySelector('.n').addEventListener('click',function(){pokaz(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(cur+(d<0?1:-1))});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(lb.classList.contains('otw'))zam();else zamknij()}
    if(!lb.classList.contains('otw'))return;
    if(e.key==='ArrowRight')pokaz(cur+1);if(e.key==='ArrowLeft')pokaz(cur-1);
  });

  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset()});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
