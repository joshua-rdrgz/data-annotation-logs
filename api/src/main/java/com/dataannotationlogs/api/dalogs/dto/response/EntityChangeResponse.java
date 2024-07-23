package com.dataannotationlogs.api.dalogs.dto.response;

import com.dataannotationlogs.api.dalogs.util.HttpStatusCodeDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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

  @JsonDeserialize(using = HttpStatusCodeDeserializer.class)
  private HttpStatusCode statusCode;

  private String status;
  private String message;
}
