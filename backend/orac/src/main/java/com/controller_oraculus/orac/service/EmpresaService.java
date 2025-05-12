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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    private List<EmpresaDTO> converteDTO(List<Empresa> empresas) {
        return empresas.stream()
                .map(e -> new EmpresaDTO(e.getCod(), e.getNome(), e.getCnpj(), e.getRegime(), e.getCidade(), e.getVencimento(), e.getTipoCertificado(),
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
        if (empresaRepository.existsById(empresaDTO.cod())) {
            throw new IllegalArgumentException("Já existe uma empresa com esse código!");
        }
        if (empresaRepository.existsByCnpj(empresaDTO.cnpj())) {
            throw new IllegalArgumentException("Já existe uma empresa com esse CNPJ!");
        }
        Empresa empresa = new Empresa(
                empresaDTO.cod(),
                empresaDTO.nome(),
                empresaDTO.cnpj(),
                empresaDTO.regime(),
                empresaDTO.cidade(),
                empresaDTO.vencimento(),
                empresaDTO.tipoCertificado(),
                empresaDTO.ceo()
        );
        empresaRepository.save(empresa);
    }

    public Page<EmpresaDTO> filtrarEmpresas(Long cod, String nome, String cnpj, String regime, String cidade, String vencimentoMin, String vencimentoMax,  Pageable pageable) {
        LocalDate minDate = vencimentoMin != null && !vencimentoMin.isEmpty() ? LocalDate.parse(vencimentoMin) : null;
        LocalDate maxDate = vencimentoMax != null && !vencimentoMax.isEmpty() ? LocalDate.parse(vencimentoMax) : null;

        Page<Empresa> empresasPage = empresaRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (cod != null) {
                predicates.add(cb.equal(root.get("cod"), cod));
            }

            if (nome != null && !nome.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
            }

            if (cnpj != null && !cnpj.isEmpty()) {
                String cnpjLimpo = cnpj.replaceAll("\\D", "");
                predicates.add(cb.like(cb.function("regexp_replace", String.class, root.get("cnpj"), cb.literal("[^0-9]"), cb.literal("")), "%" + cnpjLimpo + "%"));
            }

            if (regime != null && !regime.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("regime")), "%" + regime.toLowerCase() + "%"));
            }

            if (cidade != null && !cidade.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("cidade")), "%" + cidade.toLowerCase() + "%"));
            }

            if (minDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("vencimento"), minDate));
            }

            if (maxDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("vencimento"), maxDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        List<EmpresaDTO> dtos = converteDTO(empresasPage.getContent());
        return new PageImpl<>(dtos, pageable, empresasPage.getTotalElements());
    }

    public void atualizarEmpresa(Long cod, EmpresaDTO empresaDTO) {
        empresaRepository.findByCnpjAndCodNot(empresaDTO.cnpj(), cod)
                .ifPresent(e -> {
                    throw new RuntimeException("Já existe uma empresa com esse CNPJ.");
                });
        Empresa empresa = new Empresa(
                empresaDTO.cod(),
                empresaDTO.nome(),
                empresaDTO.cnpj(),
                empresaDTO.regime(),
                empresaDTO.cidade(),
                empresaDTO.vencimento(),
                empresaDTO.tipoCertificado(),
                empresaDTO.ceo()
        );
        empresaRepository.save(empresa);
    }

    public void removerEmpresa(Long cod) {
        Empresa empresa = empresaRepository.findByCod(cod)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa não encontrada"));
        empresaRepository.delete(empresa);
    }

}

