package com.dataannotationlogs.api.dalogs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DALogsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DALogsApplication.class, args);
    }

}
