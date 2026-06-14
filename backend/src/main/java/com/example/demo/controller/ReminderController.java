package com.example.demo.controller;

import com.example.demo.model.Reminder;
import com.example.demo.repository.ReminderRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ReminderController {

	@Autowired
	private ReminderRepository reminderRepository;

	@PostConstruct
	public void seedDatabase() {
		if (reminderRepository.count() == 0) {
			String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
			String yesterday = LocalDate.now().minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);

			List<Reminder> initialList = new ArrayList<>();
			initialList.add(new Reminder("rem1", "Amoxicillin (Antibiotic)", "medication", "08:00 AM", "500mg, 1 tablet after food", false, today));
			initialList.add(new Reminder("rem2", "Check Blood Pressure", "task", "09:00 AM", null, true, today));
			initialList.add(new Reminder("rem3", "Multivitamin Capsule", "medication", "01:00 PM", "1 capsule daily", false, today));
			initialList.add(new Reminder("rem4", "Evening Walk", "task", "06:00 PM", "30 mins brisk walking", false, today));
			initialList.add(new Reminder("rem5", "Drink 8 glasses of water", "task", "08:00 PM", "Track daily hydration", false, today));

			initialList.add(new Reminder("rem6", "Amoxicillin (Antibiotic)", "medication", "08:00 AM", "500mg", true, yesterday));
			initialList.add(new Reminder("rem7", "Evening Walk", "task", "06:00 PM", "30 mins", true, yesterday));
			initialList.add(new Reminder("rem8", "Drink water", "task", "08:00 PM", "Track", false, yesterday));

			reminderRepository.saveAll(initialList);
			System.out.println("MediCare database seeded with initial reminders.");
		}
	}

	@GetMapping("/reminders")
	public List<Reminder> getReminders(@RequestParam(required = false) String date) {
		String queryDate = (date != null && !date.trim().isEmpty()) ? date : LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
		return reminderRepository.findByDate(queryDate);
	}

	@PostMapping("/reminders")
	public ResponseEntity<Reminder> addReminder(@RequestBody Reminder reminder) {
		reminder.setId(UUID.randomUUID().toString());
		if (reminder.getDate() == null || reminder.getDate().trim().isEmpty()) {
			reminder.setDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
		}
		Reminder saved = reminderRepository.save(reminder);
		return ResponseEntity.ok(saved);
	}

	@PutMapping("/reminders/{id}/toggle")
	public ResponseEntity<Reminder> toggleReminder(@PathVariable String id) {
		Optional<Reminder> reminderOpt = reminderRepository.findById(id);
		if (reminderOpt.isPresent()) {
			Reminder r = reminderOpt.get();
			r.setCompleted(!r.isCompleted());
			Reminder saved = reminderRepository.save(r);
			return ResponseEntity.ok(saved);
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/reminders/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteReminder(@PathVariable String id) {
		boolean exists = reminderRepository.existsById(id);
		if (exists) {
			reminderRepository.deleteById(id);
		}
		Map<String, Boolean> response = new HashMap<>();
		response.put("success", exists);
		return ResponseEntity.ok(response);
	}
}
