package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.model.Doctor;
import com.example.demo.repository.AppointmentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DoctorController {

	@Autowired
	private AppointmentRepository appointmentRepository;

	@PostConstruct
	public void seedAppointments() {
		if (appointmentRepository.count() == 0) {
			String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
			appointmentRepository.save(new Appointment("book1", "doc2", "Dr. Amit Patel", "General Physician", "Demo User", today, "10:00 AM", "Confirmed"));
			appointmentRepository.save(new Appointment("book2", "doc5", "Dr. Elena Rostova", "Dermatologist", "Demo User", today, "01:00 PM", "Confirmed"));
			System.out.println("MediCare database seeded with initial appointments.");
		}
	}

	private final List<Doctor> doctors = new ArrayList<>();

	public DoctorController() {
		doctors.add(new Doctor("doc1", "Dr. Sarah Jenkins", "Cardiologist", 15, 4.9,
				Arrays.asList("09:00 AM", "11:00 AM", "02:00 PM"), "Metro Heart Institute"));
		doctors.add(new Doctor("doc2", "Dr. Amit Patel", "General Physician", 10, 4.7,
				Arrays.asList("10:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"), "City Care Clinic"));
		doctors.add(new Doctor("doc3", "Dr. Lisa Wong", "Pediatrician", 12, 4.8,
				Arrays.asList("09:30 AM", "11:30 AM", "01:30 PM"), "Children's Health Center"));
		doctors.add(new Doctor("doc4", "Dr. Robert Carter", "Neurologist", 18, 4.9,
				Arrays.asList("10:30 AM", "02:30 PM", "03:30 PM"), "Neuroscience Hospital"));
		doctors.add(new Doctor("doc5", "Dr. Elena Rostova", "Dermatologist", 8, 4.6,
				Arrays.asList("08:00 AM", "10:00 AM", "01:00 PM", "05:00 PM"), "Skin & Laser Center"));
		doctors.add(new Doctor("doc6", "Dr. James O'Connor", "Orthopedist", 14, 4.8,
				Arrays.asList("11:00 AM", "03:00 PM", "04:30 PM"), "Bone & Joint Clinic"));
	}

	@GetMapping("/doctors")
	public List<Doctor> getDoctors(@RequestParam(required = false) String specialty) {
		if (specialty == null || specialty.trim().isEmpty()) {
			return doctors;
		}
		return doctors.stream()
				.filter(d -> d.getSpecialty().equalsIgnoreCase(specialty))
				.collect(Collectors.toList());
	}

	@GetMapping("/bookings")
	public List<Appointment> getAppointments() {
		return appointmentRepository.findAll();
	}

	@PostMapping("/bookings")
	public ResponseEntity<Appointment> createBooking(@RequestBody Appointment booking) {
		booking.setId(UUID.randomUUID().toString());
		booking.setStatus("Confirmed");

		Optional<Doctor> docOpt = doctors.stream().filter(d -> d.getId().equals(booking.getDoctorId())).findFirst();
		if (docOpt.isPresent()) {
			booking.setDoctorName(docOpt.get().getName());
			booking.setSpecialty(docOpt.get().getSpecialty());
		}

		Appointment saved = appointmentRepository.save(booking);
		return ResponseEntity.ok(saved);
	}
}
