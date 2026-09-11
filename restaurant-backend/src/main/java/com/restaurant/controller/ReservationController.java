package com.restaurant.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.entity.Reservation;
import com.restaurant.repository.ReservationRepository;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(
            ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/date/{date}")
    public List<Reservation> getReservationsByDate(
            @PathVariable LocalDate date) {

        return reservationRepository.findByReservationDate(date);
    }

    @PostMapping
    public Reservation addReservation(
            @RequestBody Reservation reservation) {

        boolean alreadyReserved =
                reservationRepository
                    .existsByTableNumberAndReservationDateAndReservationTime(
                        reservation.getTableNumber(),
                        reservation.getReservationDate(),
                        reservation.getReservationTime()
                    );

        if (alreadyReserved) {
            throw new RuntimeException(
                "This table is already reserved for the selected date and time."
            );
        }

        if (reservation.getStatus() == null ||
            reservation.getStatus().isBlank()) {

            reservation.setStatus("CONFIRMED");
        }

        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}")
    public Reservation updateReservation(
            @PathVariable Long id,
            @RequestBody Reservation reservation) {

        Reservation existing =
                reservationRepository.findById(id).orElseThrow();

        existing.setCustomerName(reservation.getCustomerName());
        existing.setPhoneNumber(reservation.getPhoneNumber());
        existing.setTableNumber(reservation.getTableNumber());
        existing.setReservationDate(reservation.getReservationDate());
        existing.setReservationTime(reservation.getReservationTime());
        existing.setNumberOfGuests(reservation.getNumberOfGuests());
        existing.setStatus(reservation.getStatus());

        return reservationRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
    }
}