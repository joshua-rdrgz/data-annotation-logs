package com.dataannotationlogs.api.dalogs.controller;

import com.dataannotationlogs.api.dalogs.dto.auth.AuthResponse;
import com.dataannotationlogs.api.dalogs.dto.auth.login.LoginAuthRequest;
import com.dataannotationlogs.api.dalogs.dto.auth.register.RegisterAuthRequest;
import com.dataannotationlogs.api.dalogs.service.auth.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterAuthRequest entity) {
        return ResponseEntity.ok(authService.register(entity));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginAuthRequest entity, HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(entity, response));
    }

    @GetMapping("/logout")
    public ResponseEntity<AuthResponse> logouEntity(HttpServletResponse response) {
        return ResponseEntity.ok(authService.logout(response));
    }

}
