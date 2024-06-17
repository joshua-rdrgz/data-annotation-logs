package com.dataannotationlogs.api.dalogs.service.auth;

import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.response.EntityChangeResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

/** AuthService. */
public interface AuthService {

  EntityChangeResponse register(RegisterAuthRequest entity);

  EntityChangeResponse login(LoginAuthRequest entity, HttpServletResponse response);

  EntityChangeResponse logout(HttpServletResponse response);

  EntityChangeResponse verifyAccount(String token, UUID userId);

  EntityChangeResponse resendVerificationEmail(String email);
}
