package com.hirenza.engine;

import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.PlacementTier;
import com.hirenza.domain.Student;
import org.springframework.stereotype.Service;

/**
 * Intelligent Rule Evaluator with Campus Multi-Tier Policy Governance,
 * "What-If" Career Pathfinder Advice, and TPO Golden Ticket Waivers.
 */
@Service
public class EligibilityEvaluator {

    /**
     * Main evaluation entry point.
     * Evaluates campus tier policies first, then evaluates dynamic rules with pathfinder logic.
     */
    public EligibilityResult isEligible(Student student, Drive drive) {
        // 1. Campus Multi-Tier Placement Policy (Anti-Seat-Hogging & Upgrade Gating)
        if (student.getCurrentPlacedTier() != null) {
            PlacementTier studentTier = student.getCurrentPlacedTier();
            PlacementTier driveTier = drive.getTier() != null ? drive.getTier() : PlacementTier.DREAM_TIER;
            String company = student.getPlacedCompanyName() != null ? student.getPlacedCompanyName() : "Placed Company";
            Double ctc = student.getPlacedCtcLpa() != null ? student.getPlacedCtcLpa() : 0.0;

            if (studentTier == PlacementTier.SUPER_DREAM_TIER) {
                return EligibilityResult.tierLocked(String.format(
                        "CAMPUS POLICY LOCKOUT: You have already secured a Super Dream offer (%s at ₹%.1f LPA). Institutional policy reserves remaining drives for unplaced peers.",
                        company, ctc));
            } else if (studentTier == PlacementTier.DREAM_TIER && driveTier != PlacementTier.SUPER_DREAM_TIER) {
                return EligibilityResult.tierLocked(String.format(
                        "CAMPUS TIER UPGRADE ONLY: You hold a Dream Tier offer (%s at ₹%.1f LPA). You can only apply to Super Dream Tier drives (> ₹10 LPA).",
                        company, ctc));
            } else if (studentTier == PlacementTier.MASS_TIER && driveTier == PlacementTier.MASS_TIER) {
                return EligibilityResult.tierLocked(String.format(
                        "CAMPUS TIER ANTI-HOARDING: You hold a Mass Tier offer (%s). Further Mass Tier applications are restricted; apply for Dream or Super Dream to upgrade.",
                        company));
            }
        }

        // 2. Evaluate Dynamic Rules with What-If Pathfinder & Golden Ticket Waiver
        boolean hasActiveGoldenTicket = student.getGoldenTicketDriveId() != null 
                && student.getGoldenTicketDriveId().equals(drive.getId());

        for (EligibilityRule rule : drive.getEligibilityRules()) {
            EligibilityResult result = evaluate(student, drive, rule, hasActiveGoldenTicket);
            if (!result.isEligible()) {
                return result;
            }
        }

        if (hasActiveGoldenTicket) {
            return EligibilityResult.eligibleWithWaiver("TPO Golden Ticket Endorsement Active");
        }

        return EligibilityResult.eligible();
    }

    private EligibilityResult evaluate(Student student, Drive drive, EligibilityRule rule, boolean hasActiveGoldenTicket) {
        return switch (rule.getRuleType()) {

            case CGPA_CUTOFF -> {
                double cutoff = rule.getCgpaCutoff();
                if (student.getCgpa() >= cutoff) {
                    yield EligibilityResult.eligible();
                }

                double deficit = cutoff - student.getCgpa();
                // Check if Golden Ticket waiver applies for near-miss (within 0.50 CGPA)
                if (hasActiveGoldenTicket && deficit <= 0.50) {
                    yield EligibilityResult.eligibleWithWaiver(String.format(
                            "TPO Golden Ticket Waiver: Waived %.2f CGPA deficit under TPO Academic & Coding Endorsement.", deficit));
                }

                boolean waiverEligible = deficit <= 0.50 && student.getGoldenTicketsRemaining() > 0;
                double targetSemGpa = Math.min(10.0, student.getCgpa() + (deficit * 2.2));
                String whatIfAdvice = String.format(
                        "CGPA Deficit: -%.2f. Scoring ≥ %.2f in Semester 6 will elevate your cumulative CGPA above the %.2f cutoff.",
                        deficit, targetSemGpa, cutoff);

                yield EligibilityResult.ineligible(
                        "CGPA_CUTOFF",
                        String.format("Student CGPA %.2f is below the required minimum of %.2f", student.getCgpa(), cutoff),
                        whatIfAdvice,
                        waiverEligible
                );
            }

            case BRANCH_WHITELIST -> {
                if (rule.getAllowedBranches().contains(student.getBranch())) {
                    yield EligibilityResult.eligible();
                }

                String whatIfAdvice = String.format(
                        "Branch '%s' is not in whitelisted branches %s. Inter-disciplinary waivers can be requested through TPO if GitHub Code Proof is verified.",
                        student.getBranch(), rule.getAllowedBranches());

                yield EligibilityResult.ineligible(
                        "BRANCH_WHITELIST",
                        String.format("Branch '%s' is not in the list of allowed branches %s", student.getBranch(), rule.getAllowedBranches()),
                        whatIfAdvice,
                        false
                );
            }

            case MAX_ARREARS -> {
                int maxArrears = rule.getMaxArrears();
                if (student.getArrearsCount() <= maxArrears) {
                    yield EligibilityResult.eligible();
                }

                int arrearDeficit = student.getArrearsCount() - maxArrears;
                if (hasActiveGoldenTicket && arrearDeficit == 1) {
                    yield EligibilityResult.eligibleWithWaiver("TPO Golden Ticket Waiver: Waived 1 standing backlog under TPO placement discretion.");
                }

                boolean waiverEligible = arrearDeficit == 1 && student.getGoldenTicketsRemaining() > 0;
                String whatIfAdvice = String.format(
                        "Standing Backlogs: %d (Allowed: %d). Clearing backlogs in upcoming supplementary re-examinations unlocks eligibility for this drive.",
                        student.getArrearsCount(), maxArrears);

                yield EligibilityResult.ineligible(
                        "MAX_ARREARS",
                        String.format("Student has %d arrear(s), but the maximum allowed is %d", student.getArrearsCount(), maxArrears),
                        whatIfAdvice,
                        waiverEligible
                );
            }
        };
    }
}
