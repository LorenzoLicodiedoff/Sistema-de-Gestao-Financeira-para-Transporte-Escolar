package com.gerenciaprojetos.SGFTE.model;

import java.math.BigDecimal;

import com.gerenciaprojetos.SGFTE.model.enums.CategoriaDespesa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "despesas_fixas_agendadas")
public class DespesaFixa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoriaDespesa categoria;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private int diaDoMesRegistro; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;
    
    // --- É ISTO QUE ESTÁ A FALTAR NO SEU FICHEIRO ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CategoriaDespesa getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaDespesa categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getDiaDoMesRegistro() {
        return diaDoMesRegistro;
    }

    public void setDiaDoMesRegistro(int diaDoMesRegistro) {
        this.diaDoMesRegistro = diaDoMesRegistro;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}