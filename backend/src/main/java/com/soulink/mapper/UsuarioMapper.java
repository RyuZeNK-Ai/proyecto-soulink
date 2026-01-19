package com.soulink.mapper;

import com.soulink.dto.response.UsuarioResponseDTO;
import com.soulink.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        // Usar valor por defecto si nombre es null o vacío
        String nombre = usuario.getNombre();
        if (nombre == null || nombre.trim().isEmpty()) {
            nombre = "Usuario"; // Valor por defecto
        }

        return new UsuarioResponseDTO(
                usuario.getId_usuario(),
                nombre,  // Usar el nombre corregido
                usuario.getEmail()
        );
    }
}