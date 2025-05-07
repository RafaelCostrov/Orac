package com.controller_oraculus.orac.dto;

import java.time.LocalDate;

public record EmpresaDTO(Long cod,
                         String nome,
                         String cnpj,
                         String regime,
                         String cidade,
                         LocalDate vencimento,
                         String tipoCertificado,
                         String ceo) {
}
