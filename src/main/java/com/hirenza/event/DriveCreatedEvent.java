package com.hirenza.event;

import com.hirenza.domain.Drive;

public class DriveCreatedEvent {
    private final Drive drive;

    public DriveCreatedEvent(Drive drive) {
        this.drive = drive;
    }

    public Drive getDrive() {
        return drive;
    }
}
