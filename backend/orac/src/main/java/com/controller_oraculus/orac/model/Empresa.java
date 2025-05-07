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
    private String nome;
    @Column(nullable = false, unique = true)
    private String cnpj;
    private String regime;
    private String cidade;
    private LocalDate vencimento;
    private String tipoCertificado;
    private String ceo;

    public Empresa(Long cod, String nome, String cnpj, String regime, String cidade, LocalDate vencimento, String tipoCertificado, String ceo) {
        this.cod = cod;
        this.nome = nome;
        this.cnpj = cnpj;
        this.regime = regime;
        this.cidade = cidade;
        this.vencimento = vencimento;
        this.tipoCertificado = tipoCertificado;
        this.ceo = ceo;
    }
}
