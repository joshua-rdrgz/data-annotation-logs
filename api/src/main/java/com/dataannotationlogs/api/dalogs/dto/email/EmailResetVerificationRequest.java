package com.dataannotationlogs.api.dalogs.dto.email;

import lombok.Data;
import lombok.NoArgsConstructor;

/** EmailResetVerificationRequest. */
@Data
@NoArgsConstructor
public class EmailResetVerificationRequest {

  private String token;
}
