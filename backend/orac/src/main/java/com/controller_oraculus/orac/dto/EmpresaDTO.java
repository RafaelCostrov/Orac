package com.controller_oraculus.orac.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record EmpresaDTO(Long cod,
                         String nome,
                         String cnpj,
                         String regime,
                         String cidade,
                         @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
                         LocalDate vencimento,
                         String tipoCertificado,
                         String ceo) {
}
