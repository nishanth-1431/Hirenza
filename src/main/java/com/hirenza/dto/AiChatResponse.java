package com.hirenza.dto;

public class AiChatResponse {
    private String reply;
    private String model;
    private long timestamp;

    public AiChatResponse() {
    }

    public AiChatResponse(String reply, String model) {
        this.reply = reply;
        this.model = model;
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

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
