package com.dataannotationlogs.api.dalogs.service.user;

import com.dataannotationlogs.api.dalogs.dto.email.EmailResetRequest;
import com.dataannotationlogs.api.dalogs.dto.email.EmailResetVerificationRequest;
import com.dataannotationlogs.api.dalogs.dto.password.PasswordChangeRequest;
import com.dataannotationlogs.api.dalogs.dto.password.PasswordResetVerifyRequest;
import com.dataannotationlogs.api.dalogs.dto.response.EntityChangeResponse;
import com.dataannotationlogs.api.dalogs.dto.user.UserDto;
import com.dataannotationlogs.api.dalogs.entity.User;

/** UserService. */
public interface UserService {

  UserDto getCurrentUser(User user);

  UserDto updateCurrentUser(User user, UserDto userDto);

  EntityChangeResponse sendEmailResetToken(User user, EmailResetRequest emailReset);

  EntityChangeResponse changeEmail(EmailResetVerificationRequest emailResetVerification);

  EntityChangeResponse cancelEmailResetToken(User user);

  EntityChangeResponse sendPasswordResetOtp(User user);

  EntityChangeResponse verifyPasswordResetOtp(User user, PasswordResetVerifyRequest request);

  EntityChangeResponse changePassword(User user, PasswordChangeRequest request);
}
