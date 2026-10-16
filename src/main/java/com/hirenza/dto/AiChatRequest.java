package com.hirenza.dto;

public class AiChatRequest {
    private String message;
    private String role;
    private Long userId;
    private String email;

    public AiChatRequest() {
    }

    public AiChatRequest(String message, String role, Long userId) {
        this(message, role, userId, null);
    }

    public AiChatRequest(String message, String role, Long userId, String email) {
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
