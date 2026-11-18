/* common.js — código compartilhado por todas as páginas:
   ícones, ilustrações dos doces, lista de produtos, sacola, conta, tema, avisos e topo do site. */
(() => {
"use strict";

/* ===== configuração ===== */
/* Número do WhatsApp da Cris com código do país e DDD, só dígitos. Ex.: "5511999999999".
   Vazio: o WhatsApp abre para a pessoa escolher o contato. */
const WHATSAPP = "";

/* ===== utilidades ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const waLink = txt => `https://wa.me/${WHATSAPP}${txt ? "?text=" + encodeURIComponent(txt) : ""}`;

/* ===== ícones ===== */
const ICONS = {
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', check: '<path d="M20 6L9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  honey: '<path d="M12 2l8 4.6v9.2L12 20.5 4 15.8V6.6z"/>'
};
const ico = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
function paintIcons(root = document) { $$("[data-i]", root).forEach(e => { if (!e.firstChild) e.innerHTML = ico(e.dataset.i); }); }

/* ===== ilustrações dos doces (SVG próprio) ===== */
const rnd = seed => { let s = seed; return () => ((s = Math.imul(s ^ s >>> 15, 2246822507) ^ Math.imul(s ^ s >>> 13, 3266489909)), ((s >>> 0) % 10000) / 10000); };
function brig(cx, cy, r, col, spr, seed = 1) {
  const R = rnd(seed * 97 + 3); let sp = "";
  for (let i = 0; i < 16; i++) {
    const a = R() * 6.283, d = Math.sqrt(R()) * r * .82, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    sp += `<rect x="${(x - 3).toFixed(1)}" y="${(y - 1).toFixed(1)}" width="${(r * .28).toFixed(1)}" height="${(r * .1).toFixed(1)}" rx="1" fill="${spr[i % spr.length]}" transform="rotate(${(R() * 180) | 0} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return `<g><path d="M${cx - r * 1.15} ${cy + r * .35}L${cx - r * .8} ${cy + r * 1.35}H${cx + r * .8}L${cx + r * 1.15} ${cy + r * .35}Z" fill="#F0B63A"/><path d="M${cx - r * .55} ${cy + r * .5}v${r * .8}M${cx} ${cy + r * .5}v${r * .85}M${cx + r * .55} ${cy + r * .5}v${r * .8}" stroke="#C98912" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>${sp}<ellipse cx="${cx - r * .35}" cy="${cy - r * .45}" rx="${r * .28}" ry="${r * .16}" fill="#fff" opacity=".28" transform="rotate(-30 ${cx - r * .35} ${cy - r * .45})"/></g>`;
}
function pao(g, b, f, dots) {
  return `<ellipse cx="0" cy="56" rx="54" ry="7" fill="#000" opacity=".16"/><path d="M-58 20C-58 44-30 54 0 54S58 44 58 20z" fill="${b}"/><path d="M-58 18C-30 30 30 30 58 18v8C30 38-30 38-58 26z" fill="${f}"/><path d="M-58 20C-58-26-30-48 0-48S58-26 58 20C30 31-30 31-58 20z" fill="${g}"/><path d="M-42-10C-38-28-22-38-6-40" stroke="#fff" stroke-opacity=".38" stroke-width="7" stroke-linecap="round" fill="none"/>${dots ? `<circle cx="22" cy="-22" r="3" fill="${dots}"/><circle cx="36" cy="-6" r="2.6" fill="${dots}"/><circle cx="8" cy="-8" r="2.6" fill="${dots}"/><circle cx="-14" cy="6" r="2.6" fill="${dots}"/><circle cx="30" cy="8" r="2.4" fill="${dots}"/>` : ""}`;
}
function cone(shell, gan) {
  let lines = ""; for (let i = -24; i <= 24; i += 12) lines += `<path d="M${i} -10L0 62" stroke="#A8742C" stroke-width="1.3" opacity=".55"/>`;
  return `<path d="M-30-10H30L0 64z" fill="${shell}"/>${lines}<path d="M-20 12H20M-12 32H12" stroke="#A8742C" stroke-width="1.3" opacity=".55"/><path d="M-36-6C-44-44-12-62 0-62S44-44 36-6C20 8-20 8-36-6z" fill="${gan}"/><path d="M-26-30C-22-42-10-48 0-49" stroke="#fff" stroke-opacity=".32" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="-16" cy="-8" r="3.4" fill="#C99A5B"/><circle cx="6" cy="-4" r="3.4" fill="#C99A5B"/><circle cx="22" cy="-14" r="3" fill="#C99A5B"/>`;
}
function box(c, rib) {
  return `<ellipse cx="0" cy="58" rx="62" ry="7" fill="#000" opacity=".16"/><rect x="-54" y="-2" width="108" height="56" rx="7" fill="${c}"/><rect x="-60" y="-16" width="120" height="24" rx="6" fill="${c}"/><rect x="-60" y="-16" width="120" height="24" rx="6" fill="#000" opacity=".12"/><rect x="-9" y="-16" width="18" height="70" fill="${rib}"/><ellipse cx="-17" cy="-26" rx="16" ry="10" fill="${rib}" transform="rotate(-24 -17 -26)"/><ellipse cx="17" cy="-26" rx="16" ry="10" fill="${rib}" transform="rotate(24 17 -26)"/><circle cx="0" cy="-22" r="7" fill="${rib}"/><circle cx="0" cy="-22" r="7" fill="#000" opacity=".12"/>`;
}
function art(p, o = {}) {
  const a = p.art, k = a.k; let body = "";
  if (k === "pao") body = `<g transform="translate(100 108) scale(1.12)">${pao(a.g, a.b, a.f, a.d)}</g>`;
  else if (k === "cone") body = `<g transform="translate(100 104) scale(1.22)">${cone(a.s, a.g)}</g>`;
  else if (k === "box") body = `<g transform="translate(100 104) scale(1.3)">${box(a.c, a.r)}</g>`;
  else if (k === "brig4") { const C = a.cols; body = brig(66, 70, 21, C[0], a.spr, 1) + brig(134, 70, 21, C[1], a.spr, 2) + brig(66, 128, 21, C[2], a.spr, 3) + brig(134, 128, 21, C[3], a.spr, 4); }
  else if (k === "cento") {
    body = `<rect x="22" y="48" width="156" height="110" rx="14" fill="#E7C98E"/><rect x="22" y="48" width="156" height="110" rx="14" fill="none" stroke="#B88A3C" stroke-width="3"/>`;
    let n = 0; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { n++; body += brig(48 + c * 34, 72 + r * 31, 10.5, a.cols[(r + c) % a.cols.length], a.spr, n); }
  } else if (k === "minis") {
    body = `<g transform="translate(66 118) scale(.62)">${pao(a.g, a.b, a.f, a.d)}</g><g transform="translate(134 118) scale(.62)">${pao(a.g, a.b, a.f, a.d)}</g><g transform="translate(100 84) scale(.62)">${pao(a.g, a.b, a.f, a.d)}</g><path d="M82 160L118 160L112 182H88Z" fill="#E59E00"/><rect x="92" y="164" width="16" height="10" rx="2" fill="#FFF4DC"/>`;
  }
  const bg = o.bg === false ? "" : `<circle cx="100" cy="100" r="88" fill="var(--tint)"/>`;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${(o.label || p.name).replace(/"/g, "")}">${bg}${body}</svg>`;
}

/* ===== produtos ===== */
const CATS = {
  pao: { n: "Pães de mel", art: { name: "Pães de mel", art: { k: "pao", g: "#4A2411", b: "#A8662B", f: "#E0A24A", d: "#E59E00" } } },
  brigadeiro: { n: "Brigadeiros gourmet", art: { name: "Brigadeiros", art: { k: "brig4", cols: ["#3B1D0B", "#5A2E14", "#E8D2A4", "#2C1708"], spr: ["#fff", "#E59E00", "#C0392B"] } } },
  cone: { n: "Cones trufados", art: { name: "Cones", art: { k: "cone", s: "#DDAA5C", g: "#4A2411" } } },
  caixa: { n: "Caixas de presente", art: { name: "Caixas", art: { k: "box", c: "#E59E00", r: "#2C1708" } } }
};
const PRODUCTS = [
  { id: "pm-dl", name: "Pão de Mel Doce de Leite", cat: "pao", price: 12, badge: "Tradicional", desc: "Massa úmida e fofinha com mel puro de florada e recheio cremoso mineiro.", art: { k: "pao", g: "#4A2411", b: "#A8662B", f: "#E8B25E" } },
  { id: "pm-bb", name: "Pão de Mel Brigadeiro Belga", cat: "pao", price: 13.5, badge: "Cacau nobre", desc: "Recheio artesanal de brigadeiro 54% cacau cozido lentamente na panela.", art: { k: "pao", g: "#2C1508", b: "#8F5222", f: "#4B2411", d: "#E59E00" } },
  { id: "pm-nn", name: "Pão de Mel Ninho & Nutella", cat: "pao", price: 14, badge: "Favorito", desc: "Camada dupla: creme aveludado de leite Ninho combinado com Nutella pura.", art: { k: "pao", g: "#5A2E14", b: "#B47436", f: "#F6E7C7", d: "#F6E7C7" } },
  { id: "cone-mc", name: "Cone Crocante Mel & Cacau", cat: "cone", price: 14.5, badge: "Crocante", desc: "Casquinha wafer trufada por dentro com ganache de mel e castanhas tostadas.", art: { k: "cone", s: "#DDAA5C", g: "#4A2411" } },
  { id: "cx-enc", name: "Caixa Degustação Encanto", cat: "caixa", price: 58, badge: "Kit completo", desc: "Caixa de presente com 4 pães de mel e 6 brigadeiros belgas em linda fita.", note: "Fita amarela e cartinha feita à mão. Ótima para presentear.", art: { k: "box", c: "#E59E00", r: "#2C1708" } },
  { id: "br-4", name: "Caixa 4 Brigadeiros Gourmet", cat: "brigadeiro", price: 22, badge: "4 sabores", desc: "Seleção especial: ao leite belga, churros crocante, ninho e meio amargo 70%.", art: { k: "brig4", cols: ["#5A2E14", "#B9733A", "#EBD9B0", "#2C1708"], spr: ["#fff", "#E59E00", "#7A3B14"] } },
  { id: "kit-10", name: "Kit 10 Mini Pães Embalados", cat: "caixa", price: 95, badge: "Lembrancinhas", desc: "Embalagens individuais com lacinho de cetim amarelo e tag da abelhinha.", note: "Ideal para festas e lembrancinhas.", art: { k: "minis", g: "#4A2411", b: "#A8662B", f: "#E8B25E", d: "#E59E00" } },
  { id: "br-100", name: "Cento de Brigadeiros para Festas", cat: "brigadeiro", price: 140, badge: "Festa • 100 un", desc: "100 brigadeiros em forminhas finas. Até 4 sabores para casamentos e aniversários.", note: "Encomendas grandes são confirmadas com a Cris pelo WhatsApp.", art: { k: "cento", cols: ["#3B1D0B", "#5A2E14", "#EBD9B0", "#8A4A1F"], spr: ["#fff", "#E59E00", "#C0392B"] } }
];
const byId = id => PRODUCTS.find(p => p.id === id);
function card(p, i = 0, col = "col-6 col-lg-3") {
  return `<div class="${col}"><article class="pcard" style="--i:${i}">
   <button class="art" data-open="${p.id}" aria-label="Ver detalhes de ${p.name}">${art(p)}<span class="tag">${p.badge}</span></button>
   <div class="pbody"><button class="pname" data-open="${p.id}">${p.name}</button><p class="pdesc">${p.desc}</p>
   <div class="pfoot"><span class="price">${brl(p.price)}</span><button class="btn btn-honey btn-sm" data-add="${p.id}">${ico("plus")} Sacola</button></div></div></article></div>`;
}

/* ===== avisos ===== */
function toast(msg, link) {
  const wrap = $("#toasts"); if (!wrap) return;
  const t = document.createElement("div"); t.className = "toastx";
  t.innerHTML = `<span>${msg}</span>${link ? `<a href="${link.href}">${link.text}</a>` : ""}`;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 320); }, 3200);
}

