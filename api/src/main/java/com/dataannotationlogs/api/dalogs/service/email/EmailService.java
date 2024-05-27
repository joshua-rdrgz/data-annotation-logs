package com.dataannotationlogs.api.dalogs.service.email;

public interface EmailService {

    void sendEmail(String to, String subject, String content);

}
