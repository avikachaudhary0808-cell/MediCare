package com.example.demo.model;

public class ProgressLog {
    private String date;
    private double completionRate;

    public ProgressLog() {}

    public ProgressLog(String date, double completionRate) {
        this.date = date;
        this.completionRate = completionRate;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
}
