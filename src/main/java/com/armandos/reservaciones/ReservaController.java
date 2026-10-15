package com.armandos.reservaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService service;

    @PostMapping
    public ResponseEntity<String> crearReserva(@RequestBody Reserva reserva) {
        String resultado = service.procesarReserva(reserva);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(resultado);
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Reserva>> verReservas() {
        return ResponseEntity.ok(service.obtenerTodasLasReservas());
    }
}
