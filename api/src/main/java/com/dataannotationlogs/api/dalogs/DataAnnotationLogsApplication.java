package com.dataannotationlogs.api.dalogs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/** DataAnnotationLogsApplication. */
@SpringBootApplication
@EnableScheduling
public class DataAnnotationLogsApplication {

  public static void main(String[] args) {
    SpringApplication.run(DataAnnotationLogsApplication.class, args);
  }
}
