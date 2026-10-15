package com.armandos.reservaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository repository;

    // Inyectamos la herramienta de correos de Spring
    @Autowired
    private JavaMailSender mailSender;

    public String procesarReserva(Reserva nuevaReserva) {
        LocalDateTime fechaHoraSolicitada = nuevaReserva.getFechaHora();

        if (fechaHoraSolicitada.isBefore(LocalDateTime.now())) {
            return "Error: No puedes reservar en una fecha u hora que ya ha pasado.";
        }
        // 1. Validar horario (Solo entre 8:00 y 20:00)
        int hora = fechaHoraSolicitada.getHour();
        if (hora < 8 || hora > 20) {
            return "Error: Las reservaciones solo están disponibles entre las 08:00 y las 20:00 horas.";
        }

        // 2. Validar capacidad
        LocalDateTime inicioRango = fechaHoraSolicitada.minusHours(2);
        LocalDateTime finRango = fechaHoraSolicitada.plusHours(2);

        Integer personasOcupando = repository.sumarPersonasEnRango(inicioRango, finRango);

        if ((personasOcupando + nuevaReserva.getPersonas()) > 200) {
            return "Error: Lo sentimos, no hay capacidad suficiente para esa hora. Lugares disponibles: " + (200 - personasOcupando);
        }

        // 3. Guardar en base de datos
        repository.save(nuevaReserva);

        // 4. Enviar correo de confirmación
        enviarCorreoConfirmacion(nuevaReserva);

        return "Éxito: Reservación confirmada.";
    }

    // Método privado para armar y enviar el correo
    private void enviarCorreoConfirmacion(Reserva reserva) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom("tu_correo_del_restaurante@gmail.com"); // Debe coincidir con el application.properties
            mensaje.setTo(reserva.getEmail());
            mensaje.setSubject("¡Mesa Confirmada! - Armando's Pescados y Mariscos \uD83D\uDC1F");

            // Damos formato a la fecha para que se lea mejor
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy 'a las' HH:mm");
            String fechaFormateada = reserva.getFechaHora().format(formatter);

            String texto = "Hola " + reserva.getNombre() + ",\n\n"
                    + "¡Gracias por elegir Armando's Pescados y Mariscos!\n"
                    + "Tu reservación ha sido confirmada con éxito. Aquí tienes los detalles:\n\n"
                    + "📅 Fecha y Hora: " + fechaFormateada + "\n"
                    + "👥 Número de personas: " + reserva.getPersonas() + "\n\n"
                    + "Te esperamos con el pescado más fresco del Pacífico.\n\n"
                    + "Atentamente,\n"
                    + "El equipo de Armando's\n"
                    + "📍 Alfonso Pérez Gasga S/N, Puerto Escondido";

            mensaje.setText(texto);
            mailSender.send(mensaje);
            System.out.println("Correo enviado exitosamente a: " + reserva.getEmail());

        } catch (Exception e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
            // Nota: Aquí capturamos el error para que, si falla el correo (ej. sin internet),
            // la reservación en la base de datos no se cancele.
        }
    }
    public java.util.List<Reserva> obtenerTodasLasReservas() {
        return repository.findAllByOrderByFechaHoraAsc();
    }
}