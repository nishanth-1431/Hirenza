package com.hirenza.dto;

import java.util.Set;

public class EligibilityRuleDto {
    private Double cgpaCutoff;
    private Set<String> allowedBranches;
    private Integer maxArrears;

    public Double getCgpaCutoff() { return cgpaCutoff; }
    public void setCgpaCutoff(Double cgpaCutoff) { this.cgpaCutoff = cgpaCutoff; }
    public Set<String> getAllowedBranches() { return allowedBranches; }
    public void setAllowedBranches(Set<String> allowedBranches) { this.allowedBranches = allowedBranches; }
    public Integer getMaxArrears() { return maxArrears; }
    public void setMaxArrears(Integer maxArrears) { this.maxArrears = maxArrears; }
}
