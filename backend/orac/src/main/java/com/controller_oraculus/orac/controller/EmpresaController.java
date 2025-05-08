package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;
    private static final Logger logger = LoggerFactory.getLogger(EmpresaController.class);

    @GetMapping("/empresas")
    public Page<EmpresaDTO> obterEmpresas(
            @RequestParam(required = false) Long cod,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cnpj,
            @RequestParam(required = false) String regime,
            @RequestParam(required = false) String cidade,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return empresaService.filtrarEmpresas(cod, nome, cnpj, regime, cidade, pageable);
    }

    @PostMapping("/empresas")
    public ResponseEntity<String> adicionarEmpresa(
            @RequestParam("cod") Long cod,
            @RequestParam("nome") String nome,
            @RequestParam("cnpj") String cnpj,
            @RequestParam("regime") String regime,
            @RequestParam("cidade") String cidade,
            @RequestParam("vencimento") String vencimento,
            @RequestParam("tipoCertificado") String tipoCertificado,
            @RequestParam("ceo") String ceo
    ) {
        logger.info("Recebendo requisição para adicionar empresa: cod={}, nome={}, cnpj={}, regime={}, cidade={}, vencimento={}, tipoCertificado={}, ceo={}",
                cod, nome, cnpj, regime, cidade, vencimento, tipoCertificado, ceo);
        try {
            String cnpjLimpo = cnpj.replaceAll("\\D", "");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate dataVencimento = LocalDate.parse(vencimento, formatter);
            EmpresaDTO dto = new EmpresaDTO(cod, nome, cnpjLimpo, regime, cidade, dataVencimento, tipoCertificado, ceo);
            empresaService.cadastrarEmpresa(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Empresa adicionada com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao adicionar empresa: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao adicionar empresa: " + e.getMessage());
        }
    }

}
