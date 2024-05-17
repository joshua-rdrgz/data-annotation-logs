package com.dataannotationlogs.api.dalogs.repository.user.impl;

import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.entity.VerificationToken;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public User save(User user) {
        entityManager.persist(user);
        return user;
    }

    public User findByEmail(String email) {
        try {
            TypedQuery<User> query = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.email = :email", User.class);
            query.setParameter("email", email);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public User findFirstById(UUID id) {
        return entityManager.find(User.class, id);
    }

    public void verifyUser(UUID userId) {
        User user = findFirstById(userId);
        if (user != null) {
            if (user.isVerified()) {
                return;
            }

            VerificationToken verificationToken;
            try {
                verificationToken = entityManager.createQuery(
                        "SELECT vt FROM VerificationToken vt WHERE vt.userId = :userId", VerificationToken.class)
                        .setParameter("userId", userId)
                        .getSingleResult();
            } catch (NoResultException e) {
                // Verification token not found for unverified user, do not proceed
                return;
            }

            user.setVerified(true);
            entityManager.merge(user);
            entityManager.remove(verificationToken);
        }
    }

    public List<User> findUnverifiedUsers() {
        try {
            TypedQuery<User> query = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.verified = false", User.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        }
    }

    public void delete(User user) {
        entityManager.remove(user);
    }

}
