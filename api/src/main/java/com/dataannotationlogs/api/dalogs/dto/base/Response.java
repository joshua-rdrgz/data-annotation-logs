package com.dataannotationlogs.api.dalogs.dto.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

@Data
public abstract class Response<T> {

    private final String status;
    private final int statusCode;

    @JsonInclude(Include.NON_NULL)
    private final T data;

}
