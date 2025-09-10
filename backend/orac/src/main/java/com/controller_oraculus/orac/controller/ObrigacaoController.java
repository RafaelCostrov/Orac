package com.controller_oraculus.orac.controller;

import com.controller_oraculus.orac.dto.ObrigacaoDTO;
import com.controller_oraculus.orac.enums.TipoObrigacao;
import com.controller_oraculus.orac.service.ObrigacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/obrigacoes")
@RequiredArgsConstructor
public class ObrigacaoController {

    private final ObrigacaoService obrigacaoService;

    @GetMapping("/filtrar")
    public Page<ObrigacaoDTO> filtrarPorTipoECompetencia(
            @RequestParam(required = false) TipoObrigacao tipoObrigacao,
            @RequestParam(required = false) String competenciaMin,
            @RequestParam(required = false) String competenciaMax,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long empresaCod,
            @RequestParam(required = false) String empresaNome,
            @RequestParam(required = false) String empresaCnpj,
            @RequestParam(required = false) String empresaRegime,
            @RequestParam(required = false) String responsavel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size

    ) {
        Pageable pageable = PageRequest.of(page, size);
        return obrigacaoService.filtrarObrigacoes(tipoObrigacao,
                competenciaMin,
                competenciaMax,
                status,
                empresaCod,
                empresaNome,
                empresaCnpj,
                empresaRegime,
                responsavel,
                pageable);
    }

    @PostMapping("/criar-dctf-web")
    public String criarObrigacoesDCTFWeb(@RequestParam String competencia) {
        obrigacaoService.criarObrigacoesDCTFWeb(competencia);
        System.out.println("Criando DCTF Web");
        return "Obrigações DCTF Web criadas para competência " + competencia;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String novoStatus = body.get("status");
        obrigacaoService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok().build();
    }
}
