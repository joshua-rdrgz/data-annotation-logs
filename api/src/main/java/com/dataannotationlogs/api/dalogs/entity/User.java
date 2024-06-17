package com.dataannotationlogs.api.dalogs.entity;

import com.dataannotationlogs.api.dalogs.converter.StringAttributeConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** User. */
@Entity
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "_user")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "ID")
  private UUID id;

  @Convert(converter = StringAttributeConverter.class)
  @Column(name = "first_name")
  private String firstName;

  @Convert(converter = StringAttributeConverter.class)
  @Column(name = "last_name")
  private String lastName;

  @Column(name = "email", unique = true, nullable = false)
  private String email;

  @JsonIgnore
  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "verified", nullable = false)
  private boolean verified;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "last_updated_at", nullable = false)
  private LocalDateTime lastUpdatedAt;

  /** PrePersist. */
  @PrePersist
  public void prePersist() {
    LocalDateTime currentTime = LocalDateTime.now();
    createdAt = currentTime;
    lastUpdatedAt = currentTime;
  }

  /** PreUpdate. */
  @PreUpdate
  public void preUpdate() {
    lastUpdatedAt = LocalDateTime.now();
  }
}
