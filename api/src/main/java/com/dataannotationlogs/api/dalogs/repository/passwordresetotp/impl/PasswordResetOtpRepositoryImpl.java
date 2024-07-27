package com.dataannotationlogs.api.dalogs.repository.passwordresetotp.impl;

import com.dataannotationlogs.api.dalogs.entity.PasswordResetOtp;
import com.dataannotationlogs.api.dalogs.repository.passwordresetotp.PasswordResetOtpRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import java.util.UUID;
import org.springframework.stereotype.Repository;

/** PasswordResetOtpRepositoryImpl. */
@Repository
public class PasswordResetOtpRepositoryImpl implements PasswordResetOtpRepository {

  @PersistenceContext private EntityManager entityManager;

  @Override
  public PasswordResetOtp save(PasswordResetOtp otp) {
    entityManager.persist(otp);
    return otp;
  }

  @Override
  public PasswordResetOtp findByUserId(UUID userId) {
    try {
      return entityManager
          .createQuery(
              "SELECT o FROM PasswordResetOtp o WHERE o.userId = :userId", PasswordResetOtp.class)
          .setParameter("userId", userId)
          .getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }

  @Override
  public void delete(PasswordResetOtp otp) {
    entityManager.remove(otp);
  }
}
