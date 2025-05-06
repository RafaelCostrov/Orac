package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.model.Empresa;
import com.controller_oraculus.orac.repositorio.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public Page<EmpresaDTO> obterEmpresas(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Empresa> result = empresaRepository.findAll(pageable);
        List<EmpresaDTO> dtos = converteDTO(result.getContent());
        return new PageImpl<>(dtos, pageable, result.getTotalElements());
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

    public Page<EmpresaDTO> filtrarEmpresas(Long cod, String empresa, String cnpj, String regimeTributario, String cidade, Pageable pageable) {
        Page<Empresa> empresasPage = empresaRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (cod != null) {
                predicates.add(cb.equal(root.get("cod"), cod));
            }

            if (empresa != null && !empresa.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + empresa.toLowerCase() + "%"));
            }

            if (cnpj != null && !cnpj.isEmpty()) {
                String cnpjLimpo = cnpj.replaceAll("\\D", "");
                predicates.add(cb.like(cb.function("regexp_replace", String.class, root.get("cnpj"), cb.literal("[^0-9]"), cb.literal("")), "%" + cnpjLimpo + "%"));
            }

            if (regimeTributario != null && !regimeTributario.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("regimeTributario")), "%" + regimeTributario.toLowerCase() + "%"));
            }

            if (cidade != null && !cidade.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("cidade")), "%" + cidade.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        List<EmpresaDTO> dtos = converteDTO(empresasPage.getContent());
        return new PageImpl<>(dtos, pageable, empresasPage.getTotalElements());
    }
}

