package com.controller_oraculus.orac.model;

import com.controller_oraculus.orac.enums.Status;
import com.controller_oraculus.orac.enums.TipoObrigacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "obrigacoes")
public class Obrigacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cod;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoObrigacao tipoObrigacao;
    @ManyToOne
    @JoinColumn(name = "usuario_cod")
    private Usuario usuario;
    private String competencia;
    @ManyToOne
    @JoinColumn(name = "empresas_cod")
    private Empresa empresa;
    @ElementCollection
    @CollectionTable(name = "obrigacao_arquivos", joinColumns = @JoinColumn(name = "obrigacoes_cod"))
    @Column(name = "arquivos_id")
    private List<String> arquivos;


}
