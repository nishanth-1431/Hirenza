package com.hirenza.engine;

/*
Holds the result of an eligibility check.
I made this a separate class instead of just returning a boolean because
I want to tell the student exactly which rule they failed and why.
For example "Your CGPA is below the cutoff" is much more helpful than just "not eligible".
*/
public class EligibilityResult {

    private final boolean eligible;

    // Which rule failed. This will be null if the student is eligible.
    private final String failedRuleName;

    // A short message explaining why the rule failed. Also null when eligible.
    private final String reason;

    private EligibilityResult(boolean eligible, String failedRuleName, String reason) {
        this.eligible       = eligible;
        this.failedRuleName = failedRuleName;
        this.reason         = reason;
    }

    /* Use this when the student passes all rules. */
    public static EligibilityResult eligible() {
        return new EligibilityResult(true, null, null);
    }

    /* Use this when the student fails a rule. Pass in which rule failed and why. */
    public static EligibilityResult ineligible(String failedRuleName, String reason) {
        return new EligibilityResult(false, failedRuleName, reason);
    }

    public boolean isEligible()       { return eligible; }
    public String  getFailedRuleName(){ return failedRuleName; }
    public String  getReason()        { return reason; }

    @Override
    public String toString() {
        if (eligible) return "EligibilityResult[ELIGIBLE]";
        return "EligibilityResult[INELIGIBLE, rule=" + failedRuleName +
               ", reason=\"" + reason + "\"]";
    }
}
