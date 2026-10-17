package com.hirenza.engine;

/**
 * Holds the comprehensive outcome of an eligibility evaluation.
 * Enriched with institutional tier policies, "What-If" career path advice,
 * and TPO Golden Ticket waiver eligibility.
 */
public class EligibilityResult {

    private final boolean eligible;
    private final String failedRuleName;
    private final String reason;

    // Campus Policy Multi-Tier Lockout
    private final boolean tierLocked;
    private final String tierLockReason;

    // "What-If" Pathfinder Engine: Actionable roadmap for near-miss candidates
    private final String whatIfAdvice;
    private final boolean waiverEligible; // True if candidate can apply a TPO Golden Ticket
    private final boolean waiverApplied;  // True if a waiver was consumed for this evaluation

    private EligibilityResult(boolean eligible, String failedRuleName, String reason,
                              boolean tierLocked, String tierLockReason,
                              String whatIfAdvice, boolean waiverEligible, boolean waiverApplied) {
        this.eligible       = eligible;
        this.failedRuleName = failedRuleName;
        this.reason         = reason;
        this.tierLocked     = tierLocked;
        this.tierLockReason = tierLockReason;
        this.whatIfAdvice   = whatIfAdvice;
        this.waiverEligible = waiverEligible;
        this.waiverApplied  = waiverApplied;
    }

    /** Pass all rules unconditionally. */
    public static EligibilityResult eligible() {
        return new EligibilityResult(true, null, null, false, null, null, false, false);
    }

    /** Eligible due to a TPO Golden Ticket waiver. */
    public static EligibilityResult eligibleWithWaiver(String waiverReason) {
        return new EligibilityResult(true, null, waiverReason, false, null, "Waiver Active: " + waiverReason, false, true);
    }

    /** Institutional campus policy lockout (protecting unplaced batchmates). */
    public static EligibilityResult tierLocked(String lockReason) {
        return new EligibilityResult(false, "CAMPUS_TIER_LOCKOUT", lockReason, true, lockReason, 
                "Institutional tier policy restriction. Speak with TPO if special exception applies.", false, false);
    }

    /** Backward-compatible standard ineligible call. */
    public static EligibilityResult ineligible(String failedRuleName, String reason) {
        return new EligibilityResult(false, failedRuleName, reason, false, null, null, false, false);
    }

    /** Full What-If Pathfinder ineligible call with actionable advice & waiver eligibility. */
    public static EligibilityResult ineligible(String failedRuleName, String reason, String whatIfAdvice, boolean waiverEligible) {
        return new EligibilityResult(false, failedRuleName, reason, false, null, whatIfAdvice, waiverEligible, false);
    }

    public boolean isEligible()          { return eligible; }
    public String  getFailedRuleName()   { return failedRuleName; }
    public String  getReason()           { return reason; }
    public boolean isTierLocked()        { return tierLocked; }
    public String  getTierLockReason()    { return tierLockReason; }
    public String  getWhatIfAdvice()     { return whatIfAdvice; }
    public boolean isWaiverEligible()    { return waiverEligible; }
    public boolean isWaiverApplied()     { return waiverApplied; }

    @Override
    public String toString() {
        if (eligible && waiverApplied) return "EligibilityResult[ELIGIBLE_VIA_WAIVER]";
        if (eligible) return "EligibilityResult[ELIGIBLE]";
        if (tierLocked) return "EligibilityResult[TIER_LOCKED: " + tierLockReason + "]";
        return "EligibilityResult[INELIGIBLE, rule=" + failedRuleName +
               ", reason=\"" + reason + "\", whatIf=\"" + whatIfAdvice + "\", waiverEligible=" + waiverEligible + "]";
    }
}
