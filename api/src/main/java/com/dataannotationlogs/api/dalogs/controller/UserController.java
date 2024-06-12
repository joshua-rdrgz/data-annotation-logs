package com.dataannotationlogs.api.dalogs.controller;

import com.dataannotationlogs.api.dalogs.dto.email_reset.EmailResetRequest;
import com.dataannotationlogs.api.dalogs.dto.email_reset.EmailResetVerificationRequest;
import com.dataannotationlogs.api.dalogs.dto.response.EntityChangeResponse;
import com.dataannotationlogs.api.dalogs.dto.user.UserDTO;
import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getCurrentUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@AuthenticationPrincipal User user, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateCurrentUser(user, userDTO));
    }

    @PutMapping("/me/email")
    public ResponseEntity<EntityChangeResponse> sendEmailResetToken(@AuthenticationPrincipal User user,
            @RequestBody EmailResetRequest emailResetReq) {
        EntityChangeResponse response = userService.sendEmailResetToken(user, emailResetReq);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/email/verify")
    public ResponseEntity<EntityChangeResponse> changeEmail(@AuthenticationPrincipal User user,
            @RequestBody EmailResetVerificationRequest emailResetVerification) {
        EntityChangeResponse response = userService.changeEmail(user, emailResetVerification);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
