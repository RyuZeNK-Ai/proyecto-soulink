package com.soulink.controller;

import com.soulink.dto.request.LoginRequestDTO;
import com.soulink.dto.request.UsuarioRegisterDTO;
import com.soulink.dto.response.LoginResponseDTO;
import com.soulink.dto.response.UsuarioResponseDTO;
import com.soulink.exception.BadRequestException;
import com.soulink.exception.ResourceNotFoundException;
import com.soulink.exception.UnauthorizedException;
import com.soulink.mapper.UsuarioMapper;
import com.soulink.model.Usuario;
import com.soulink.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.soulink.dto.request.UsuarioUpdateDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos()
                .stream()
                .map(usuarioMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO obtener(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return usuarioMapper.toResponseDTO(usuario);
    }

    @PostMapping("/register")
    public UsuarioResponseDTO registrar(@RequestBody UsuarioRegisterDTO dto) {

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new BadRequestException("El nombre es obligatorio");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BadRequestException("El email es obligatorio");
        }
        if (dto.getPassword() == null || dto.getPassword().length() < 4) {
            throw new BadRequestException("La contraseña debe tener al menos 4 caracteres");
        }

        Usuario usuario = usuarioService.registrar(dto);
        return usuarioMapper.toResponseDTO(usuario);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        System.out.println("=== DEBUG LOGIN INICIADO ===");
        System.out.println("Email recibido: " + dto.getEmail());

        Usuario usuario = usuarioService.login(dto.getEmail(), dto.getPassword())
                .orElseThrow(() -> new UnauthorizedException("Email o contraseña incorrectos"));

        System.out.println("=== DEBUG USUARIO ENCONTRADO ===");
        System.out.println("Usuario ID: " + usuario.getId_usuario());
        System.out.println("Usuario Nombre RAW: '" + usuario.getNombre() + "'");
        System.out.println("Usuario Nombre == null? " + (usuario.getNombre() == null));
        System.out.println("Usuario Nombre isEmpty? " + (usuario.getNombre() != null && usuario.getNombre().isEmpty()));

        // SOLUCIÓN DEFINITIVA - Forzar nombre
        String nombreFinal = usuario.getNombre();
        if (nombreFinal == null || nombreFinal.trim().isEmpty()) {
            nombreFinal = "Usuario_" + usuario.getId_usuario();
            System.out.println("Nombre corregido a: " + nombreFinal);
        }

        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO();
        usuarioDTO.setId(usuario.getId_usuario());
        usuarioDTO.setNombre(nombreFinal);
        usuarioDTO.setEmail(usuario.getEmail());

        System.out.println("=== DEBUG DTO CREADO ===");
        System.out.println("DTO Nombre: '" + usuarioDTO.getNombre() + "'");

        return new LoginResponseDTO(
                usuarioDTO,
                usuarioService.generarToken(usuario)
        );
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO actualizar(@PathVariable Long id, @RequestBody UsuarioUpdateDTO dto) {
        if (dto.getPassword() != null && dto.getPassword().length() < 4) {
            throw new BadRequestException("La contraseña debe tener al menos 4 caracteres");
        }

        Usuario usuarioActualizado = usuarioService.actualizar(id, dto);
        return usuarioMapper.toResponseDTO(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (usuarioService.obtenerPorId(id).isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        usuarioService.eliminar(id);
        return ResponseEntity.ok().body(java.util.Map.of("mensaje", "Usuario eliminado"));
    }
}