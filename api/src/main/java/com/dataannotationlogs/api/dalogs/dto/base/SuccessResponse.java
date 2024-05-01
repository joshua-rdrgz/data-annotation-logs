package com.dataannotationlogs.api.dalogs.dto.base;

public class SuccessResponse<T> extends Response<T> {

    public SuccessResponse(T data, int statusCode) {
        super("success", statusCode, data);
    }

}
