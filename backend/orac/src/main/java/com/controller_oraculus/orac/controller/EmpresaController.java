package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

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


}
