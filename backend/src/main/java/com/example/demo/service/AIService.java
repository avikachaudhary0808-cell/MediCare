package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // 1. Backward-compatible flat symptom checker
    public String analyzeSymptoms(List<String> symptoms) {
        String symptomsJoined = String.join(", ", symptoms);
        
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("YOUR_GEMINI_API_KEY")) {
            try {
                String prompt = "You are a professional medical assistant. Analyze these symptoms: [" + symptomsJoined + "]. " +
                        "Respond with a JSON object in this exact format. Ensure it is valid JSON and contains nothing else: " +
                        "{\n" +
                        "  \"conditions\": [\"Condition A (Confidence %)\", \"Condition B (Confidence %)\"],\n" +
                        "  \"riskLevel\": \"Low\" or \"Medium\" or \"High\",\n" +
                        "  \"guidance\": \"Detailed guidance on what to do, rest, hydration, etc.\",\n" +
                        "  \"disclaimer\": \"DISCLAIMER: This information is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.\"\n" +
                        "}";

                String requestBody = "{\n" +
                        "  \"contents\": [{\n" +
                        "    \"parts\": [{\n" +
                        "      \"text\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\"\n" +
                        "    }]\n" +
                        "  }]\n" +
                        "}";

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    String body = response.body();
                    String text = extractTextFromGeminiJson(body);
                    if (text != null && !text.isEmpty()) {
                        text = text.trim();
                        if (text.startsWith("```json")) {
                            text = text.substring(7);
                        } else if (text.startsWith("```")) {
                            text = text.substring(3);
                        }
                        if (text.endsWith("```")) {
                            text = text.substring(0, text.length() - 3);
                        }
                        return text.trim();
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini API symptom check failed: " + e.getMessage());
            }
        }
        return generateRuleBasedResponse(symptoms);
    }

    // 2. Premium Multi-turn Conversational Chatbot
    public String converse(List<Map<String, String>> chatHistory, String newMessage) {
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("YOUR_GEMINI_API_KEY")) {
            try {
                // Build contents list for Gemini chat structure
                StringBuilder contentsJson = new StringBuilder();
                contentsJson.append("[");
                
                // Construct history items
                for (int i = 0; i < chatHistory.size(); i++) {
                    Map<String, String> msg = chatHistory.get(i);
                    String role = msg.get("role").equals("user") ? "user" : "model";
                    String text = msg.get("text").replace("\"", "\\\"").replace("\n", "\\n");
                    
                    contentsJson.append("{\"role\":\"").append(role).append("\",\"parts\":[{\"text\":\"").append(text).append("\"}]}");
                    if (i < chatHistory.size() - 1) {
                        contentsJson.append(",");
                    }
                }
                
                // Add the new user message if not already in history
                if (chatHistory.isEmpty() || !chatHistory.get(chatHistory.size() - 1).get("text").equals(newMessage)) {
                    if (chatHistory.size() > 0) contentsJson.append(",");
                    contentsJson.append("{\"role\":\"user\",\"parts\":[{\"text\":\"")
                                .append(newMessage.replace("\"", "\\\"").replace("\n", "\\n"))
                                .append("\"}]}");
                }
                
                contentsJson.append("]");

                // System Instruction to force medical persona and disclaimer safety
                String systemInstruction = "You are 'MediCare Assistant', an empathetic and professional medical chatbot. " +
                        "Help the user assess their health symptoms. Ask clarifying questions one at a time. " +
                        "IMPORTANT: Always end your very first response with a clear medical disclaimer in bold. " +
                        "If the user reports emergency signs (e.g. chest pain, breathing difficulty), advise them to seek emergency services immediately.";

                String requestBody = "{\n" +
                        "  \"contents\": " + contentsJson.toString() + ",\n" +
                        "  \"systemInstruction\": {\n" +
                        "    \"parts\": [{\n" +
                        "      \"text\": \"" + systemInstruction.replace("\"", "\\\"").replace("\n", "\\n") + "\"\n" +
                        "    }]\n" +
                        "  }\n" +
                        "}";

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    String body = response.body();
                    String reply = extractTextFromGeminiJson(body);
                    if (reply != null && !reply.isEmpty()) {
                        return reply.trim();
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini chat session error, falling back: " + e.getMessage());
            }
        }
        return getConversationalFallback(chatHistory, newMessage);
    }

    private String extractTextFromGeminiJson(String body) {
        try {
            int textIndex = body.indexOf("\"text\":");
            if (textIndex != -1) {
                int startQuote = body.indexOf("\"", textIndex + 7);
                if (startQuote != -1) {
                    int endQuote = body.indexOf("\"", startQuote + 1);
                    while (endQuote != -1 && body.charAt(endQuote - 1) == '\\') {
                        endQuote = body.indexOf("\"", endQuote + 1);
                    }
                    if (endQuote != -1) {
                        return body.substring(startQuote + 1, endQuote)
                                   .replace("\\\"", "\"")
                                   .replace("\\n", "\n")
                                   .replace("\\\\", "\\");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed parsing Gemini text: " + e.getMessage());
        }
        return null;
    }

    private String getConversationalFallback(List<Map<String, String>> chatHistory, String newMessage) {
        String msg = newMessage.toLowerCase();
        
        if (msg.contains("hello") || msg.contains("hi ") || msg.equals("hi") || msg.contains("hey")) {
            return "Hello! I am your MediCare AI Assistant. How can I help you today? Please tell me what physical symptoms you are experiencing.";
        }
        
        if (msg.contains("chest pain") || msg.contains("shortness of breath") || msg.contains("breathing") || msg.contains("heart pain")) {
            return "⚠️ **CRITICAL ADVICE**: Your symptoms suggest a potentially severe medical situation. Please go to the nearest emergency room or call ambulance services immediately. \n\n*DISCLAIMER: I am an AI, not a doctor. This does not replace professional medical triage.*";
        }
        
        if (msg.contains("fever") || msg.contains("temperature") || msg.contains("hot")) {
            return "A fever indicates your body is fighting off an infection. Are you also experiencing symptoms like chills, body aches, a sore throat, or cough? Knowing this helps narrow down possibilities.\n\n*DISCLAIMER: This is for educational purposes only and does not replace professional medical advice.*";
        }

        if (msg.contains("cough") || msg.contains("sore throat") || msg.contains("flu")) {
            return "Cough and sore throat are common respiratory signs. It could be a common cold, influenza, or allergies. Rest, stay hydrated, and consider warm liquids. Do you have a fever or difficulty breathing?\n\n*DISCLAIMER: Educational information only. Consult a doctor if symptoms worsen.*";
        }
        
        if (msg.contains("headache") || msg.contains("migraine")) {
            return "Headaches can be caused by tension, stress, hydration issues, or eye strain. If it is a throbbing headache on one side with light sensitivity, it might be a migraine. Make sure to drink water and rest in a dark room. Are you feeling nauseous?\n\n*DISCLAIMER: Educational information only.*";
        }
        
        if (msg.contains("thank") || msg.contains("thanks")) {
            return "You're very welcome! Feel free to track your medications and schedules in the 'Reminders' tab to maintain your recovery score. Stay healthy!";
        }

        return "I understand you are experiencing discomfort. Could you describe your symptoms in more detail, such as when they started, their severity, or any other signs you are notice?\n\n*DISCLAIMER: This information is for educational purposes and is not a substitute for professional medical advice.*";
    }

    private String generateRuleBasedResponse(List<String> symptoms) {
        List<String> lowercaseSymptoms = symptoms.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        String conditions = "[\"Common Cold (80%)\", \"Allergic Rhinitis (50%)\"]";
        String riskLevel = "Low";
        String guidance = "Rest, stay hydrated by drinking plenty of water, and monitor your temperature. Consider over-the-counter decongestants if appropriate.";

        boolean hasSevere = lowercaseSymptoms.contains("chest pain") || 
                            lowercaseSymptoms.contains("shortness of breath") || 
                            lowercaseSymptoms.contains("difficulty breathing") ||
                            lowercaseSymptoms.contains("severe abdominal pain");

        boolean hasModerate = lowercaseSymptoms.contains("fever") || 
                             lowercaseSymptoms.contains("high temperature") || 
                             lowercaseSymptoms.contains("vomiting") || 
                             lowercaseSymptoms.contains("migraine") || 
                             lowercaseSymptoms.contains("severe headache");

        if (hasSevere) {
            conditions = "[\"Acute Cardiovascular Event (40%)\", \"Respiratory Distress (35%)\"]";
            riskLevel = "High";
            guidance = "WARNING: Your symptoms suggest a potentially serious medical condition. Please seek immediate professional medical attention or go to the nearest emergency room.";
        } else if (hasModerate) {
            conditions = "[\"Influenza (70%)\", \"Gastroenteritis (60%)\", \"Migraine Episode (50%)\"]";
            riskLevel = "Medium";
            guidance = "Keep track of your symptoms. If symptoms worsen, or if you run a high fever that does not go down with medication for more than 48 hours, consult a healthcare provider.";
        } else if (lowercaseSymptoms.contains("cough") || lowercaseSymptoms.contains("sore throat")) {
            conditions = "[\"Pharyngitis (75%)\", \"Bronchitis (55%)\", \"Common Cold (65%)\"]";
            riskLevel = "Low";
            guidance = "Warm fluids, honey, throat lozenges, and plenty of rest. Monitor for fever or breathing difficulties.";
        }

        return "{\n" +
                "  \"conditions\": " + conditions + ",\n" +
                "  \"riskLevel\": \"" + riskLevel + "\",\n" +
                "  \"guidance\": \"" + guidance + "\",\n" +
                "  \"disclaimer\": \"DISCLAIMER: This information is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.\"\n" +
                "}";
    }
}
