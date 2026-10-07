const body=document.body, preloader=document.getElementById('preloader'), header=document.getElementById('header'), progress=document.getElementById('progress'), menuToggle=document.getElementById('menuToggle'), nav=document.getElementById('nav');

window.addEventListener('load',()=>{setTimeout(()=>{preloader.classList.add('hide');body.classList.remove('loading')},500)});
// Hard fallback: force-hide preloader after 4s in case load event is delayed on slow connections
setTimeout(()=>{preloader.classList.add('hide');body.classList.remove('loading')},4000);
body.classList.add('loading');

function scrollUI(){
  const y=window.scrollY, h=document.documentElement.scrollHeight-window.innerHeight;
  header.classList.toggle('scrolled',y>50);
  progress.style.width=(h?y/h*100:0)+'%';
  document.getElementById('backtop').classList.toggle('show',y>700);
}
window.addEventListener('scroll',scrollUI,{passive:true}); scrollUI();

menuToggle.addEventListener('click',()=>{nav.classList.toggle('open');menuToggle.classList.toggle('open');menuToggle.setAttribute('aria-label',nav.classList.contains('open')?'Close menu':'Open menu')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.classList.remove('open')}));

// Smooth scroll with fixed header offset
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const headerHeight = header.offsetHeight;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#' || href.length <= 1) return;
    e.preventDefault();
    smoothScrollTo(href);
    // Update URL hash without jumping
    history.pushState(null, '', href);
  });
});

document.getElementById('backtop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.filters button').forEach(btn=>{
 btn.addEventListener('click',()=>{
  document.querySelector('.filters button.active').classList.remove('active');btn.classList.add('active');
  const filter=btn.dataset.filter;
  document.querySelectorAll('.gallery-item').forEach(item=>item.classList.toggle('hidden',filter!=='all'&&item.dataset.category!==filter));
 });
});

const items=[...document.querySelectorAll('.gallery-item')], lightbox=document.getElementById('lightbox'), lbImage=document.getElementById('lbImage'), lbTitle=document.getElementById('lbTitle'), lbCounter=document.getElementById('lbCounter');
let current=0;
function openLightbox(index){current=index;const item=items[current];lbImage.src=item.querySelector('img').src;lbImage.alt=item.querySelector('img').alt;lbTitle.textContent=item.dataset.title;lbCounter.textContent=`${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function moveLightbox(dir){current=(current+dir+items.length)%items.length;openLightbox(current)}
items.forEach((item,i)=>item.addEventListener('click',()=>openLightbox(i)));
document.getElementById('lbClose').addEventListener('click',closeLightbox);
document.getElementById('lbPrev').addEventListener('click',()=>moveLightbox(-1));
document.getElementById('lbNext').addEventListener('click',()=>moveLightbox(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1)});

const testimonials=[
 ['“Karan made every moment feel effortless. The photographs brought us right back to the emotions of the day.”','A happy couple · Wedding'],
 ['“The maternity photographs feel so personal and beautiful. Every frame feels like a memory we can hold.”','A grateful family · Maternity'],
 ['“He captured the devotion and atmosphere of the occasion with so much care and sensitivity.”','A family · Religious']
];
let ti=0; const quote=document.getElementById('quote'),author=document.getElementById('author'),count=document.getElementById('testCount');
function showTest(i){ti=(i+testimonials.length)%testimonials.length;quote.style.opacity=0;author.style.opacity=0;setTimeout(()=>{quote.textContent=testimonials[ti][0];author.textContent=testimonials[ti][1];count.textContent=`${String(ti+1).padStart(2,'0')} / 03`;quote.style.opacity=1;author.style.opacity=1},180)}
document.getElementById('prevTest').addEventListener('click',()=>showTest(ti-1));document.getElementById('nextTest').addEventListener('click',()=>showTest(ti+1));
setInterval(()=>showTest(ti+1),7000);

document.getElementById('inquiryForm').addEventListener('submit',e=>{
 e.preventDefault();
 const name=document.getElementById('name').value.trim(), phone=document.getElementById('phone').value.trim(), email=document.getElementById('email').value.trim(), type=document.getElementById('type').value, date=document.getElementById('date').value, location=document.getElementById('location').value.trim(), message=document.getElementById('message').value.trim();
 const text=`Hello Karan,\n\nI would like to enquire about photography.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email||'Not provided'}\nPhotography Type: ${type}\nEvent Date: ${date||'Not provided'}\nLocation: ${location||'Not provided'}\nMessage: ${message||'Not provided'}\n\nThank you.`;
 window.open('https://wa.me/916355859969?text='+encodeURIComponent(text),'_blank');
});

let touchStartX=0;lightbox.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].screenX,{passive:true});lightbox.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchStartX;if(Math.abs(dx)>50)moveLightbox(dx<0?1:-1)},{passive:true});
 
