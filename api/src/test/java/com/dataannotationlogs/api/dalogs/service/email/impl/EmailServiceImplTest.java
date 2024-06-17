package com.dataannotationlogs.api.dalogs.service.email.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.dataannotationlogs.api.dalogs.base.EmailTestBase;
import com.dataannotationlogs.api.dalogs.service.email.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** EmailServiceImplTest. */
@SpringBootTest
@ActiveProfiles("test")
public class EmailServiceImplTest extends EmailTestBase {

  @Autowired private EmailService emailService;

  @Test
  public void testSendEmail() throws Exception {
    String to = "test@localhost.com";
    String subject = "Test Subject";
    String content = "Test Content";

    emailService.sendEmail(to, subject, content);

    MimeMessage[] receivedMessages = greenMail.getReceivedMessages();
    assertThat(receivedMessages).hasSize(1);
    MimeMessage receivedMessage = receivedMessages[0];
    assertThat(receivedMessage.getSubject()).isEqualTo(subject);
    assertThat(receivedMessage.getAllRecipients()[0].toString()).isEqualTo(to);
    assertThat(receivedMessage.getContent().toString().trim()).contains(content);
  }
}
