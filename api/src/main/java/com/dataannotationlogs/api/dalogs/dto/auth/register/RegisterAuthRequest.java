package com.dataannotationlogs.api.dalogs.dto.auth.register;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterAuthRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;

}
