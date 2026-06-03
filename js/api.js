// ─── SERVICE API ─────────────────────────────────────────────────────────────
// Toutes les communications avec le backend PHP passent par ici.

const API = {
  base: "/api",

  // ── Plats ──────────────────────────────────────────────────────────────────
  async getPlats() {
    const r = await fetch(`${this.base}/plats.php`);
    return r.json();
  },

  async ajouterPlat(plat) {
    const r = await fetch(`${this.base}/plats.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plat),
    });
    return r.json();
  },

  async modifierPlat(plat) {
    const r = await fetch(`${this.base}/plats.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plat),
    });
    return r.json();
  },

  async supprimerPlat(id) {
    const r = await fetch(`${this.base}/plats.php?id=${id}`, {
      method: "DELETE",
    });
    return r.json();
  },

  async toggleDispo(id, dispo) {
    const r = await fetch(`${this.base}/plats.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, dispo: dispo ? 1 : 0 }),
    });
    return r.json();
  },

  // ── Commandes ──────────────────────────────────────────────────────────────
  async getCommandes() {
    const r = await fetch(`${this.base}/commandes.php`);
    return r.json();
  },

  async creerCommande(commande) {
    const r = await fetch(`${this.base}/commandes.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commande),
    });
    return r.json();
  },

  // ── Paiement ───────────────────────────────────────────────────────────────
  async payerCommande(id, mode_paiement) {
    const r = await fetch(`${this.base}/paiement.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, mode_paiement }),
    });
    return r.json();
  },

  // ── Stats ──────────────────────────────────────────────────────────────────
  async getStats() {
    const r = await fetch(`${this.base}/stats.php`);
    return r.json();
  },
};
