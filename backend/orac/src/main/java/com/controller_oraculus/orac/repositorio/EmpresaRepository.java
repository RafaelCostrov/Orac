package com.controller_oraculus.orac.repositorio;

import com.controller_oraculus.orac.model.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long>, JpaSpecificationExecutor<Empresa> {

    Page<Empresa> findAll(Pageable pageable);
    Optional<Empresa> findByCod(Long cod);
    Optional<Empresa> findByCnpjAndCodNot(String nome, Long cod);
    boolean existsByCnpj(String cnpj);
}
