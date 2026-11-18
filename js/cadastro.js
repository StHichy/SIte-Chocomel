/* cadastro.js — criar conta (demonstração: nada é enviado a um servidor) */
(() => {
"use strict";
const { $, art, byId, user, toast } = CC;

$("#authArt").innerHTML = art(byId("pm-bb"), { bg: false });

function paint() {
  const u = user.get();
  $("#authBox").hidden = !!u; $("#loggedBox").hidden = !u;
  if (u) $("#loggedName").textContent = "Conta criada, " + u.name.split(" ")[0] + "!";
}
$("#regForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target; f.classList.add("was-validated");
  if (!f.checkValidity()) return;
  user.set({ name: $("#rName").value.trim() });
  f.reset(); f.classList.remove("was-validated");
  toast("Conta criada! Seu cupom é BEMVINDA10");
  paint();
});
$("#logoutBtn").addEventListener("click", () => { user.clear(); paint(); toast("Você saiu da conta."); });
paint();
})();
