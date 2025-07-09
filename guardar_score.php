<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Obtener los datos del body
$data = json_decode(file_get_contents("php://input"), true);

// Ruta del archivo donde se guardan los puntajes
$archivo = "scores.json";

// Leer el contenido actual del archivo
if (file_exists($archivo)) {
    $puntajes = json_decode(file_get_contents($archivo), true);
    if (!is_array($puntajes)) $puntajes = [];
} else {
    $puntajes = [];
}

// Agregar el nuevo puntaje
$puntajes[] = $data;

// Ordenar por puntaje descendente
usort($puntajes, function ($a, $b) {
    return $b["score"] - $a["score"];
});

// Guardar los datos actualizados en el archivo
file_put_contents($archivo, json_encode($puntajes, JSON_PRETTY_PRINT));

// Devolver respuesta
echo json_encode(["status" => "ok", "message" => "Score saved"]);
