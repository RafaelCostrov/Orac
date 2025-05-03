package com.controller_oraculus.orac.controller;
import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/empresas")
    public ResponseEntity<List<EmpresaDTO>> listarEmpresas(){
        List<EmpresaDTO> empresaDTOS = empresaService.obtenEmpresas();
        return ResponseEntity.ok(empresaDTOS);
    }
}
