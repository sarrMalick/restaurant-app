<?php
header('Content-Type: text/css');
$_env = parse_ini_file(__DIR__ . '/../.env');
$c = $_env['RESTO_COULEUR'] ?? '#1D9E75';

function darken($hex, $pct) {
    $hex = ltrim($hex, '#');
    $r = round(hexdec(substr($hex,0,2)) * (1 - $pct/100));
    $g = round(hexdec(substr($hex,2,2)) * (1 - $pct/100));
    $b = round(hexdec(substr($hex,4,2)) * (1 - $pct/100));
    return sprintf('#%02x%02x%02x', $r, $g, $b);
}

function lighten($hex, $pct) {
    $hex = ltrim($hex, '#');
    $r = round(hexdec(substr($hex,0,2)) + (255 - hexdec(substr($hex,0,2))) * $pct/100);
    $g = round(hexdec(substr($hex,2,2)) + (255 - hexdec(substr($hex,2,2))) * $pct/100);
    $b = round(hexdec(substr($hex,4,2)) + (255 - hexdec(substr($hex,4,2))) * $pct/100);
    return sprintf('#%02x%02x%02x', $r, $g, $b);
}
?>
:root {
  --green:       <?= $c ?>;
  --green-dark:  <?= darken($c, 30) ?>;
  --green-light: <?= lighten($c, 85) ?>;
}
