package com.dataannotationlogs.api.dalogs.service.user;

import com.dataannotationlogs.api.dalogs.dto.email.EmailResetRequest;
import com.dataannotationlogs.api.dalogs.dto.email.EmailResetVerificationRequest;
import com.dataannotationlogs.api.dalogs.dto.response.EntityChangeResponse;
import com.dataannotationlogs.api.dalogs.dto.user.UserDTO;
import com.dataannotationlogs.api.dalogs.entity.User;

/** UserService. */
public interface UserService {

  UserDTO getCurrentUser(User user);

  UserDTO updateCurrentUser(User user, UserDTO userDto);

  EntityChangeResponse sendEmailResetToken(User user, EmailResetRequest emailReset);

  EntityChangeResponse changeEmail(User user, EmailResetVerificationRequest token);
}
