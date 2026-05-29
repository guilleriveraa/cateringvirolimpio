<?php
// api/enviar-contacto.php

// Permitir peticiones desde tu frontend (CORS)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Cargar PHPMailer (ruta correcta desde la carpeta api)
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ========== CONFIGURACIÓN (CAMBIA ESTOS DATOS) ==========
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'guilleriveraa12@gmail.com');        // ← CAMBIA A TU CORREO
define('SMTP_PASS', 'opff vcya khlr yenl');      // ← CONTRASEÑA DE APLICACIÓN
define('SMTP_PORT', 587);
define('DEST_EMAIL', 'guilleriveraa12@gmail.com');    // ← DONDE RECIBIR CORREOS

// Recibir datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Validar que llegaron datos
if (!$data) {
    echo json_encode(['error' => 'No se recibieron datos']);
    exit;
}

// Validar campos obligatorios
if (empty($data['nombre']) || empty($data['email']) || empty($data['mensaje'])) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;
    $mail->setLanguage('es');

    // Remitente y destinatario
    $mail->setFrom(SMTP_USER, 'Catering Viró');
    $mail->addAddress(DEST_EMAIL);
    $mail->addReplyTo($data['email'], $data['nombre']);

    // Mapear motivo
    $motivos = [
        'reserva' => '📅 Reserva / Presupuesto',
        'consulta' => '❓ Consulta general',
        'menu' => '🍽️ Pregunta sobre menús',
        'espacio' => '🏛️ Consulta sobre espacios'
    ];
    $motivoTexto = $motivos[$data['motivo']] ?? $data['motivo'] ?? 'No especificado';

    // Asunto y contenido
    $mail->Subject = "Nuevo mensaje - {$motivoTexto}";
    $mail->isHTML(true);
    $mail->Body = "
        <h2>📋 Nuevo mensaje desde Catering Viró</h2>
        <p><strong>🎯 Motivo:</strong> {$motivoTexto}</p>
        <p><strong>👤 Nombre:</strong> " . htmlspecialchars($data['nombre']) . "</p>
        <p><strong>📧 Email:</strong> " . htmlspecialchars($data['email']) . "</p>
        <p><strong>📞 Teléfono:</strong> " . htmlspecialchars($data['telefono'] ?? 'No especificado') . "</p>
        <p><strong>💬 Mensaje:</strong><br>" . nl2br(htmlspecialchars($data['mensaje'])) . "</p>
    ";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);

} catch (Exception $e) {
    echo json_encode(['error' => "Error al enviar: {$mail->ErrorInfo}"]);
}
?>