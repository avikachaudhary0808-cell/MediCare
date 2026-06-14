package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reminders")
public class Reminder {
    @Id
    private String id;
    private String title;
    private String type; // "medication" or "task"
    private String time;
    private String dosage;
    private boolean completed;
    private String date;

    // Constructors
    public Reminder() {}

    public Reminder(String id, String title, String type, String time, String dosage, boolean completed, String date) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.time = time;
        this.dosage = dosage;
        this.completed = completed;
        this.date = date;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
