package com.dataannotationlogs.api.dalogs.repository.email_reset_token.impl;

import com.dataannotationlogs.api.dalogs.entity.EmailResetToken;
import com.dataannotationlogs.api.dalogs.repository.email_reset_token.EmailResetTokenRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class EmailResetTokenRepositoryImpl implements EmailResetTokenRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public EmailResetToken save(EmailResetToken emailResetToken) {
        entityManager.persist(emailResetToken);
        return emailResetToken;
    }

    @Override
    public EmailResetToken findByToken(String token) {
        try {
            return entityManager
                    .createQuery("SELECT et FROM EmailResetToken et WHERE et.token = :token", EmailResetToken.class)
                    .setParameter("token", token)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public EmailResetToken findByUserId(UUID userId) {
        try {
            return entityManager
                    .createQuery("SELECT et FROM EmailResetToken et WHERE et.userId = :userId", EmailResetToken.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public void delete(EmailResetToken emailResetToken) {
        entityManager.remove(emailResetToken);
    }

}