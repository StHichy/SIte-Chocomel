/* index.js — página inicial */
(() => {
"use strict";
const { $, $$, art, CATS, byId, card, reveal, reduce, ico } = CC;

$("#pillIcon").innerHTML = ico("honey");

/* título animado palavra por palavra */
const ht = $("#heroTitle");
let n = 0;
ht.innerHTML = ht.innerHTML.split(/(<em>.*?<\/em>)/).map(seg => seg.startsWith("<em>")
  ? `<span class="word" style="animation-delay:${.08 * (n++) + .1}s">${seg}</span>`
  : seg.trim().split(/\s+/).filter(Boolean).map(w => `<span class="word" style="animation-delay:${.08 * (n++) + .1}s">${w}</span>`).join(" ")).join(" ");

/* cena do hero */
$("#sceneMain").innerHTML = art({ name: "Pão de mel", art: { k: "pao", g: "#4A2411", b: "#C27B35", f: "#F0C46A", d: "#E59E00" } }, { bg: false });
$("#sceneS1").innerHTML = art({ name: "Brigadeiros", art: { k: "brig4", cols: ["#3B1D0B", "#5A2E14", "#E8D2A4", "#2C1708"], spr: ["#fff", "#E59E00", "#C0392B"] } }, { bg: false });
$("#sceneS2").innerHTML = art({ name: "Cone", art: { k: "cone", s: "#E3B467", g: "#4A2411" } }, { bg: false });

/* faixa de sabores */
const words = ["Pão de mel", "Brigadeiro gourmet", "Cones trufados", "Caixas de presente", "Lembrancinhas", "Festas e casamentos"];
$("#marquee").innerHTML = [...words, ...words, ...words, ...words].map(w => `<span>${w}</span>`).join("");

/* destaques e categorias */
$("#featured").innerHTML = ["pm-nn", "cone-mc", "cx-enc"].map((id, i) => card(byId(id), i, "col-md-4 col-sm-6 rv")).join("");
$("#cats").innerHTML = Object.entries(CATS).map(([k, c], i) =>
  `<div class="col-6 col-lg-3 rv" style="--d:${i * 80}ms"><a class="catcard" href="produtos.html#${k}">${art(c.art)}<strong>${c.n}</strong></a></div>`).join("");
$("#aboutArt").innerHTML = art(byId("pm-dl"), { bg: false });

/* leve paralaxe na cena */
if (!reduce && matchMedia("(pointer:fine)").matches) {
  const sc = $("#scene"), hero = $(".hero");
  hero.addEventListener("pointermove", e => {
    const r = sc.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
    $$("[data-depth]", sc).forEach(el => { const d = +el.dataset.depth; el.style.transform = `translate(${x * d}px,${y * d}px)`; });
  });
}
reveal();
})();
