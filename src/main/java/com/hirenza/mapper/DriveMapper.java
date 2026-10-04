package com.hirenza.mapper;

import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.RuleType;
import com.hirenza.dto.DriveResponse;
import com.hirenza.dto.EligibilityRuleDto;

public class DriveMapper {
    
    public static DriveResponse toResponse(Drive drive) {
        DriveResponse response = new DriveResponse();
        response.setId(drive.getId());
        response.setCompanyName(drive.getCompanyName());
        response.setRole(drive.getRole());
        response.setApplicationDeadline(drive.getApplicationDeadline());
        
        if (drive.getEligibilityRules() != null && !drive.getEligibilityRules().isEmpty()) {
            EligibilityRuleDto rulesDto = new EligibilityRuleDto();
            for (EligibilityRule rule : drive.getEligibilityRules()) {
                if (rule.getRuleType() == RuleType.CGPA_CUTOFF) rulesDto.setCgpaCutoff(rule.getCgpaCutoff());
                if (rule.getRuleType() == RuleType.BRANCH_WHITELIST) rulesDto.setAllowedBranches(rule.getAllowedBranches());
                if (rule.getRuleType() == RuleType.MAX_ARREARS) rulesDto.setMaxArrears(rule.getMaxArrears());
            }
            response.setEligibilityRules(rulesDto);
        }
        return response;
    }
}
