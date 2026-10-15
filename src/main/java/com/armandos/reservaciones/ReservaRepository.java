package com.armandos.reservaciones;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List; // <-- ESTA ES LA LÍNEA QUE FALTABA

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Suma las personas de las reservas que se solapan con la ventana de 2 horas
    @Query("SELECT COALESCE(SUM(r.personas), 0) FROM Reserva r WHERE r.fechaHora < :fin AND r.fechaHora > :inicio")
    Integer sumarPersonasEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // Traer todas las reservas ordenadas por fecha
    List<Reserva> findAllByOrderByFechaHoraAsc();
}