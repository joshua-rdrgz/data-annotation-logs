package com.dataannotationlogs.api.dalogs.repository.emailresettoken;

import com.dataannotationlogs.api.dalogs.entity.EmailResetToken;
import java.util.UUID;

/** EmailResetTokenRepository. */
public interface EmailResetTokenRepository {

  EmailResetToken save(EmailResetToken emailResetToken);

  EmailResetToken findByToken(String token);

  EmailResetToken findByUserId(UUID userId);

  void delete(EmailResetToken emailResetToken);
}