/* ===== sacola, conta e cupom (guardados no navegador) ===== */
let cart = store.get("cc_cart", {});
let user = store.get("cc_user", null);
const cartApi = {
  all: () => cart,
  count: () => Object.values(cart).reduce((a, b) => a + b, 0),
  save() { store.set("cc_cart", cart); updateBadge(); },
  add(id, q = 1, btn) {
    cart[id] = (cart[id] || 0) + q; cartApi.save(); updateBadge(true);
    toast(`${byId(id).name} na sacola`, { href: "carrinho.html", text: "Ver sacola" });
    if (btn) { const old = btn.innerHTML; btn.classList.add("added"); btn.innerHTML = ico("check") + " Adicionado"; setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = old; }, 1100); }
  },
  set(id, q) { if (q <= 0) delete cart[id]; else cart[id] = q; cartApi.save(); },
  clear() { cart = {}; cartApi.save(); }
};
const userApi = {
  get: () => user,
  set(u) { user = u; store.set("cc_user", u); paintAccount(); },
  clear() { user = null; store.del("cc_user"); if (couponApi.get() === "BEMVINDA10") couponApi.set(null); paintAccount(); }
};
const couponApi = {
  get: () => store.get("cc_coupon", null),
  set(c) { c ? store.set("cc_coupon", c) : store.del("cc_coupon"); }
};
function updateBadge(bump) {
  const n = cartApi.count(), b = $("#cartCount"); if (!b) return;
  b.textContent = n; b.style.display = n ? "flex" : "none";
  if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}
