<?php
header('Content-Type: application/json');
$_env = parse_ini_file(__DIR__ . '/../.env');
echo json_encode([
    'nom'    => $_env['RESTO_NOM']    ?? 'Mon Restaurant',
    'ville'  => $_env['RESTO_VILLE']  ?? '',
    'devise' => $_env['RESTO_DEVISE'] ?? 'FCFA',
]);
