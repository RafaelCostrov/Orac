package com.controller_oraculus.orac.repositorio;

import com.controller_oraculus.orac.enums.TipoObrigacao;
import com.controller_oraculus.orac.model.Obrigacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;


public interface ObrigacaoRepository extends JpaRepository<Obrigacao, Long>, JpaSpecificationExecutor<Obrigacao> {
    Page<Obrigacao> findByTipoObrigacaoAndCompetencia(TipoObrigacao tipoObrigacao, String competencia, Pageable pageable);
    Page<Obrigacao> findAll(Pageable pageable);
}
