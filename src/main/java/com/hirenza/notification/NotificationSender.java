package com.hirenza.notification;

import com.hirenza.event.ApplicationStatusChangedEvent;
import com.hirenza.event.DriveCreatedEvent;

public interface NotificationSender {
    void handleDriveCreated(DriveCreatedEvent event);
    void handleApplicationStatusChanged(ApplicationStatusChangedEvent event);
}
