/* produtos.js — cardápio com filtros */
(() => {
"use strict";
const { $, PRODUCTS, CATS, card } = CC;
const filt = { cat: "all", q: "", sort: "rel" };

function readHash() { const h = location.hash.slice(1); filt.cat = CATS[h] ? h : "all"; }
function renderChips() {
  const all = [["all", "Todos os doces"], ...Object.entries(CATS).map(([k, v]) => [k, v.n])];
  $("#chips").innerHTML = all.map(([k, n]) => `<button class="chip" type="button" data-cat="${k}" aria-pressed="${filt.cat === k}">${n}</button>`).join("");
}
function renderGrid() {
  let L = PRODUCTS.filter(p => (filt.cat === "all" || p.cat === filt.cat) && (!filt.q || (p.name + " " + p.desc).toLowerCase().includes(filt.q)));
  if (filt.sort === "asc") L = [...L].sort((a, b) => a.price - b.price);
  if (filt.sort === "desc") L = [...L].sort((a, b) => b.price - a.price);
  if (filt.sort === "az") L = [...L].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  $("#grid").innerHTML = L.map((p, i) => card(p, i)).join("");
  $("#noResult").hidden = L.length > 0;
}
const refresh = () => { renderChips(); renderGrid(); };

$("#chips").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) { filt.cat = b.dataset.cat; refresh(); } });
$("#q").addEventListener("input", e => { filt.q = e.target.value.trim().toLowerCase(); renderGrid(); });
$("#sort").addEventListener("change", e => { filt.sort = e.target.value; renderGrid(); });
$("#clearFilters").addEventListener("click", () => { filt.cat = "all"; filt.q = ""; $("#q").value = ""; refresh(); });
window.addEventListener("hashchange", () => { readHash(); refresh(); });
readHash(); refresh();
})();
