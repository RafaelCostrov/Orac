package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.auxiliar.AuthRequest;
import com.controller_oraculus.orac.auxiliar.AuthResponse;
import com.controller_oraculus.orac.auxiliar.RegisterRequest;
import com.controller_oraculus.orac.model.Usuario;
import com.controller_oraculus.orac.repositorio.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public AuthResponse registrar(RegisterRequest request) {
        try {
            Usuario usuario = new Usuario(
                    request.getNome(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getSenha())
            );
            usuarioRepository.save(usuario);
            var jwtToken = jwtService.gerarToken(usuario);
            return AuthResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (Exception e) {
            logger.error("Erro ao registrar: {}", e.getMessage());
            throw e;
        }
    }

    public AuthResponse autenticar(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getSenha()
                    )
            );
        } catch (Exception e) {
            logger.error("Erro ao autenticar: {}", e.getMessage());
            throw e;
        }
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado")
                );
        var jwtToken = jwtService.gerarToken(usuario);
        return AuthResponse.builder()
                .token(jwtToken)
                .nome(usuario.getNome())
                .build();
    }
}
