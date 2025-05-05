package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/empresas")
    public Page<EmpresaDTO> listarEmpresas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return empresaService.obterEmpresas(page, size);
    }
}
