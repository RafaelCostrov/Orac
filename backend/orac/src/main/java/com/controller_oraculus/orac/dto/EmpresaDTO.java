package com.controller_oraculus.orac.dto;

import java.time.LocalDate;

public record EmpresaDTO(Long cod,
                         String empresa,
                         String cnpj,
                         String regimeTributario,
                         String cidade,
                         LocalDate vencimento,
                         String tipoCertificado,
                         String ceo) {
}
