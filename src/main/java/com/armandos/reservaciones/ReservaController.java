package com.armandos.reservaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService service;

    @PostMapping("/reservas")
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        try {
            // 1. Guardar en la base de datos (esto ya funciona)
            reservaRepository.save(reserva);

            // 2. Intentar enviar el correo (si falla, no debe romper la respuesta al usuario)
            try {
                emailService.enviarCorreoConfirmacion(reserva);
            } catch (Exception e) {
                System.err.println("Advertencia: No se pudo enviar el correo, pero la reserva se guardó: " + e.getMessage());
            }

            // 3. RESPUESTA EXITOSA OBLIGATORIA PARA EL NAVEGADOR
            return ResponseEntity.ok().body(Map.of("success", true, "message", "¡Reservación creada con éxito!"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<java.util.List<Reserva>> verReservas() {
        return ResponseEntity.ok(service.obtenerTodasLasReservas());
    }
}
