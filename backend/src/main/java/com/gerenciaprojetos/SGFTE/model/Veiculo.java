package com.gerenciaprojetos.SGFTE.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Column(nullable = false, length = 100)
    private String modelo;

    @Column(nullable = false)
    private int anoFabricacao;

    @Column
    private LocalDate dataVencimentoLicenca;

    @Column
    private LocalDate dataVencimentoSeguro;

    @JsonIgnore // ADICIONE ISTO
    @OneToMany(mappedBy = "veiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Despesa> despesas;

    @JsonIgnore // ADICIONE ISTO
    @OneToMany(mappedBy = "veiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DespesaFixa> despesasFixas;


    // --- Getters e Setters COMPLETOS ---
    public LocalDate getDataVencimentoLicenca() {
        return dataVencimentoLicenca;
    }

    public void setDataVencimentoLicenca(LocalDate dataVencimentoLicenca) {
        this.dataVencimentoLicenca = dataVencimentoLicenca;
    }

    public LocalDate getDataVencimentoSeguro() {
        return dataVencimentoSeguro;
    }

    public void setDataVencimentoSeguro(LocalDate dataVencimentoSeguro) {
        this.dataVencimentoSeguro = dataVencimentoSeguro;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public int getAnoFabricacao() {
        return anoFabricacao;
    }

    public void setAnoFabricacao(int anoFabricacao) {
        this.anoFabricacao = anoFabricacao;
    }

    public List<Despesa> getDespesas() {
        return despesas;
    }

    public void setDespesas(List<Despesa> despesas) {
        this.despesas = despesas;
    }

    public List<DespesaFixa> getDespesasFixas() {
        return despesasFixas;
    }

    public void setDespesasFixas(List<DespesaFixa> despesasFixas) {
        this.despesasFixas = despesasFixas;
    }
}