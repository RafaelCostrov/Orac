package com.controller_oraculus.orac.mapper;

import com.controller_oraculus.orac.dto.EmpresaDTO;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class EmpresaMapper {
    public static EmpresaDTO mapDtoTratado(EmpresaDTO dto, Long cod) {
        String cnpjLimpo = dto.cnpj().replaceAll("\\D", "");

        return new EmpresaDTO(cod, dto.nome(), cnpjLimpo, dto.regime(), dto.cidade(), dto.responsavelFiscal(), dto.vencimento(), dto.tipoCertificado(), dto.ceo());
    }
}