package com.hirenza.event;

import com.hirenza.domain.Application;

public class ApplicationStatusChangedEvent {
    private final Application application;

    public ApplicationStatusChangedEvent(Application application) {
        this.application = application;
    }

    public Application getApplication() {
        return application;
    }
}
