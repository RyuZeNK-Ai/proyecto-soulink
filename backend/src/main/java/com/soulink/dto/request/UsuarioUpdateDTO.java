package com.soulink.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioUpdateDTO {
    private String nombre;
    private String email;
    private String password; // opcional
}
