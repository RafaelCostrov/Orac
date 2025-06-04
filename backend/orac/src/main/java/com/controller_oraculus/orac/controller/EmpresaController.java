package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.mapper.EmpresaMapper;
import com.controller_oraculus.orac.service.EmpresaService;
import com.lowagie.text.DocumentException;
import jakarta.servlet.http.HttpServletResponse;
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

import java.io.IOException;
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
            @RequestParam(required = false) String vencimentoMin,
            @RequestParam(required = false) String vencimentoMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return empresaService.filtrarEmpresas(cod, nome, cnpj, regime, cidade, vencimentoMin, vencimentoMax, pageable);
    }

    @PostMapping("/empresas")
    public ResponseEntity<String> adicionarEmpresa(
            @RequestBody EmpresaDTO empresaDTO
    ) {
       try {
            EmpresaDTO dto = EmpresaMapper.mapDtoTratado(empresaDTO, empresaDTO.cod());
            empresaService.cadastrarEmpresa(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Empresa adicionada com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao adicionar empresa: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao adicionar empresa: \n" + e.getMessage());
        }
    }

    @PutMapping("/empresas/{cod}")
    public ResponseEntity<String> atualizarEmpresa(@PathVariable Long cod, @RequestBody EmpresaDTO dto) {
        try {
            EmpresaDTO empresaDTO = EmpresaMapper.mapDtoTratado(dto, cod);
            empresaService.atualizarEmpresa(cod, empresaDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Empresa atualizada com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao atualizar empresa: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar empresa: \n" + e.getMessage());
        }
    }

    @DeleteMapping("/empresas/{cod}")
    public ResponseEntity<String> removerEmpresa(@PathVariable Long cod) {
        try {
            empresaService.removerEmpresa(cod);
            return ResponseEntity.ok("Empresa removida com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao remover empresa: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao remover empresa: \n" + e.getMessage());
        }
    }

    @GetMapping("/empresas/exportar/csv")
    public void exportarCsv(HttpServletResponse response) throws IOException {
        empresaService.exportarCsv(response);
    }

    @GetMapping("/empresas/exportar/pdf")
    public void exportarPdf(HttpServletResponse response) throws IOException, DocumentException {
        empresaService.exportarPdf(response);
    }

    @PostMapping("/empresas/importar")
    public ResponseEntity<?> importarEmpresas(@RequestParam("file") MultipartFile file) {
        try {
            empresaService.importarCsv(file);
            return ResponseEntity.ok("Empresas importadas com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao importar empresas: " + e.getMessage());
        }
    }

}

