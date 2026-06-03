<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<?php
require_once '../api/auth.php';

if (isAdmin()) {
    header('Location: /resto3/admin/');
    exit;
}

$erreur = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pwd = $_POST['password'] ?? '';
    if (login('admin', $pwd)) {
        header('Location: /resto3/admin/');
        exit;
    } else {
        $erreur = 'Mot de passe incorrect.';
    }
}
?>

<div class="login-screen">
  <div class="login-box">
    <div class="login-icon">⚙️</div>
    <h1 class="login-title">Espace Admin</h1>
    <p class="login-sub">Accès réservé au gérant</p>

    <?php if ($erreur): ?>
      <div class="login-error">❌ <?= htmlspecialchars($erreur) ?></div>
    <?php endif; ?>

    <form method="POST" action="">
      <div class="field">
        <label>Mot de passe</label>
        <input type="password" name="password" placeholder="••••••••" autofocus required>
      </div>
      <button type="submit" class="btn-primary">Se connecter</button>
    </form>
  </div>
</div>

</body>
</html>
