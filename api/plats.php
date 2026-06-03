<?php
require_once 'connexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ── GET : liste tous les plats ─────────────────────────────────────────
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM plats ORDER BY categorie, nom");
        echo json_encode($stmt->fetchAll());
        break;

    // ── POST : ajouter un plat ────────────────────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO plats (nom, categorie, prix, dispo) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['nom'], $data['categorie'], $data['prix'], $data['dispo'] ?? 1]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Plat ajouté']);
        break;

    // ── PUT : modifier un plat ────────────────────────────────────────────
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE plats SET nom=?, categorie=?, prix=?, dispo=? WHERE id=?");
        $stmt->execute([$data['nom'], $data['categorie'], $data['prix'], $data['dispo'], $data['id']]);
        echo json_encode(['message' => 'Plat modifié']);
        break;

    // ── DELETE : supprimer un plat ────────────────────────────────────────
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { echo json_encode(['erreur' => 'ID manquant']); break; }
        $stmt = $pdo->prepare("DELETE FROM plats WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Plat supprimé']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erreur' => 'Méthode non autorisée']);
}
