package com.armandos.reservaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    // Si tienes un servicio de correo, descomenta la siguiente línea y su inyección:
    // @Autowired
    // private EmailService emailService;

    @PostMapping("/reservas")
    public ResponseEntity<String> crearReserva(@RequestBody Reserva reserva) {
        try {
            // 1. Guardar en la base de datos de PostgreSQL
            reservaRepository.save(reserva);

            // 2. Intentar enviar el correo (opcional, protegido con try-catch para que no bloquee)
            try {
                // emailService.enviarCorreoConfirmacion(reserva);
            } catch (Exception e) {
                System.err.println("Advertencia al enviar correo: " + e.getMessage());
            }

            // 3. Respuesta exitosa para desbloquear el botón en la página web
            return ResponseEntity.ok("¡Reservación creada con éxito!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la reserva: " + e.getMessage());
        }
    }
}