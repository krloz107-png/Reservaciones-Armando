package com.armandos.reservaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @PostMapping("/reservas")
    public ResponseEntity<String> crearReserva(@RequestBody Reserva reserva) {
        try {
            // 1. Guardar en la base de datos de PostgreSQL
            reservaRepository.save(reserva);

            // 2. Intentar enviar el correo de confirmación de forma segura
            try {
                if (mailSender != null) {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(reserva.getEmail());
                    message.setSubject("¡Mesa Confirmada! - Armando's Pescados y Mariscos");
                    message.setText("Hola " + reserva.getNombre() +
                            ", ¡Gracias por elegir Armando's Pescados y Mariscos! Tu reservación para " +
                            reserva.getPersonas() + " personas el día " + reserva.getFechaHora() +
                            " ha sido confirmada con éxito.");
                    mailSender.send(message);
                }
            } catch (Exception e) {
                System.err.println("Advertencia al enviar correo: " + e.getMessage());
            }

            // 3. Respuesta exitosa inmediata para desbloquear el navegador
            return ResponseEntity.ok("¡Reservación creada con éxito!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la reserva: " + e.getMessage());
        }
    }
}