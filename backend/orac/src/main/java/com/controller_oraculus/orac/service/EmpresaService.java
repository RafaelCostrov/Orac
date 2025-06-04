package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.dto.EmpresaDTO;
import com.controller_oraculus.orac.model.Empresa;
import com.controller_oraculus.orac.repositorio.EmpresaRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.awt.Color;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    public Page<EmpresaDTO> filtrarEmpresas(Long cod, String nome, String cnpj, String regime, String cidade, String vencimentoMin, String vencimentoMax, Pageable pageable) {
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

    public void exportarCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=empresas.csv");

        List<Empresa> empresas = empresaRepository.findAll();


        try (PrintWriter writer = response.getWriter()) {
            writer.println("cod,nome,cnpj,regime,cidade,vencimento,tipo do certificado, ceo");
            for (Empresa empresa : empresas) {
                writer.printf("%s,%s,%s,%s,%s,%s,%s,%s%n",
                        empresa.getCod(),
                        empresa.getNome(),
                        empresa.getCnpj(),
                        empresa.getRegime(),
                        empresa.getCidade(),
                        empresa.getVencimento(),
                        empresa.getTipoCertificado(),
                        empresa.getCeo()
                );
            }

        }
    }

    private PdfPCell celulaComEstilo(String texto, Font fonte, Color fundo, int alinhamento) {
        PdfPCell cell = new PdfPCell(new Phrase(texto != null ? texto : "", fonte));
        cell.setBackgroundColor(fundo);
        cell.setPadding(5);
        cell.setHorizontalAlignment(alinhamento);
        return cell;
    }

    private String formatarCnpj(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) return cnpj;
        return cnpj.replaceFirst("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
    }

    private String formatarData(LocalDate data) {
        return data != null ? data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "-";
    }

    private String formatarTipo(String tipo) {
        return tipo != null ? tipo : "-";
    }

    public void exportarPdf(HttpServletResponse response) throws IOException, DocumentException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=empresas.pdf");

        List<Empresa> empresas = empresaRepository.findAll();
        try {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();
            document.addTitle("Empresas");

            Font fonteCabecalho = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(255, 255, 255));
            Font fonteCelula = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(0, 0, 0));

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 3f, 2f, 1.8f, 2f, 1.8f, 1.5f, 1.8f});
            String[] colunas = {"Cód.", "Empresa", "CNPJ", "Regime", "Cidade", "Vencimento", "Tipo do certificado", "Ceo"};
            PdfPCell cell;
            for (String coluna : colunas) {
                cell = new PdfPCell(new Phrase(coluna, fonteCabecalho));
                cell.setBackgroundColor(new Color(0, 130, 199));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }
            boolean corAlternada = false;
            for (Empresa empresa : empresas) {
                Color corFundo = corAlternada ? new Color(232, 245, 255) : new Color(255, 255, 255);
                table.addCell(celulaComEstilo(String.valueOf(empresa.getCod()), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(empresa.getNome(), fonteCelula, corFundo, Element.ALIGN_LEFT)); // só "Empresa" alinhada à esquerda
                table.addCell(celulaComEstilo(formatarCnpj(empresa.getCnpj()), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(empresa.getRegime(), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(empresa.getCidade(), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(formatarData(empresa.getVencimento()), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(formatarTipo(empresa.getTipoCertificado()), fonteCelula, corFundo, Element.ALIGN_CENTER));
                table.addCell(celulaComEstilo(empresa.getCeo(), fonteCelula, corFundo, Element.ALIGN_CENTER));

                corAlternada = !corAlternada;
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new DocumentException(e.getMessage());
        }

    }

    public void importarCsv(MultipartFile file) throws IOException {
        List<Empresa> empresas = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String linha;
            boolean primeira = true;

            while ((linha = reader.readLine()) != null) {
                if (primeira) {
                    primeira = false;
                    continue;
                }
                String[] campos = linha.split(";"); // ou "," dependendo do separador
                Empresa emp = new Empresa();
                emp.setCod(Long.parseLong(campos[0]));
                emp.setNome(campos[1]);
                emp.setCnpj(campos[2]);
                emp.setRegime(campos[3]);
                emp.setCidade(campos[4]);
                emp.setVencimento(LocalDate.parse(campos[5], DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                emp.setTipoCertificado(campos[6]);
                emp.setCeo(campos[7]);

                empresas.add(emp);
            }
            empresaRepository.saveAll(empresas);
        }
    }
}



