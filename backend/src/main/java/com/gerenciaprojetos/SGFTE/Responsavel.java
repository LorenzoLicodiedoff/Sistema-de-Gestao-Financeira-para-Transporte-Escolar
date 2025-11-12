package com.gerenciaprojetos.SGFTE;

// Classe que representa o cliente/pagador, essencial para o controle de inadimplência.
public class Responsavel {

    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private boolean servicoAtivo = true; // Gerenciamento de Cancelamento

    // Construtor padrão
    public Responsavel() {
    }

    // Construtor completo
    public Responsavel(Long id, String nome, String cpf, String email, boolean servicoAtivo) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.servicoAtivo = servicoAtivo;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isServicoAtivo() {
        return servicoAtivo;
    }

    public void setServicoAtivo(boolean servicoAtivo) {
        this.servicoAtivo = servicoAtivo;
    }
}