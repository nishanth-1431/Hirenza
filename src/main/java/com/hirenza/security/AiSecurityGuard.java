package com.hirenza.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class AiSecurityGuard {

    private static final Pattern PROMPT_INJECTION_PATTERN = Pattern.compile(
            "(?i)\\b(ignore\\s+(all|any|previous|the)\\s+(instructions|rules|prompts|system)|" +
            "you\\s+are\\s+now\\s+(dan|unrestricted|godmode|jailbreak)|" +
            "reveal\\s+(the|your|system)\\s+prompt|" +
            "show\\s+your\\s+instructions|" +
            "disregard\\s+all\\s+prior\\s+instructions|" +
            "act\\s+as\\s+an\\s+unrestricted|" +
            "drop\\s+table|union\\s+select|<script|eval\\()\\b"
    );

    private static final Pattern POLICY_TAMPER_PATTERN = Pattern.compile(
            "(?i)\\b((change|update|edit|modify|alter|set|fake|increase|boost|override|hack)\\s+(my\\s+|the\\s+)?(cgpa|gpa|arrear|backlog|score|branch|eligib)|" +
            "(bypass|override|ignore)\\s+(the\\s+)?(cutoff|eligibility|gating|rule|criteria|system)|" +
            "(mark|set)\\s+me\\s+(as\\s+)?(placed|eligible|selected|shortlisted|winner)|" +
            "(give|grant)\\s+me\\s+(an?\\s+)?(offer|job|ticket\\s+without\\s+criteria))\\b"
    );

    private static final Pattern CONFIDENTIAL_PII_PATTERN = Pattern.compile(
            "(?i)\\b((show|list|export|dump|reveal|leak)\\s+(all\\s+|other\\s+)?(student|peer|candidate)?\\s*(resumes|emails|passwords|phones|contacts|salaries)|" +
            "(show|reveal)\\s+hr\\s+(internal|secret|private)\\s+(notes|ratings|rubrics)|" +
            "show\\s+database\\s+(credentials|connection|password))\\b"
    );

    private static final Pattern MALICIOUS_CODE_PATTERN = Pattern.compile(
            "(?i)\\b(write|create|generate)\\s+(a\\s+)?(ransomware|keylogger|malware|ddos\\s+script|trojan|reverse\\s+shell)\\b"
    );

    public static class SecurityVerdict {
        private final boolean blocked;
        private final String category;
        private final String message;

        public SecurityVerdict(boolean blocked, String category, String message) {
            this.blocked = blocked;
            this.category = category;
            this.message = message;
        }

        public static SecurityVerdict passed() {
            return new SecurityVerdict(false, "NONE", null);
        }

        public boolean isBlocked() {
            return blocked;
        }

        public String getCategory() {
            return category;
        }

        public String getMessage() {
            return message;
        }
    }

    public SecurityVerdict inspect(String userPrompt) {
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return SecurityVerdict.passed();
        }

        String sanitized = userPrompt.trim();

        // 1. Check Prompt Injection & Jailbreaks
        if (PROMPT_INJECTION_PATTERN.matcher(sanitized).find()) {
            return new SecurityVerdict(
                    true,
                    "PROMPT_INJECTION",
                    "🛡️ **Hirenza AI Guardrail**: System instruction override and prompt injection attempts are strictly prohibited. Copilot remains locked in secure recruitment advisor mode."
            );
        }

        // 2. Check Placement Policy & Gating Tampering
        if (POLICY_TAMPER_PATTERN.matcher(sanitized).find()) {
            return new SecurityVerdict(
                    true,
                    "POLICY_TAMPERING",
                    "🔒 **Zero-Bypass Policy Guard**: Institutional placement governance strictly enforces deterministic eligibility. AI Copilot cannot alter verified student academic records (CGPA, Standing Arrears, Branch), bypass institutional cutoffs, or override TPO policies. All eligibility criteria are cryptographically validated against college authority records."
            );
        }

        // 3. Check Confidential PII and Recruiter Rubrics
        if (CONFIDENTIAL_PII_PATTERN.matcher(sanitized).find()) {
            return new SecurityVerdict(
                    true,
                    "CONFIDENTIAL_PII",
                    "🔒 **Confidentiality Guard**: Peer student PII, recruiter private interview logs, and internal database credentials are confidential and protected by RBAC isolation."
            );
        }

        // 4. Check Malicious / Destructive Code Requests
        if (MALICIOUS_CODE_PATTERN.matcher(sanitized).find()) {
            return new SecurityVerdict(
                    true,
                    "MALICIOUS_CODE",
                    "⚠️ **Security Guardrail**: Requests for exploit or malware generation are restricted. Copilot is specialized in technical interview preparation, algorithms, and career strategy."
            );
        }

        return SecurityVerdict.passed();
    }
}
