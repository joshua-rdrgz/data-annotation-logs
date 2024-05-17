package com.dataannotationlogs.api.dalogs.repository.user;

import com.dataannotationlogs.api.dalogs.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserRepository {

    User save(User user);

    User findByEmail(String email);

    User findFirstById(UUID id);

    void verifyUser(UUID userId);

    List<User> findUnverifiedUsers();

    void delete(User user);

}