function paintAccount() {
  const a = $("#acctBtn"), nav = $('[data-nav="login"]');
  if (a) a.innerHTML = user ? `${ico("user")}<span class="lbl">${esc(user.name.split(" ")[0])}</span>` : `${ico("user")}<span class="lbl">Entrar</span>`;
  if (nav) nav.textContent = user ? "Minha conta" : "Entrar";
}

/* ===== janela de detalhes do produto ===== */
let modal, mId, mQ = 1;
function openProd(id) {
  const el = $("#pModal"); if (!el || !window.bootstrap) return;
  const p = byId(id); mId = id; mQ = 1;
  $("#pmArt").innerHTML = art(p); $("#pmCat").textContent = CATS[p.cat].n; $("#pmTitle").textContent = p.name;
  $("#pmDesc").textContent = p.desc; $("#pmNote").textContent = p.note || ""; $("#pmPrice").textContent = brl(p.price); $("#pmQty").textContent = 1;
  modal = modal || new bootstrap.Modal(el); modal.show();
}
function bindModal() {
  if (!$("#pModal")) return;
  $("#pmMinus").innerHTML = ico("minus"); $("#pmPlus").innerHTML = ico("plus");
  $("#pmPlus").addEventListener("click", () => { mQ = Math.min(99, mQ + 1); $("#pmQty").textContent = mQ; });
  $("#pmMinus").addEventListener("click", () => { mQ = Math.max(1, mQ - 1); $("#pmQty").textContent = mQ; });
  $("#pmAdd").addEventListener("click", e => { cartApi.add(mId, mQ, e.currentTarget); setTimeout(() => modal && modal.hide(), 500); });
}

