package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

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
    private Date vencimento;
    private String tipoCertificado;
    private String cEO;

    public Empresa(Long cod, String empresa, String cnpj, String regimeTributario, String cidade, Date vencimento, String tipoCertificado, String cEO) {
        this.cod = cod;
        this.empresa = empresa;
        this.cnpj = cnpj;
        this.regimeTributario = regimeTributario;
        this.cidade = cidade;
        this.vencimento = vencimento;
        this.tipoCertificado = tipoCertificado;
        this.cEO = cEO;
    }
}
