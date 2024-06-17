package com.dataannotationlogs.api.dalogs.dto.user;

import com.dataannotationlogs.api.dalogs.entity.User;
import lombok.Builder;
import lombok.Data;

/** UserDto. */
@Data
@Builder
public class UserDTO {

  private String firstName;
  private String lastName;
  private String email;

  /** Takes user and builds UserDto with it. */
  public static UserDTO fromUser(User user) {
    return UserDTO.builder()
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .email(user.getEmail())
        .build();
  }
}
