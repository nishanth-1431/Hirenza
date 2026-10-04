package com.hirenza.domain;

/*
The possible states an application can be in.
Once a student applies, the TPO moves it through these stages.
OFFERED and REJECTED are the two final states - nothing changes after those.

In Phase 2 I will use @Enumerated(EnumType.STRING) when saving this to the
database so the column stores "OFFERED" instead of a number. That way if I
add new statuses in the middle, old data won't break.
*/
public enum ApplicationStatus {
    APPLIED,      // student submitted, TPO has not acted yet
    SHORTLISTED,  // TPO moved the student to the next step
    INTERVIEW,    // student has been called for an interview
    OFFERED,      // student got the job
    REJECTED      // application did not go through
}
