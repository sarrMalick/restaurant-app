<?php
require_once '../api/auth.php';
requireCaissier(); // ← Redirige vers login si pas connecté
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Caissier — <?= htmlspecialchars(RESTO_NOM) ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/theme.php">
</head>
<body>

  <header class="staff-header">
    <span class="staff-title">🖥 Caissier</span>
    <span style="font-size:12px;color:var(--text2);" id="caissier-date"></span>
    <a href="/caissier/logout.php" class="btn-logout">Déconnexion</a>
  </header>

  <main class="screen" style="padding-top:70px;">
    <div id="orders-list">
      <div class="empty-state"><span class="icon">⏳</span><p>Chargement des commandes...</p></div>
    </div>
  </main>

  <!-- MODAL PAIEMENT -->
  <div class="modal-bg" id="pay-modal-bg">
    <div class="modal">
      <h2>Encaisser</h2>
      <div class="pay-montant mono" id="pay-montant">0 F</div>
      <div class="pay-opts">
        <div class="pay-opt selected" id="opt-especes" onclick="selectPay('especes')">
          <div class="pay-opt-icon" style="background:#FAEEDA;">💵</div>
          <div><div style="font-weight:500;">Espèces</div><div class="muted">Paiement en main propre</div></div>
        </div>
        <div class="pay-opt" id="opt-wave" onclick="selectPay('wave')">
          <div class="pay-opt-icon" style="background:#E6F1FB;">🌊</div>
          <div><div style="font-weight:500;">Wave</div><div class="muted">Paiement mobile Wave</div></div>
        </div>
        <div class="pay-opt" id="opt-orange" onclick="selectPay('orange')">
          <div class="pay-opt-icon" style="background:#FAEEDA;">🟠</div>
          <div><div style="font-weight:500;">Orange Money</div><div class="muted">Paiement mobile OM</div></div>
        </div>
      </div>
      <button class="btn-primary" onclick="confirmerPaiement()">✅ Confirmer et imprimer ticket</button>
      <button class="btn-sm-cancel" style="width:100%;margin-top:8px;" onclick="closePay()">Annuler</button>
    </div>
  </div>

  <!-- MODAL TICKET -->
  <div class="modal-bg" id="ticket-modal-bg">
    <div class="modal" style="max-width:320px;">
      <div class="ticket" id="ticket-content"></div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn-primary" onclick="printTicket()">🖨 Imprimer</button>
        <button class="btn-outline" onclick="closeTicket()">Fermer</button>
      </div>
    </div>
  </div>

  <script src="../js/api.js"></script>
  <script src="../js/caissier.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', initCaissier);
    ['pay-modal-bg','ticket-modal-bg'].forEach(id => {
      document.getElementById(id).addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
      });
    });
  </script>
</body>
</html>
