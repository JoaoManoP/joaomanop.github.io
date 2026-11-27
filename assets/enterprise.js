(() => {
 const menu=document.querySelector('[data-menu-toggle]');
 const nav=document.querySelector('[data-main-nav]');
 menu?.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(open));
  nav?.classList.toggle('is-open',open);
  document.body.classList.toggle('menu-open',open);
 });
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menu?.setAttribute('aria-expanded','false');nav.classList.remove('is-open');document.body.classList.remove('menu-open');
 }));
 const current=location.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
 nav?.querySelectorAll('a').forEach(a=>{
  const target=new URL(a.href,location.origin).pathname.replace(/index\.html$/,'').replace(/\/$/,'');
  if(target && (current===target || current.startsWith(target+'/')))a.setAttribute('aria-current','page');
 });
 document.querySelectorAll('[data-filter-group]').forEach(group=>{
  const buttons=[...group.querySelectorAll('[data-filter]')],items=[...document.querySelectorAll('[data-filter-item]')];
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
   const f=btn.dataset.filter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
   items.forEach(item=>item.hidden=f!=='all' && !item.dataset.filterItem.split(' ').includes(f));
  }));
 });
 document.querySelectorAll('[data-accordion]').forEach(btn=>btn.addEventListener('click',()=>btn.setAttribute('aria-expanded',String(btn.getAttribute('aria-expanded')!=='true'))));
})();