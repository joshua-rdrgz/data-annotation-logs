package com.dataannotationlogs.api.dalogs.service.auth;

import com.dataannotationlogs.api.dalogs.dto.auth.AuthResponse;
import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    AuthResponse register(RegisterAuthRequest entity);

    AuthResponse login(LoginAuthRequest entity, HttpServletResponse response);

    AuthResponse logout(HttpServletResponse response);

}