package com.soulink.service;

import com.soulink.dto.request.UsuarioRegisterDTO;
import com.soulink.model.Usuario;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UsuarioService extends UserDetailsService {

    Optional<Usuario> getUsuarioByEmail(String email);

    List<Usuario> listarTodos();

    Optional<Usuario> obtenerPorId(Long id);

    Usuario registrar(UsuarioRegisterDTO dto);

    Optional<Usuario> login(String email, String password);

    String generarToken(Usuario usuario);

    Usuario actualizar(Long id, Usuario usuario);

    void eliminar(Long id);

    Usuario findByUsername(String email);
}