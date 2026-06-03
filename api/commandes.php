<?php
require_once 'connexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ── GET : liste toutes les commandes avec leurs items ─────────────────
    case 'GET':
        $commandes = $pdo->query("SELECT * FROM commandes ORDER BY created_at DESC")->fetchAll();
        foreach ($commandes as &$cmd) {
            $stmt = $pdo->prepare("SELECT * FROM commande_items WHERE commande_id = ?");
            $stmt->execute([$cmd['id']]);
            $cmd['items'] = $stmt->fetchAll();
        }
        echo json_encode($commandes);
        break;

    // ── POST : créer une nouvelle commande ────────────────────────────────
    case 'POST':
        $data   = json_decode(file_get_contents('php://input'), true);
        $numero = '#' . str_pad($data['numero'], 3, '0', STR_PAD_LEFT);

        // Insérer la commande
        $stmt = $pdo->prepare("INSERT INTO commandes (numero, client_nom, table_num, note, total, statut) VALUES (?, ?, ?, ?, ?, 'attente')");
        $stmt->execute([$numero, $data['client_nom'], $data['table_num'], $data['note'] ?? '', $data['total']]);
        $commande_id = $pdo->lastInsertId();

        // Insérer les items
        foreach ($data['items'] as $item) {
            $stmt = $pdo->prepare("INSERT INTO commande_items (commande_id, plat_id, plat_nom, plat_prix, quantite) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$commande_id, $item['plat_id'], $item['plat_nom'], $item['plat_prix'], $item['quantite']]);
        }

        echo json_encode(['id' => $commande_id, 'numero' => $numero, 'message' => 'Commande créée']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erreur' => 'Méthode non autorisée']);
}
