package com.hirenza.engine;

import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.Student;
import org.springframework.stereotype.Service;

/*
This class checks if a student is allowed to apply for a drive.
It goes through each rule one by one and returns as soon as one fails.
I decided to stop at the first failure instead of collecting all failures
because showing one clear reason is more useful than showing a list.
*/
@Service
public class EligibilityEvaluator {

    /*
    Main method - call this to check if a student can apply for a drive.
    Returns an EligibilityResult that tells you if the student passed and,
    if not, which rule failed and why.
    */
    public EligibilityResult isEligible(Student student, Drive drive) {
        for (EligibilityRule rule : drive.getEligibilityRules()) {
            EligibilityResult result = evaluate(student, rule);
            if (!result.isEligible()) {
                return result;
            }
        }
        return EligibilityResult.eligible();
    }

    /*
    Checks the student against a single rule based on the rule type.
    I used a switch here so if I add a new RuleType later and forget to
    handle it, the compiler will give an error instead of silently doing nothing.
    */
    private EligibilityResult evaluate(Student student, EligibilityRule rule) {
        return switch (rule.getRuleType()) {

            case CGPA_CUTOFF -> {
                double cutoff = rule.getCgpaCutoff();
                // Using >= so a student exactly at the cutoff is allowed.
                // Not sure if this should be strictly greater than - need to confirm.
                if (student.getCgpa() >= cutoff) {
                    yield EligibilityResult.eligible();
                }
                yield EligibilityResult.ineligible(
                    "CGPA_CUTOFF",
                    String.format(
                        "Student CGPA %.2f is below the required minimum of %.2f",
                        student.getCgpa(), cutoff)
                );
            }

            case BRANCH_WHITELIST -> {
                if (rule.getAllowedBranches().contains(student.getBranch())) {
                    yield EligibilityResult.eligible();
                }
                yield EligibilityResult.ineligible(
                    "BRANCH_WHITELIST",
                    String.format(
                        "Branch '%s' is not in the list of allowed branches %s",
                        student.getBranch(), rule.getAllowedBranches())
                );
            }

            case MAX_ARREARS -> {
                int maxArrears = rule.getMaxArrears();
                // Using <= so a student with exactly maxArrears arrears is allowed.
                // So if maxArrears is 0, only students with 0 arrears pass.
                if (student.getArrearsCount() <= maxArrears) {
                    yield EligibilityResult.eligible();
                }
                yield EligibilityResult.ineligible(
                    "MAX_ARREARS",
                    String.format(
                        "Student has %d arrear(s), but the maximum allowed is %d",
                        student.getArrearsCount(), maxArrears)
                );
            }
        };
    }
}
