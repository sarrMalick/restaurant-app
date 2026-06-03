// ─── VUE ADMIN ───────────────────────────────────────────────────────────────
let platsAdmin = [];
let ordersAdmin = [];
let editPlatId = null;

async function initAdmin() {
  await loadConfig();
  await chargerTout();
}

async function chargerTout() {
  try {
    [platsAdmin, ordersAdmin] = await Promise.all([API.getPlats(), API.getCommandes()]);
    renderAdmin();
  } catch(e) {
    console.error('Erreur chargement admin:', e);
  }
}

async function renderAdmin() {
  await updateAdminStats();

  const CAT_COLORS = { 'Entrées':'#378ADD','Plats':'#1D9E75','Desserts':'#D4537E','Boissons':'#BA7517' };

  document.getElementById('admin-plats').innerHTML = platsAdmin.map(p => `
    <div class="admin-plat-row">
      <div style="width:8px;height:8px;border-radius:50%;background:${CAT_COLORS[p.categorie]||'#888'};flex-shrink:0;"></div>
      <div class="admin-plat-nom">${p.nom}<span class="admin-plat-cat">${p.categorie}</span></div>
      <div class="admin-prix">${parseInt(p.prix).toLocaleString('fr-FR')} ${APP_CONFIG.devise}</div>
      <button class="dispo-btn ${p.dispo?'dispo-on':'dispo-off'}" onclick="toggleDispoAdmin(${p.id}, ${p.dispo})">${p.dispo?'Dispo':'Indispo'}</button>
      <button class="icon-btn" onclick="openFormModal(${p.id})">✏️</button>
      <button class="icon-btn" onclick="deletePlatAdmin(${p.id})">🗑</button>
    </div>
  `).join('');

  const hist = document.getElementById('admin-orders-history');
  if (!ordersAdmin.length) {
    hist.innerHTML = '<div style="font-size:13px;color:var(--text2);text-align:center;padding:10px;">Aucune commande</div>';
    return;
  }
  hist.innerHTML = ordersAdmin.slice(0,10).map(o => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px;gap:6px;">
      <span style="font-family:monospace;">${o.numero}</span>
      <span style="color:var(--text2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.client_nom} · T.${o.table_num}</span>
      <span class="status-badge ${o.statut==='paye'?'s-paye':'s-attente'}">${o.statut==='paye'?'Payé':'Attente'}</span>
      <span style="color:var(--green);font-weight:600;flex-shrink:0;">${parseInt(o.total).toLocaleString('fr-FR')} ${APP_CONFIG.devise}</span>
    </div>
  `).join('');
}

async function updateAdminStats() {
  try {
    const stats = await API.getStats();
    document.getElementById('a-commandes').textContent = stats.commandes_today;
    document.getElementById('a-ca').textContent = parseInt(stats.ca).toLocaleString('fr-FR') + ' ' + APP_CONFIG.devise;
    document.getElementById('a-dispo').textContent = stats.plats_dispo;
    document.getElementById('a-mobile').textContent = stats.mobile;
  } catch(e) {}
}

async function toggleDispoAdmin(id, dispo) {
  await API.toggleDispo(id, !dispo);
  await chargerTout();
}

async function deletePlatAdmin(id) {
  if (!confirm('Supprimer ce plat ?')) return;
  await API.supprimerPlat(id);
  await chargerTout();
}

function openFormModal(id) {
  editPlatId = id || null;
  if (id) {
    const p = platsAdmin.find(x => x.id == id);
    document.getElementById('form-modal-title').textContent = 'Modifier le plat';
    document.getElementById('af-nom').value   = p.nom;
    document.getElementById('af-cat').value   = p.categorie;
    document.getElementById('af-prix').value  = p.prix;
    document.getElementById('af-dispo').checked = !!p.dispo;
  } else {
    document.getElementById('form-modal-title').textContent = 'Ajouter un plat';
    document.getElementById('af-nom').value   = '';
    document.getElementById('af-cat').value   = 'Plats';
    document.getElementById('af-prix').value  = '';
    document.getElementById('af-dispo').checked = true;
  }
  document.getElementById('form-modal-bg').classList.add('open');
}

function closeFormModal() { document.getElementById('form-modal-bg').classList.remove('open'); }

async function saveAdminPlat() {
  const nom   = document.getElementById('af-nom').value.trim();
  const cat   = document.getElementById('af-cat').value;
  const prix  = parseInt(document.getElementById('af-prix').value) || 0;
  const dispo = document.getElementById('af-dispo').checked ? 1 : 0;
  if (!nom) return;

  if (editPlatId) {
    await API.modifierPlat({ id: editPlatId, nom, categorie: cat, prix, dispo });
  } else {
    await API.ajouterPlat({ nom, categorie: cat, prix, dispo });
  }
  closeFormModal();
  await chargerTout();
}
