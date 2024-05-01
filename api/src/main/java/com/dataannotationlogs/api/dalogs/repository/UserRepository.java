package com.dataannotationlogs.api.dalogs.repository;

import com.dataannotationlogs.api.dalogs.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);

    User findFirstById(UUID id);

}
