// ─── VUE CAISSIER ────────────────────────────────────────────────────────────
let orders = [];
let currentPayOrderId = null;
let selectedPayMode   = 'especes';

async function initCaissier() {
  await loadConfig();
  const d = new Date();
  document.getElementById('caissier-date').textContent =
    d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
  chargerCommandes();
  // Rafraîchit toutes les 5 secondes
  setInterval(chargerCommandes, 5000);
}

async function chargerCommandes() {
  try {
    orders = await API.getCommandes();
    renderOrders();
  } catch(e) {
    console.error('Erreur chargement commandes:', e);
  }
}

function renderOrders() {
  const el = document.getElementById('orders-list');
  if (!orders.length) {
    el.innerHTML = `<div class="empty-state"><span class="icon">⏳</span><p>Aucune commande pour l'instant</p></div>`;
    return;
  }
  el.innerHTML = orders.map(o => {
    const h = new Date(o.created_at).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    const itemsStr = o.items.map(i => `${i.quantite}× ${i.plat_nom}`).join(', ');
    return `<div class="order-card">
      <div class="order-head">
        <div>
          <div class="order-num">${o.numero} — ${o.client_nom}</div>
          <div class="order-meta">Table ${o.table_num} · ${h}${o.note ? ' · 📝 '+o.note : ''}</div>
        </div>
        <span class="status-badge ${o.statut==='paye'?'s-paye':'s-attente'}">${o.statut==='paye'?'✓ Payé':'En attente'}</span>
      </div>
      <div class="order-items-txt">${itemsStr}</div>
      <div class="order-total-txt">${parseInt(o.total).toLocaleString('fr-FR')} ${APP_CONFIG.devise}</div>
      <div class="order-actions">
        ${o.statut==='attente' ? `<button class="btn-primary" style="width:auto;padding:8px 14px;font-size:13px;" onclick="openPay(${o.id})">💳 Encaisser</button>` : ''}
        <button class="btn-outline" onclick="showTicket(${o.id})">🧾 Ticket</button>
      </div>
    </div>`;
  }).join('');
}

function openPay(id) {
  currentPayOrderId = id;
  selectedPayMode = 'especes';
  const o = orders.find(x => x.id == id);
  document.getElementById('pay-montant').textContent = parseInt(o.total).toLocaleString('fr-FR') + ' ' + APP_CONFIG.devise;
  document.querySelectorAll('.pay-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('opt-especes').classList.add('selected');
  document.getElementById('pay-modal-bg').classList.add('open');
}

function selectPay(mode) {
  selectedPayMode = mode;
  document.querySelectorAll('.pay-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('opt-' + mode).classList.add('selected');
}

function closePay() { document.getElementById('pay-modal-bg').classList.remove('open'); }

async function confirmerPaiement() {
  try {
    await API.payerCommande(currentPayOrderId, selectedPayMode);
    closePay();
    await chargerCommandes();
    showTicket(currentPayOrderId);
  } catch(e) {
    alert('Erreur lors du paiement. Réessayez.');
  }
}

function showTicket(id) {
  const o = orders.find(x => x.id == id); if (!o) return;
  const dt = new Date(o.created_at).toLocaleString('fr-FR');
  const modeLabel = { especes:'Espèces', wave:'Wave', orange:'Orange Money' }[o.mode_paiement] || '—';
  document.getElementById('ticket-content').innerHTML = `
    <div class="ticket-header">
      <div class="ticket-resto">${APP_CONFIG.logo ? `<img src="${APP_CONFIG.logo}" style="height:20px;vertical-align:middle;margin-right:4px;">` : APP_CONFIG.emoji} ${APP_CONFIG.nom.toUpperCase()}</div>
      <div class="ticket-sub">${APP_CONFIG.ville}</div>
      <div class="ticket-sub" style="margin-top:4px;">${dt}</div>
      <div class="ticket-sub">Cmd ${o.numero} · Table ${o.table_num}</div>
      <div class="ticket-sub">Client : ${o.client_nom}</div>
      ${o.note ? `<div class="ticket-sub">Note : ${o.note}</div>` : ''}
    </div>
    <hr class="ticket-sep">
    ${o.items.map(i=>`<div class="ticket-row"><span>${i.quantite}x ${i.plat_nom}</span><span>${(parseInt(i.plat_prix)*i.quantite).toLocaleString('fr-FR')} ${APP_CONFIG.devise}</span></div>`).join('')}
    <hr class="ticket-sep">
    <div class="ticket-total-row"><span>TOTAL</span><span>${parseInt(o.total).toLocaleString('fr-FR')} ${APP_CONFIG.devise}</span></div>
    ${o.mode_paiement ? `<div class="ticket-pay-mode">Payé par ${modeLabel}</div>` : '<div class="ticket-pay-mode" style="color:#999;">En attente de paiement</div>'}
    <div class="ticket-footer">Merci pour votre visite !<br>À bientôt 😊</div>
  `;
  document.getElementById('ticket-modal-bg').classList.add('open');
}

function closeTicket() { document.getElementById('ticket-modal-bg').classList.remove('open'); }

function printTicket() {
  const content = document.getElementById('ticket-content').innerHTML;
  const w = window.open('','','width=400,height=600');
  w.document.write(`<html><head><style>
    body{font-family:monospace;padding:20px;font-size:12px;}
    .ticket-header{text-align:center;border-bottom:1px dashed #ccc;padding-bottom:10px;margin-bottom:10px;}
    .ticket-resto{font-size:15px;font-weight:bold;}
    .ticket-sub{font-size:10px;color:#666;margin-top:2px;}
    .ticket-row{display:flex;justify-content:space-between;margin:3px 0;}
    .ticket-sep{border:none;border-top:1px dashed #ccc;margin:8px 0;}
    .ticket-total-row{display:flex;justify-content:space-between;font-weight:bold;font-size:14px;}
    .ticket-pay-mode{text-align:center;color:green;font-weight:bold;margin-top:6px;}
    .ticket-footer{text-align:center;font-size:10px;color:#999;margin-top:10px;border-top:1px dashed #ccc;padding-top:8px;}
  </style></head><body>${content}</body></html>`);
  w.document.close(); w.focus(); w.print(); w.close();
}
