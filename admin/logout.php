<?php
require_once '../api/auth.php';
logout();
header('Location: /admin/login.php');
exit;
