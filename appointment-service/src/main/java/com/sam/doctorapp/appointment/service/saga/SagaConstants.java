package com.sam.doctorapp.appointment.service.saga;

public final class SagaConstants {

    private SagaConstants() {}

    public static final String SAGA_TYPE_BOOKING = "BOOKING";
    public static final String SAGA_TYPE_CANCELLATION = "CANCELLATION";

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_COMPENSATING = "COMPENSATING";
    public static final String STATUS_COMPENSATED = "COMPENSATED";
    public static final String STATUS_FAILED = "FAILED";

    public static final String STEP_STARTED = "STARTED";
    public static final String STEP_SLOT_CHECKED = "SLOT_CHECKED";
    public static final String STEP_SLOT_BOOKED = "SLOT_BOOKED";
    public static final String STEP_NOTIFICATION = "NOTIFICATION";
    public static final String STEP_DONE = "DONE";
    public static final String STEP_COMPENSATED = "COMPENSATED";
    public static final String STEP_CANCELLING = "CANCELLING";
    public static final String STEP_SLOT_UNBOOKED = "SLOT_UNBOOKED";

    public static final int MAX_RETRIES = 3;
    public static final int SAGA_TIMEOUT_MINUTES = 30;
}
