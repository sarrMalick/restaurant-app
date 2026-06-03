<?php
require_once '../api/auth.php';
logout();
header('Location: /caissier/login.php');
exit;
