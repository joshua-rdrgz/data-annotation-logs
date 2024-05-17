package com.dataannotationlogs.api.dalogs.repository.verification_token;

import com.dataannotationlogs.api.dalogs.entity.VerificationToken;

import java.util.UUID;

public interface VerificationTokenRepository {

    VerificationToken save(VerificationToken verificationToken);

    VerificationToken findByToken(String token);

    VerificationToken findByUserId(UUID userId);

    void delete(VerificationToken verificationToken);

}
