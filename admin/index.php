<?php
require_once '../api/auth.php';
requireAdmin(); // ← Redirige vers login si pas connecté
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — <?= htmlspecialchars(RESTO_NOM) ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <header class="staff-header">
    <span class="staff-title">⚙️ Admin</span>
    <a href="/admin/logout.php" class="btn-logout">Déconnexion</a>
  </header>

  <main class="screen" style="padding-top:70px;">

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-val mono" id="a-commandes">—</div><div class="stat-lbl">Commandes aujourd'hui</div></div>
      <div class="stat-card"><div class="stat-val mono" id="a-ca">—</div><div class="stat-lbl">Chiffre d'affaires</div></div>
      <div class="stat-card"><div class="stat-val mono" id="a-dispo">—</div><div class="stat-lbl">Plats disponibles</div></div>
      <div class="stat-card"><div class="stat-val mono" id="a-mobile">—</div><div class="stat-lbl">Paiements mobile</div></div>
    </div>

    <div class="card">
      <div class="section-header">
        <span class="section-title">Menu</span>
        <button class="btn-outline" onclick="openFormModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>
      <div id="admin-plats"></div>
    </div>

    <div class="card">
      <div class="section-title" style="margin-bottom:12px;">Historique des commandes</div>
      <div id="admin-orders-history"></div>
    </div>

  </main>

  <!-- MODAL PLAT -->
  <div class="modal-bg" id="form-modal-bg">
    <div class="modal">
      <h2 id="form-modal-title">Ajouter un plat</h2>
      <div class="field"><label>Nom du plat</label><input type="text" id="af-nom" placeholder="Ex: Thiéboudienne"></div>
      <div class="fields-row">
        <div class="field"><label>Catégorie</label>
          <select id="af-cat">
            <option>Entrées</option><option selected>Plats</option>
            <option>Desserts</option><option>Boissons</option>
          </select>
        </div>
        <div class="field"><label>Prix (<?= htmlspecialchars(RESTO_DEVISE) ?>)</label><input type="number" id="af-prix" placeholder="3500" min="0"></div>
      </div>
      <div class="toggle-row">
        <span>Disponible dès maintenant</span>
        <label class="toggle"><input type="checkbox" id="af-dispo" checked><span class="toggle-slider"></span></label>
      </div>
      <div class="modal-actions">
        <button class="btn-sm-cancel" onclick="closeFormModal()">Annuler</button>
        <button class="btn-sm-ok" onclick="saveAdminPlat()">Enregistrer</button>
      </div>
    </div>
  </div>

  <script src="../js/api.js"></script>
  <script src="../js/admin.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', initAdmin);
    document.getElementById('form-modal-bg').addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('open');
    });
  </script>
</body>
</html>
