package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.dto.ObrigacaoDTO;
import com.controller_oraculus.orac.enums.Status;
import com.controller_oraculus.orac.enums.TipoObrigacao;
import com.controller_oraculus.orac.model.Empresa;
import com.controller_oraculus.orac.model.Obrigacao;
import com.controller_oraculus.orac.repositorio.EmpresaRepository;
import com.controller_oraculus.orac.repositorio.ObrigacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ObrigacaoService {

    private final EmpresaRepository empresaRepository;
    private final ObrigacaoRepository obrigacaoRepository;

    public void criarObrigacoesDCTFWeb(String competencia) {
        List<Empresa> empresas = empresaRepository.findAll();

        for (Empresa empresa : empresas) {
            if (isMatriz(empresa.getCnpj()) && isRegimeFederalNormal(empresa.getRegime())) {

                Obrigacao obrigacao = new Obrigacao();
                obrigacao.setStatus(Status.PENDENTE);
                obrigacao.setTipoObrigacao(TipoObrigacao.DCTF_WEB);
                obrigacao.setCompetencia(competencia);
                obrigacao.setEmpresa(empresa);

                obrigacaoRepository.save(obrigacao);
            }
        }
    }

    private boolean isMatriz(String cnpj) {
        if (cnpj == null || cnpj.length() < 4) return false;
        char terceiroDeTras = cnpj.charAt(cnpj.length() - 3);
        return terceiroDeTras == '1';
    }

    private boolean isRegimeFederalNormal(String regime) {
        if (regime == null) return false;
        return regime.equalsIgnoreCase("Simples Nacional")
                || regime.equalsIgnoreCase("Lucro Presumido")
                || regime.equalsIgnoreCase("Lucro Real");
    }

    public Page<ObrigacaoDTO> filtrarObrigacoes(
            TipoObrigacao tipoObrigacao,
            String competenciaMin,
            String competenciaMax,
            String status,
            Long empresaCod,
            String empresaNome,
            String empresaCnpj,
            String empresaRegime,
            String responsavel,
            Pageable pageable
    ) {
        Page<Obrigacao> obrigacoesPage = obrigacaoRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tipoObrigacao != null) {
                predicates.add(cb.equal(root.get("tipoObrigacao"), tipoObrigacao));
            }

            if (competenciaMin != null && !competenciaMin.isEmpty()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("competencia"), competenciaMin));
            }

            if (competenciaMax != null && !competenciaMax.isEmpty()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("competencia"), competenciaMax));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), Status.valueOf(status.toUpperCase())));
            }

            if (empresaCod != null) {
                predicates.add(cb.equal(root.get("empresa").get("cod"), empresaCod));
            }

            if (empresaNome != null && !empresaNome.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("empresa").get("nome")), "%" + empresaNome.toLowerCase() + "%"));
            }

            if (empresaCnpj != null && !empresaCnpj.isEmpty()) {
                String cnpjLimpo = empresaCnpj.replaceAll("\\D", "");
                predicates.add(cb.like(cb.function("regexp_replace", String.class, root.get("empresa").get("cnpj"),
                        cb.literal("[^0-9]"), cb.literal("")), "%" + cnpjLimpo + "%"));
            }

            if (empresaRegime != null && !empresaRegime.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("empresa").get("regime")), "%" + empresaRegime.toLowerCase() + "%"));
            }

            if (responsavel != null && !responsavel.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("empresa").get("responsavelFiscal")), "%" + responsavel.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        List<ObrigacaoDTO> dtos = obrigacoesPage.getContent().stream()
                .map(o -> new ObrigacaoDTO(
                        o.getCod(),
                        o.getEmpresa().getNome(),
                        o.getEmpresa().getCnpj(),
                        o.getEmpresa().getRegime(),
                        o.getEmpresa().getResponsavelFiscal(),
                        o.getCompetencia(),
                        o.getStatus().name(),
                        o.getArquivos(),
                        o.getEmpresa().getCod()
                ))
                .toList();

        return new PageImpl<>(dtos, pageable, obrigacoesPage.getTotalElements());
    }

    public void atualizarStatus(Long id, String novoStatus) {
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Obrigação não encontrada com id: " + id));

        obrigacao.setStatus(Status.valueOf(novoStatus));
        obrigacaoRepository.save(obrigacao);
    }
}

