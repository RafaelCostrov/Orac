package com.controller_oraculus.orac.dto;

public record UsuarioDTO(
        Long id,
        String nome,
        String email,
        String senha,
        String nivel
) {
}
