package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.auxiliar.AuthRequest;
import com.controller_oraculus.orac.auxiliar.AuthResponse;
import com.controller_oraculus.orac.auxiliar.RegisterRequest;
import com.controller_oraculus.orac.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {
       return ResponseEntity.ok(authService.registrar(request));
    }


    @PostMapping("/autenticar")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(authService.autenticar(request));
    }
}
