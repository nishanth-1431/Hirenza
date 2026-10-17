package com.hirenza.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private String model;
    private String reasoning;
    private boolean securityRestricted;
    private String securityNotice;
    private List<String> suggestedChips;
    private long timestamp;

    public AiChatResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public AiChatResponse(String reply, String model) {
        this.reply = reply;
        this.model = model;
        this.timestamp = System.currentTimeMillis();
    }

    public AiChatResponse(String reply, String model, String reasoning, boolean securityRestricted, String securityNotice, List<String> suggestedChips) {
        this.reply = reply;
        this.model = model;
        this.reasoning = reasoning;
        this.securityRestricted = securityRestricted;
        this.securityNotice = securityNotice;
        this.suggestedChips = suggestedChips;
        this.timestamp = System.currentTimeMillis();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getReasoning() {
        return reasoning;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public boolean isSecurityRestricted() {
        return securityRestricted;
    }

    public void setSecurityRestricted(boolean securityRestricted) {
        this.securityRestricted = securityRestricted;
    }

    public String getSecurityNotice() {
        return securityNotice;
    }

    public void setSecurityNotice(String securityNotice) {
        this.securityNotice = securityNotice;
    }

    public List<String> getSuggestedChips() {
        return suggestedChips;
    }

    public void setSuggestedChips(List<String> suggestedChips) {
        this.suggestedChips = suggestedChips;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