/* ===== tema claro e escuro ===== */
function isDark() { const t = document.documentElement.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
function paintTheme() { const b = $("#themeBtn"); if (b) b.innerHTML = ico(isDark() ? "sun" : "moon"); }
{ const t = store.get("cc_theme", null); if (t) document.documentElement.dataset.theme = t; }

/* ===== gotas de mel entre o topo escuro e o conteúdo ===== */
function paintDrips() {
  const R = rnd(11); let d = "M0 0H1200V12", x = 1200; const drips = [];
  while (x > 20) {
    const w = 14 + R() * 16, len = 10 + R() * 60 * (R() > .55 ? 1 : .35); x -= w;
    d += `H${(x + w).toFixed(1)}V${(12 + len).toFixed(1)}a${(w / 2).toFixed(1)} ${(w / 2).toFixed(1)} 0 0 1 ${-w.toFixed(1)} 0V12`;
    if (len > 45 && drips.length < 4) drips.push([x + w / 2, 12 + len]);
    x -= 18 + R() * 60;
  }
  const svg = `<path d="${d}H0z" fill="var(--honey)"/>` + drips.map((p, i) => `<circle class="drop" cx="${p[0].toFixed(1)}" cy="${p[1] + 6}" r="6" style="animation-delay:${i * .8}s"/>`).join("");
  $$(".drip-svg").forEach(s => s.innerHTML = svg);
}

/* ===== revelar ao rolar (só o que está abaixo da primeira dobra) ===== */
let io;
function reveal() {
  if (reduce || !("IntersectionObserver" in window)) return;
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".rv").forEach(el => {
    if (el.dataset.rv) return; el.dataset.rv = "1";
    if (el.getBoundingClientRect().top > innerHeight * .95) { el.classList.add("rv-hide"); io.observe(el); }
  });
}

/* ===== inicialização do topo e rodapé ===== */
function init() {
  const holder = document.querySelector("[data-page]");
  const page = holder ? holder.dataset.page : "";
  $$("[data-nav]").forEach(a => { if (a.dataset.nav === page) { a.classList.add("active"); a.setAttribute("aria-current", "page"); } });
  const ci = $("#cartIcon"); if (ci) ci.innerHTML = ico("bag");
  paintIcons(); paintTheme(); paintAccount(); updateBadge(); paintDrips(); bindModal();
  $$(".wa-link").forEach(a => a.href = waLink("Olá, Cris! Vim pelo site e gostaria de fazer um pedido."));
  const tb = $("#themeBtn");
  if (tb) tb.addEventListener("click", () => { const n = isDark() ? "light" : "dark"; document.documentElement.dataset.theme = n; store.set("cc_theme", n); paintTheme(); });
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-add],[data-open]"); if (!t) return;
    if (t.dataset.add) cartApi.add(t.dataset.add, 1, t); else openProd(t.dataset.open);
  });
}

window.CC = { $, $$, brl, esc, store, reduce, waLink, ico, paintIcons, art, brig, rnd, CATS, PRODUCTS, byId, card, toast,
  cart: cartApi, user: userApi, coupon: couponApi, reveal, updateBadge };
init();
})();
