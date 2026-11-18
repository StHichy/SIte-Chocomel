/* carrinho.js — sacola, entrega, pagamento e confirmação do pedido */
(() => {
"use strict";
const { $, $$, brl, esc, art, byId, ico, waLink, reduce, cart, user, coupon: couponStore } = CC;
const numeroWhatsApp = "5515988089701";
const DELIVERY_FEE = 12;
const COUPONS = {
  DOCURA: { label: "Cupom Doçura", flat: 5 },
  BEMVINDA10: { label: "Boas-vindas 10%", pct: .10, needsUser: true }
};
let step = 1;
let coupon = couponStore.get();
if (coupon && (!COUPONS[coupon] || (COUPONS[coupon].needsUser && !user.get()))) { coupon = null; couponStore.set(null); }

const getMode = () => ($("input[name=mode]:checked") || {}).value || "entrega";
function totals() {
  const items = cart.all();
  const sub = Object.entries(items).reduce((s, [id, q]) => s + (byId(id) ? byId(id).price * q : 0), 0);
  const mode = getMode();
  const fee = sub > 0 && mode === "entrega" ? DELIVERY_FEE : 0;
  let disc = 0;
  if (coupon && sub > 0) { const c = COUPONS[coupon]; disc = c.flat ? Math.min(c.flat, sub) : Math.round(sub * c.pct * 100) / 100; }
  return { sub, fee, disc, total: Math.max(0, sub + fee - disc), mode };
}
function getForm() {
  return { name: $("#cName").value.trim(), wpp: $("#cWpp").value.trim(), mode: getMode(), addr: $("#cAddr").value.trim(), city: $("#cCity").value.trim(), note: $("#cNote").value.trim() };
}

function renderCart() {
  const items = cart.all(), ids = Object.keys(items).filter(byId), count = cart.count();
  $("#itemsLabel").textContent = count + (count === 1 ? " item" : " itens");
  $("#cartEmpty").hidden = ids.length > 0; $("#addMore").hidden = !ids.length;
  $("#lines").innerHTML = ids.map(id => { const p = byId(id); return `<div class="line-item"><div>${art(p)}</div><div><h3>${p.name}</h3><div class="small muted">${p.desc.split(".")[0]}</div><button class="link-btn mt-1" data-rm="${id}">${ico("trash")} Remover</button></div>
   <div class="li-end"><div class="qty mb-2"><button data-dec="${id}" aria-label="Menos uma unidade">${ico("minus")}</button><span>${items[id]}</span><button data-inc="${id}" aria-label="Mais uma unidade">${ico("plus")}</button></div><div class="price" style="font-size:1.1rem">${brl(p.price * items[id])}</div></div></div>`; }).join("");
  const t = totals(), C = coupon && COUPONS[coupon];
  $("#sumRows").innerHTML = `<div class="sum-row"><span>Subtotal dos doces</span><span>${brl(t.sub)}</span></div>
   <div class="sum-row"><span>Taxa de entrega</span><span>${t.fee ? brl(t.fee) : "Grátis"}</span></div>
   ${t.disc ? `<div class="sum-row ok-t"><span>${C.label}</span><span>− ${brl(t.disc)}</span></div>` : ""}
   <div class="sum-row sum-total"><span>Total</span><span>${brl(t.total)}</span></div>`;
  $("#coupon").value = coupon || "";
  renderStep();
}
function renderStep() {
  $$("#stepper li").forEach(li => { const s = +li.dataset.s; li.classList.toggle("on", s === step); li.classList.toggle("done", s < step); });
  [1, 2, 3].forEach(s => $("#step" + s).hidden = s !== step);
  const t = totals(), nb = $("#nextBtn");
  nb.disabled = cart.count() === 0;
  nb.innerHTML = step === 1 ? `Continuar para entrega ${ico("arrow")}` : step === 2 ? `Continuar para pagamento ${ico("arrow")}` : `${ico("check")} Confirmar pedido (${brl(t.total)})`;
  $("#backBtn").hidden = step === 1;
  if (step === 3) { const f = getForm(); $("#reviewBox").innerHTML = `${f.mode === "entrega" ? "Entrega para " + esc(f.addr) + ", " + esc(f.city) : "Retirada no ateliê"}<br>${esc(f.name)} • ${esc(f.wpp)}`; }
}
function syncMode() {
  const r = getMode() === "retirada";
  $("#addrBox").hidden = r; $("#cAddr").required = !r; $("#cCity").required = !r;
  renderCart();
}
function nextStep() {
  if (step === 1) { step = 2; const u = user.get(); if (u && !$("#cName").value) $("#cName").value = u.name; }
  else if (step === 2) {
    const f = $("#step2"); f.classList.add("was-validated");
    if (!f.checkValidity()) { const bad = $(":invalid", f); if (bad) bad.focus(); return; }
    step = 3;
  } else { placeOrder(); return; }
  renderCart(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
function placeOrder() {
  const f = getForm(), t = totals(), pay = $("input[name=pay]:checked").value;
  const items = Object.entries(cart.all()).filter(([id]) => byId(id)).map(([id, q]) => ({ name: byId(id).name, q, sub: byId(id).price * q }));
  const num = "CC-" + String(Math.floor(1000 + Math.random() * 9000));
  const lines = items.map(i => `• ${i.q}x ${i.name} (${brl(i.sub)})`).join("\n");
  const txt = `Olá, Cris! Gostaria de confirmar o pedido ${num}:\n${lines}\n\nSubtotal: ${brl(t.sub)}\nEntrega: ${t.fee ? brl(t.fee) : "Grátis"}${t.disc ? `\nDesconto: -${brl(t.disc)}` : ""}\nTotal: ${brl(t.total)}\n\nRecebimento: ${f.mode === "entrega" ? "Entrega - " + f.addr + ", " + f.city : "Retirada no ateliê"}\nPagamento: ${pay}\nNome: ${f.name} (${f.wpp})${f.note ? "\nObservação: " + f.note : ""}`;
  $("#waSend").href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(txt)}`;  $("#doneNum").textContent = num;
  $("#doneMsg").textContent = `Obrigada, ${f.name.split(" ")[0]}! Toque no botão abaixo para enviar o pedido e receber a confirmação da Cris no WhatsApp.`;
  $("#doneList").innerHTML = items.map(i => `<div class="sum-row"><span>${i.q}x ${esc(i.name)}</span><span>${brl(i.sub)}</span></div>`).join("") + `<div class="sum-row sum-total"><span>Total</span><span>${brl(t.total)}</span></div>`;
  cart.clear(); coupon = null; couponStore.set(null);
  $("#orderDone").hidden = false; $("#checkout").hidden = true; $("#stepper").hidden = true;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
function applyCoupon() {
  const code = $("#coupon").value.trim().toUpperCase(), m = $("#couponMsg");
  if (!code) { coupon = null; couponStore.set(null); renderCart(); m.textContent = ""; return; }
  const c = COUPONS[code];
  if (!c) { m.className = "coupon-msg err-t"; m.textContent = "Cupom não encontrado. Confira o código."; return; }
  if (c.needsUser && !user.get()) { m.className = "coupon-msg err-t"; m.innerHTML = 'Entre ou <a href="cadastro.html">cadastre-se</a> para usar este cupom.'; return; }
  coupon = code; couponStore.set(code); renderCart();
  $("#couponMsg").className = "coupon-msg ok-t"; $("#couponMsg").textContent = c.label + " aplicado.";
}
function setQty(id, q) { cart.set(id, q); renderCart(); }

$("#emptyArt").innerHTML = art(byId("pm-dl"));
document.addEventListener("click", e => {
  const t = e.target.closest("[data-rm],[data-inc],[data-dec]"); if (!t) return;
  const items = cart.all();
  if (t.dataset.rm) setQty(t.dataset.rm, 0);
  else if (t.dataset.inc) setQty(t.dataset.inc, items[t.dataset.inc] + 1);
  else setQty(t.dataset.dec, items[t.dataset.dec] - 1);
});
$("#nextBtn").addEventListener("click", nextStep);
$("#backBtn").addEventListener("click", () => { step = Math.max(1, step - 1); renderCart(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
$("#applyCoupon").addEventListener("click", applyCoupon);
$("#coupon").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } });
$$("input[name=mode]").forEach(r => r.addEventListener("change", syncMode));
syncMode();
})();
