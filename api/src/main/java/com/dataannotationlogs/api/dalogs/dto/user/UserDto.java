package com.dataannotationlogs.api.dalogs.dto.user;

import com.dataannotationlogs.api.dalogs.entity.EmailResetToken;
import com.dataannotationlogs.api.dalogs.entity.User;
import lombok.Builder;
import lombok.Data;

/** UserDto. */
@Data
@Builder
public class UserDto {

  private String firstName;
  private String lastName;
  private String email;
  private boolean pendingEmailChange;
  private String pendingEmail;

  /** Takes user and builds UserDto with it. */
  public static UserDto fromUser(User user, EmailResetToken emailResetToken) {
    return UserDto.builder()
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .email(user.getEmail())
        .pendingEmailChange(emailResetToken != null)
        .pendingEmail(emailResetToken != null ? emailResetToken.getNewEmail() : null)
        .build();
  }
}
