/* sobre.js — história e valores */
(() => {
"use strict";
const { $, art, byId, reveal } = CC;
$("#aboutArt2").innerHTML = art(byId("pm-bb"), { bg: false });
const vals = [
  ["Mel 100% puro", "Florada pura de apicultores parceiros, sem xaropes artificiais."],
  ["Afeto em cada caixa", "Embalagens pensadas para emocionar, com laços e cartinhas feitas à mão."],
  ["Produção artesanal", "Lotes pequenos para cada doce sair do forno com frescor e textura impecáveis."],
  ["Transparência total", "Relação próxima e direta com os clientes pelo WhatsApp."]
];
$("#values").innerHTML = vals.map(([t, d], k) => `<div class="col-sm-6 col-lg-3 rv" style="--d:${k * 90}ms"><div class="value"><svg viewBox="0 0 24 24" style="fill:var(--honey);stroke:var(--honey-ink);stroke-width:1.4;stroke-linejoin:round" aria-hidden="true"><path d="M12 1.5l9 5.2v10.6L12 22.5 3 17.3V6.7z"/></svg><h3>${t}</h3><p class="muted mb-0">${d}</p></div></div>`).join("");
reveal();
})();
