package com.hirenza.domain;

/*
The three types of eligibility rules I support right now.
If a new type of rule needs to be added later (like minimum internship count),
I add a value here and then handle it in the switch inside EligibilityEvaluator.
The compiler will give an error if I forget to handle it there, which is helpful.
*/
public enum RuleType {

    /* Student's CGPA must be >= the cutoff value. */
    CGPA_CUTOFF,

    /* Student's branch must be in the allowed branches set. Matching is case-sensitive. */
    BRANCH_WHITELIST,

    /* Student's arrear count must be <= the max allowed. */
    MAX_ARREARS
}
