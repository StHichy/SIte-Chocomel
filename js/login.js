/* login.js — entrar na conta (demonstração: nada é enviado a um servidor) */
(() => {
"use strict";
const { $, art, byId, user, toast, cart } = CC;

$("#authArt").innerHTML = art(byId("pm-nn"), { bg: false });

function nameFrom(v) {
  const s = v.split("@")[0].replace(/[._\d-]+/g, " ").trim();
  return s ? s.replace(/\b\w/g, c => c.toUpperCase()) : "Cliente";
}
function paint() {
  const u = user.get();
  $("#authBox").hidden = !!u; $("#loggedBox").hidden = !u;
  if (u) $("#loggedName").textContent = "Olá, " + u.name.split(" ")[0] + "!";
}
$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target; f.classList.add("was-validated");
  if (!f.checkValidity()) return;
  user.set({ name: nameFrom($("#lEmail").value) });
  toast("Bem-vindo de volta, " + user.get().name.split(" ")[0] + "!");
  setTimeout(() => { location.href = cart.count() ? "carrinho.html" : "produtos.html"; }, 700);
});
$("#logoutBtn").addEventListener("click", () => { user.clear(); paint(); toast("Você saiu da conta."); });
paint();
})();
