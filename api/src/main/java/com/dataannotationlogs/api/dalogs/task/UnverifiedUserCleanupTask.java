package com.dataannotationlogs.api.dalogs.task;

import com.dataannotationlogs.api.dalogs.entity.User;
import com.dataannotationlogs.api.dalogs.repository.user.UserRepository;
import com.dataannotationlogs.api.dalogs.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UnverifiedUserCleanupTask {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 0 * * *") // Run every day at midnight
    public void cleanupUnverifiedUsers() {
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(30);
        LocalDateTime reminderThresholdDate = LocalDateTime.now().minusDays(23);

        List<User> unverifiedUsers = userRepository.findUnverifiedUsers();

        for (User user : unverifiedUsers) {
            LocalDateTime createdAt = user.getCreatedAt();

            if (createdAt.isBefore(thresholdDate)) {
                userRepository.delete(user);
                emailService.sendEmail(user.getEmail(), "Account Deleted",
                        "Your account has been deleted due to inactivity. Please sign up again to continue using the platform.");
            } else if (createdAt.isBefore(reminderThresholdDate)) {
                emailService.sendEmail(user.getEmail(), "Account Verification Reminder",
                        "Please verify your account within the next 7 days to avoid account deletion.");
            }
        }
    }

}
