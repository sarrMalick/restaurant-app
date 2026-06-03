<?php
require_once 'connexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id   = $data['id']            ?? null;
$mode = $data['mode_paiement'] ?? null;

if (!$id || !$mode) {
    http_response_code(400);
    echo json_encode(['erreur' => 'Données manquantes']);
    exit;
}

$stmt = $pdo->prepare("UPDATE commandes SET statut='paye', mode_paiement=? WHERE id=?");
$stmt->execute([$mode, $id]);

echo json_encode(['message' => 'Paiement enregistré']);
