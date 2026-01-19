package com.soulink.service.impl;

import com.soulink.config.JwtTokenProvider;
import com.soulink.dto.request.UsuarioRegisterDTO;
import com.soulink.dto.request.UsuarioUpdateDTO;
import com.soulink.model.Usuario;
import com.soulink.repository.UsuarioRepository;
import com.soulink.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return buildUserDetails(usuario);
    }

    // QUITA EL @Override DE ESTE MÉTODO (no está en la interfaz)
    public UserDetails buildUserDetails(Usuario usuario) {
        String role = "ROLE_USER";
        if (usuario.getId_rol() == 1L) role = "ROLE_ADMIN";

        GrantedAuthority authority = new SimpleGrantedAuthority(role);
        return new User(usuario.getEmail(), usuario.getPassword(), Collections.singletonList(authority));
    }

    // Los demás métodos con sus @Override correspondientes
    @Override
    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario registrar(UsuarioRegisterDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setId_rol(2L);

        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent() && passwordEncoder.matches(password, usuarioOpt.get().getPassword())) {
            return usuarioOpt;
        }

        return Optional.empty();
    }

    @Override
    public String generarToken(Usuario usuario) {
        return jwtTokenProvider.generateToken(usuario.getEmail());
    }

    @Override
    public Usuario actualizar(Long id, UsuarioUpdateDTO dto) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getNombre() != null) existente.setNombre(dto.getNombre());
        if (dto.getEmail() != null) existente.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            existente.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return usuarioRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario findByUsername(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}