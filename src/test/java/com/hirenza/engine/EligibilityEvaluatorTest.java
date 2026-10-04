package com.hirenza.engine;

import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/*
Tests for EligibilityEvaluator.

I am using one drive for most tests (Zoho drive below) so I don't have to
repeat the setup in every single test. The @Nested classes group tests by
which rule they are testing so it is easy to find related tests.

Drive used in tests:
  Company  : Zoho
  Role     : Software Developer
  CGPA     : 7.5 minimum (inclusive)
  Branches : CSE, IT, ECE
  Arrears  : 0 maximum
*/
class EligibilityEvaluatorTest {

    private EligibilityEvaluator evaluator;
    private Drive                zoho;

    @BeforeEach
    void setUp() {
        evaluator = new EligibilityEvaluator();

        zoho = Drive.builder()
                .companyName("Zoho")
                .role("Software Developer")
                .cgpaCutoff(7.5)
                .allowedBranches(Set.of("CSE", "IT", "ECE"))
                .maxArrears(0)
                .applicationDeadline(LocalDate.of(2026, 12, 1))
                .build();
    }

    // A student who passes all three rules. Used as a baseline in several tests.
    private Student eligibleStudent() {
        return new Student(
            "Arjun Kumar",
            "arjun@college.edu",
            "9876543210",
            8.2,   // above 7.5
            "CSE", // in allowed branches
            0      // no arrears
        );
    }

    // TC-1: basic happy path - student meets all criteria
    @Test
    @DisplayName("TC-1: Student who meets all criteria is eligible")
    void eligible_whenAllCriteriaSatisfied() {
        EligibilityResult result = evaluator.isEligible(eligibleStudent(), zoho);

        assertTrue(result.isEligible(), "Expected ELIGIBLE but got: " + result);
        assertNull(result.getFailedRuleName(), "failedRuleName should be null when eligible");
        assertNull(result.getReason(), "reason should be null when eligible");
    }

    @Nested
    @DisplayName("CGPA cutoff rules")
    class CgpaRules {

        // TC-2: 7.49 is just below the cutoff of 7.5, so this should fail
        @Test
        @DisplayName("TC-2: CGPA just below cutoff (7.49) -> INELIGIBLE")
        void ineligible_whenCgpaJustBelowCutoff() {
            Student student = new Student(
                "Priya Sharma", "priya@college.edu", "9000000001",
                7.49, "CSE", 0
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertFalse(result.isEligible(), "Expected INELIGIBLE for CGPA 7.49 with cutoff 7.5");
            assertEquals("CGPA_CUTOFF", result.getFailedRuleName());
            assertNotNull(result.getReason());
            assertTrue(result.getReason().contains("7.49") || result.getReason().contains("7.50"),
                "Reason should mention the CGPA values: " + result.getReason());
        }

        // TC-3: testing the boundary condition - 7.5 == 7.5 should be eligible
        // I used >= in the evaluator so the cutoff is inclusive.
        // If it should be strictly greater than, this test should be changed to assertFalse
        // and the >= in EligibilityEvaluator should be changed to >.
        @Test
        @DisplayName("TC-3: CGPA exactly at cutoff (7.5) -> ELIGIBLE (boundary is inclusive)")
        void eligible_whenCgpaExactlyAtCutoff() {
            Student student = new Student(
                "Kavya Rajan", "kavya@college.edu", "9000000002",
                7.5, "CSE", 0
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertTrue(result.isEligible(), "Expected ELIGIBLE for CGPA exactly at cutoff. Got: " + result);
        }
    }

    @Nested
    @DisplayName("Branch whitelist rules")
    class BranchRules {

        // TC-4: MECH is not in the allowed list so this should fail
        @Test
        @DisplayName("TC-4: Student from a non-whitelisted branch (MECH) -> INELIGIBLE")
        void ineligible_whenBranchNotAllowed() {
            Student student = new Student(
                "Raj Mohan", "raj@college.edu", "9000000003",
                8.5, "MECH", 0
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertFalse(result.isEligible(), "Expected INELIGIBLE for branch MECH");
            assertEquals("BRANCH_WHITELIST", result.getFailedRuleName());
            assertNotNull(result.getReason());
            assertTrue(result.getReason().contains("MECH"),
                "Reason should mention the branch: " + result.getReason());
        }

        // Branch matching is case-sensitive. "cse" will not match "CSE" in the set.
        // If the data gets normalised to uppercase before saving, this test can be removed.
        @Test
        @DisplayName("Branch check is case-sensitive: 'cse' does not match 'CSE' -> INELIGIBLE")
        void ineligible_whenBranchCaseMismatch() {
            Student student = new Student(
                "Test Student", "test@college.edu", "9000000009",
                8.0, "cse", 0
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertFalse(result.isEligible(), "Branch matching is case-sensitive so 'cse' should not match 'CSE'");
            assertEquals("BRANCH_WHITELIST", result.getFailedRuleName());
        }
    }

    @Nested
    @DisplayName("Arrears rules")
    class ArrearsRules {

        // TC-5: maxArrears is 0, so having even 1 arrear should fail
        @Test
        @DisplayName("TC-5: Student with 1 arrear when maxArrears=0 -> INELIGIBLE")
        void ineligible_whenTooManyArrears() {
            Student student = new Student(
                "Deepak Nair", "deepak@college.edu", "9000000004",
                8.0, "IT", 1
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertFalse(result.isEligible(), "Expected INELIGIBLE for 1 arrear when max is 0");
            assertEquals("MAX_ARREARS", result.getFailedRuleName());
            assertNotNull(result.getReason());
            assertTrue(result.getReason().contains("1"),
                "Reason should mention the arrear count: " + result.getReason());
        }

        // 0 arrears when max is 0 - this should pass since the check is <=
        @Test
        @DisplayName("Zero arrears when maxArrears=0 -> ELIGIBLE (boundary is inclusive)")
        void eligible_whenArrearsExactlyAtMaximum() {
            Student student = new Student(
                "Sneha Pillai", "sneha@college.edu", "9000000005",
                8.0, "ECE", 0
            );

            EligibilityResult result = evaluator.isEligible(student, zoho);

            assertTrue(result.isEligible(), "Expected ELIGIBLE with exactly 0 arrears. Got: " + result);
        }
    }

    // If a drive has no rules at all, every student should be allowed.
    // This is an edge case but good to verify the loop handles an empty list correctly.
    @Test
    @DisplayName("Drive with no eligibility rules -> every student is eligible")
    void eligible_whenDriveHasNoRules() {
        Drive openDrive = Drive.builder()
                .companyName("OpenCo")
                .role("Internship")
                .build();

        Student anyStudent = new Student(
            "Any Student", "any@college.edu", "9000000006",
            4.0, "CIVIL", 5
        );

        EligibilityResult result = evaluator.isEligible(anyStudent, openDrive);

        assertTrue(result.isEligible(), "A drive with no rules should allow everyone");
    }

    // When multiple rules fail, the evaluator should return only the first one.
    // Rules run in order CGPA -> BRANCH -> ARREARS, so CGPA should be reported here.
    @Test
    @DisplayName("TC-7: Student fails CGPA and branch - only CGPA failure is reported (fail-fast)")
    void failFast_whenMultipleRulesFail() {
        Student student = new Student(
            "Fail All", "fail@college.edu", "9000000007",
            6.0, "MECH", 2
        );

        EligibilityResult result = evaluator.isEligible(student, zoho);

        assertFalse(result.isEligible());
        assertEquals("CGPA_CUTOFF", result.getFailedRuleName(),
            "Should report the first failing rule (CGPA), not later ones");
    }
}
