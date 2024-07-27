package com.dataannotationlogs.api.dalogs.dto.password;

import lombok.Data;
import lombok.NoArgsConstructor;

/** PasswordChangeRequest. */
@Data
@NoArgsConstructor
public class PasswordChangeRequest {
  private String newPassword;
}
