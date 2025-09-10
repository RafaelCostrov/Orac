package com.controller_oraculus.orac.dto;

import java.util.List;

public record ObrigacaoDTO(
        Long cod,
        String nome,
        String cnpj,
        String regime,
        String responsavel,
        String competencia,
        String status,
        List<String> arquivos,
        Long empresaCod
) {
}
