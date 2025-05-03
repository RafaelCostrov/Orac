package com.controller_oraculus.orac.repositorio;

import com.controller_oraculus.orac.model.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Page<Empresa> findAll(Pageable pageable);
}
