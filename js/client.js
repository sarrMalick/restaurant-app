// ─── VUE CLIENT ──────────────────────────────────────────────────────────────
let plats = [];
let panier = {};
let filterMenuCat = 'Tous';
let nextOrderNum = 1;

const CAT_COLORS = {
  'Entrées': '#378ADD', 'Plats': '#1D9E75',
  'Desserts': '#D4537E', 'Boissons': '#BA7517'
};

async function initClient() {
  afficherChargement();
  try {
    plats = await API.getPlats();
    // Récupère le prochain numéro de commande
    const commandes = await API.getCommandes();
    nextOrderNum = commandes.length + 1;
  } catch(e) {
    afficherErreur('Impossible de charger le menu. Vérifiez votre connexion.');
    return;
  }
  renderMenu();
}

function afficherChargement() {
  document.getElementById('menu-grid').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text2);">
      Chargement du menu...
    </div>`;
}

function afficherErreur(msg) {
  document.getElementById('menu-grid').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:2rem;color:#993C1D;">
      ❌ ${msg}
    </div>`;
}

function renderMenu() {
  const cats = ['Tous', ...new Set(plats.map(p => p.categorie))];
  document.getElementById('menu-cats').innerHTML = cats.map(c =>
    `<button class="cat-pill${c === filterMenuCat ? ' active' : ''}" onclick="setMenuCat('${c}')">${c}</button>`
  ).join('');

  const visible = filterMenuCat === 'Tous' ? plats : plats.filter(p => p.categorie === filterMenuCat);
  document.getElementById('menu-grid').innerHTML = visible.map(p => {
    const qty = panier[p.id] || 0;
    return `<div class="menu-item${p.dispo ? '' : ' indispo'}" onclick="addToCart(${p.id})">
      <div class="item-dot" style="background:${CAT_COLORS[p.categorie]||'#888'}"></div>
      ${qty > 0 ? `<div class="item-qty">${qty}</div>` : ''}
      <div class="item-nom">${p.nom}</div>
      <div class="item-prix">${parseInt(p.prix).toLocaleString('fr-FR')} F</div>
    </div>`;
  }).join('');

  renderPanier();
}

function setMenuCat(cat) { filterMenuCat = cat; renderMenu(); }

function addToCart(id) { panier[id] = (panier[id] || 0) + 1; renderMenu(); }

function changeQty(id, d) {
  panier[id] = (panier[id] || 0) + d;
  if (panier[id] <= 0) delete panier[id];
  renderMenu();
}

function getTotal() {
  return Object.entries(panier).reduce((s, [id, q]) => {
    const p = plats.find(x => x.id == id);
    return s + (p ? parseInt(p.prix) * q : 0);
  }, 0);
}

function renderPanier() {
  const items = Object.entries(panier).filter(([, q]) => q > 0);
  const el = document.getElementById('panier-items');
  if (!items.length) {
    el.innerHTML = '<div class="panier-empty">Aucun plat sélectionné</div>';
    document.getElementById('panier-total').style.display = 'none';
    document.getElementById('btn-envoyer').disabled = true;
    return;
  }
  el.innerHTML = items.map(([id, qty]) => {
    const p = plats.find(x => x.id == id); if (!p) return '';
    return `<div class="panier-row">
      <div class="panier-nom">${p.nom}</div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${id},-1)">−</button>
        <div class="qty-num">${qty}</div>
        <button class="qty-btn" onclick="changeQty(${id},+1)">+</button>
      </div>
      <div class="panier-sous">${(parseInt(p.prix)*qty).toLocaleString('fr-FR')} F</div>
    </div>`;
  }).join('');
  document.getElementById('panier-total').style.display = 'flex';
  document.getElementById('total-val').textContent = getTotal().toLocaleString('fr-FR') + ' F';
  document.getElementById('btn-envoyer').disabled = false;
}

async function envoyerCommande() {
  const nom   = document.getElementById('client-nom').value.trim() || 'Client';
  const table = document.getElementById('table-num').value || '?';
  const note  = document.getElementById('client-note').value.trim();

  const items = Object.entries(panier).filter(([,q])=>q>0).map(([id,qty]) => {
    const p = plats.find(x => x.id == id);
    return { plat_id: p.id, plat_nom: p.nom, plat_prix: parseInt(p.prix), quantite: parseInt(qty) };
  });

  if (!items.length) return;

  const btn = document.getElementById('btn-envoyer');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';

  try {
    const result = await API.creerCommande({
      numero: nextOrderNum++,
      client_nom: nom,
      table_num: table,
      note,
      total: getTotal(),
      items
    });

    document.getElementById('confirm-num').textContent = result.numero;
    document.getElementById('confirm-modal-bg').classList.add('open');
    panier = {};

  } catch(e) {
    alert('Erreur lors de l\'envoi. Réessayez.');
    btn.disabled = false;
    btn.textContent = 'Envoyer la commande';
  }
}

function nouvelleCommande() {
  filterMenuCat = 'Tous';
  panier = {};
  document.getElementById('confirm-modal-bg').classList.remove('open');
  document.getElementById('client-nom').value = '';
  document.getElementById('table-num').value = '';
  document.getElementById('client-note').value = '';
  renderMenu();
}
