package com.example.demo.controller;

import com.example.demo.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SymptomController {

	@Autowired
	private AIService aiService;

	// 1. Symptom check list matching (original endpoint)
	@PostMapping(value = "/symptom-check", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> checkSymptoms(@RequestBody Map<String, List<String>> request) {
		List<String> symptoms = request.get("symptoms");
		if (symptoms == null || symptoms.isEmpty()) {
			return ResponseEntity.badRequest().body("{\"error\": \"Symptoms list cannot be empty\"}");
		}

		String responseJson = aiService.analyzeSymptoms(symptoms);
		return ResponseEntity.ok(responseJson);
	}

	// 2. Chat with virtual doctor (new chatbot endpoint)
	@PostMapping(value = "/chat", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<String> chatDoctor(@RequestBody Map<String, Object> request) {
		List<Map<String, String>> chatHistory = (List<Map<String, String>>) request.get("chatHistory");
		String message = (String) request.get("message");

		if (message == null || message.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Message cannot be empty.");
		}

		String reply = aiService.converse(chatHistory, message);
		return ResponseEntity.ok(reply);
	}
}
