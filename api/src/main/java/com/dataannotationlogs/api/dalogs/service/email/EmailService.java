package com.dataannotationlogs.api.dalogs.service.email;

/** EmailService. */
public interface EmailService {

  void sendEmail(String to, String subject, String content);
}
