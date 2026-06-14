package com.example.demo.model;

import java.util.List;

public class Doctor {
    private String id;
    private String name;
    private String specialty;
    private int experience;
    private double rating;
    private List<String> availability;
    private String hospital;

    public Doctor() {}

    public Doctor(String id, String name, String specialty, int experience, double rating, List<String> availability, String hospital) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.experience = experience;
        this.rating = rating;
        this.availability = availability;
        this.hospital = hospital;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getAvailability() { return availability; }
    public void setAvailability(List<String> availability) { this.availability = availability; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }
}
