package com.controller_oraculus.orac.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cod;
    @Column(nullable = false)
    private String empresa;
    @Column(nullable = false, unique = true)
    private String cnpj;
    private String regimeTributario;
    private String cidade;
    private LocalDate vencimento;
    private String tipoCertificado;
    private String ceo;

    public Empresa(Long cod, String empresa, String cnpj, String regimeTributario, String cidade, LocalDate vencimento, String tipoCertificado, String ceo) {
        this.cod = cod;
        this.empresa = empresa;
        this.cnpj = cnpj;
        this.regimeTributario = regimeTributario;
        this.cidade = cidade;
        this.vencimento = vencimento;
        this.tipoCertificado = tipoCertificado;
        this.ceo = ceo;
    }
}
