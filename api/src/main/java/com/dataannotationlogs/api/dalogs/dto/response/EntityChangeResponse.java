package com.dataannotationlogs.api.dalogs.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatusCode;

/** EntityChangeResponse. */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EntityChangeResponse {

  private HttpStatusCode statusCode;
  private String status;
  private String message;
}
