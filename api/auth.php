<?php
session_start();

$_env = parse_ini_file(__DIR__ . '/../.env');
define('CAISSIER_PWD', $_env['CAISSIER_PWD'] ?? '');
define('ADMIN_PWD',    $_env['ADMIN_PWD']    ?? '');
define('RESTO_NOM',    $_env['RESTO_NOM']    ?? 'Mon Restaurant');
define('RESTO_VILLE',  $_env['RESTO_VILLE']  ?? '');
define('RESTO_DEVISE', $_env['RESTO_DEVISE'] ?? 'FCFA');

// ── Vérifie si le caissier est connecté ───────────────────────────────────
function isCaissier() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'caissier';
}

// ── Vérifie si l'admin est connecté ───────────────────────────────────────
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// ── Protège une page caissier ─────────────────────────────────────────────
function requireCaissier() {
    if (!isCaissier()) {
        header('Location: /caissier/login.php');
        exit;
    }
}

// ── Protège une page admin ────────────────────────────────────────────────
function requireAdmin() {
    if (!isAdmin()) {
        header('Location: /admin/login.php');
        exit;
    }
}

// ── Connexion ─────────────────────────────────────────────────────────────
function login($role, $password) {
    if ($role === 'caissier' && $password === CAISSIER_PWD) {
        $_SESSION['role'] = 'caissier';
        return true;
    }
    if ($role === 'admin' && $password === ADMIN_PWD) {
        $_SESSION['role'] = 'admin';
        return true;
    }
    return false;
}

// ── Déconnexion ───────────────────────────────────────────────────────────
function logout() {
    session_destroy();
}
