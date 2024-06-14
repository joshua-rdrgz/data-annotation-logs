package com.dataannotationlogs.api.dalogs.dto.email_reset;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmailResetVerificationRequest {

    private String token;

}
