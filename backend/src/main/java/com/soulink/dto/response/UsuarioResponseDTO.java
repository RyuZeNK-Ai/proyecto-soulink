package com.soulink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String email;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(Long id, String nombre, String email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }
}
