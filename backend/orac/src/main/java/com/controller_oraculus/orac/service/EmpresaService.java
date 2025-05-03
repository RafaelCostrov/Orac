package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.model.Empresa;
import com.controller_oraculus.orac.repositorio.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    private List<EmpresaDTO> converteDTO(List<Empresa> empresas) {
        return empresas.stream()
                .map(e -> new EmpresaDTO(e.getCod(), e.getEmpresa(), e.getCnpj(), e.getRegimeTributario(), e.getCidade(), e.getVencimento(), e.getTipoCertificado(),
                        e.getCeo()))
                .collect(Collectors.toList());
    }

    public List<EmpresaDTO> obtenEmpresas() {
        Pageable pageable = PageRequest.of(0, 50);
        return converteDTO(empresaRepository.findAll(pageable).getContent());
    }

    public void cadastrarEmpresa(EmpresaDTO empresaDTO) {
        Empresa empresa = new Empresa(
                empresaDTO.cod(),
                empresaDTO.empresa(),
                empresaDTO.cnpj(),
                empresaDTO.regimeTributario(),
                empresaDTO.cidade(),
                empresaDTO.vencimento(),
                empresaDTO.tipoCertificado(),
                empresaDTO.ceo()
        );
        empresaRepository.save(empresa);
    }
}

