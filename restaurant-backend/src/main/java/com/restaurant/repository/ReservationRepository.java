package com.restaurant.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.entity.Reservation;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByReservationDate(LocalDate date);

    boolean existsByTableNumberAndReservationDateAndReservationTime(
            int tableNumber,
            LocalDate reservationDate,
            LocalTime reservationTime);
}