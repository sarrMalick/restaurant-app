<?php
require_once 'connexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée']);
    exit;
}

// Commandes du jour
$today = date('Y-m-d');
$stmt  = $pdo->prepare("SELECT COUNT(*) as total FROM commandes WHERE DATE(created_at) = ?");
$stmt->execute([$today]);
$commandes_today = $stmt->fetch()['total'];

// CA du jour
$stmt = $pdo->prepare("SELECT COALESCE(SUM(total),0) as ca FROM commandes WHERE statut='paye' AND DATE(created_at) = ?");
$stmt->execute([$today]);
$ca = $stmt->fetch()['ca'];

// Paiements mobile
$stmt = $pdo->prepare("SELECT COUNT(*) as total FROM commandes WHERE statut='paye' AND mode_paiement IN ('wave','orange') AND DATE(created_at) = ?");
$stmt->execute([$today]);
$mobile = $stmt->fetch()['total'];

// Plats disponibles
$stmt  = $pdo->query("SELECT COUNT(*) as total FROM plats WHERE dispo=1");
$dispo = $stmt->fetch()['total'];

echo json_encode([
    'commandes_today' => $commandes_today,
    'ca'              => $ca,
    'mobile'          => $mobile,
    'plats_dispo'     => $dispo,
]);
