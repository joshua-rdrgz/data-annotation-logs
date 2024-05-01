package com.dataannotationlogs.api.dalogs.config;

import lombok.Getter;

public class PublicRoutes {

    @Getter
    private static String[] whiteList = {
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/logout",
            "/api/v1/test/public",
    };

}
