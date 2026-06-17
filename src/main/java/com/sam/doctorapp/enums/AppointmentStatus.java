package com.sam.doctorapp.enums;
public enum AppointmentStatus {
    BOOKED,      // Initial request from patient
    CONFIRMED,   // Doctor has reviewed and accepted
    REJECTED,    // Doctor declined the request
    CANCELLED,   // Either party cancelled
    COMPLETED    // The visit is finished
}