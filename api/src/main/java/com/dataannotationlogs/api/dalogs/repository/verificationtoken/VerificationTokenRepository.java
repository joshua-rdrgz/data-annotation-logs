package com.dataannotationlogs.api.dalogs.repository.verificationtoken;

import com.dataannotationlogs.api.dalogs.entity.VerificationToken;
import java.util.UUID;

/** VerificationTokenRepository. */
public interface VerificationTokenRepository {

  VerificationToken save(VerificationToken verificationToken);

  VerificationToken findByToken(String token);

  VerificationToken findByUserId(UUID userId);

  void delete(VerificationToken verificationToken);
}
