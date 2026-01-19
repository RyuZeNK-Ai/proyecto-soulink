package com.soulink.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestDTO {

    private String email;
    private String password;

    public LoginRequestDTO() {
    }

}
