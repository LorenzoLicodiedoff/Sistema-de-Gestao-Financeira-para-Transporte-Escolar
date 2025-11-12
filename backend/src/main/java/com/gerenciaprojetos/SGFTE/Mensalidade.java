package com.gerenciaprojetos.SGFTE;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Mensalidade {

    private Long id;
    private Responsavel responsavel; 
    private Double valorBase;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento; 
    private Double valorPago = 0.0;  // Baixa Manual ou Parcial
    private String metodoPagamento;
    private Double descontoAplicado = 0.0; // Gestão de Descontos
    
    // Constantes para Juros e Multas
    private final static Double MULTA_PERCENTUAL = 0.02; // 2%
    private final static Double JUROS_DIARIO_PERCENTUAL = 0.00033; // ~1% ao mês

    // Construtor padrão
    public Mensalidade() {
    }

    // =========================================================
    // LÓGICA DE NEGÓCIO: Cálculo de Juros e Multas
    // =========================================================

    /**
     * Calcula a multa e os juros se a mensalidade estiver em atraso.
     * @return Um objeto CalculoAtraso contendo os valores calculados.
     */
    public CalculoAtraso calcularJurosEMultas() {
        LocalDate hoje = LocalDate.now();
        
        // Se já foi paga ou ainda está no prazo, retorna zero
        if (dataPagamento != null || !hoje.isAfter(dataVencimento)) {
            return new CalculoAtraso(0.0, 0.0);
        }

        long diasAtraso = ChronoUnit.DAYS.between(dataVencimento, hoje);
        if (diasAtraso <= 0) {
            return new CalculoAtraso(0.0, 0.0);
        }

        double valorComDesconto = valorBase - descontoAplicado;
        
        // Cálculo da Multa (fixa)
        double multa = valorComDesconto * MULTA_PERCENTUAL;

        // Cálculo do Juros (por dia)
        double juros = valorComDesconto * JUROS_DIARIO_PERCENTUAL * diasAtraso;
        
        return new CalculoAtraso(multa, juros);
    }

    /**
     * Retorna o valor que o responsável precisa pagar para quitar o débito.
     */
    public Double getSaldoDevedor() {
        CalculoAtraso calc = calcularJurosEMultas();
        double totalDevido = (valorBase - descontoAplicado) + calc.getMulta() + calc.getJuros();
        
        // Considera o valor pago parcialmente
        return totalDevido - valorPago;
    }
    
    // =========================================================
    // GETTERS E SETTERS (RESOLVEM OS WARNINGS)
    // =========================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Responsavel getResponsavel() { return responsavel; }
    public void setResponsavel(Responsavel responsavel) { this.responsavel = responsavel; }

    public Double getValorBase() { return valorBase; }
    public void setValorBase(Double valorBase) { this.valorBase = valorBase; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public Double getValorPago() { return valorPago; }
    public void setValorPago(Double valorPago) { this.valorPago = valorPago; }

    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }

    public Double getDescontoAplicado() { return descontoAplicado; }
    public void setDescontoAplicado(Double descontoAplicado) { this.descontoAplicado = descontoAplicado; }
}

/**
 * Classe auxiliar para estruturar o retorno dos cálculos de multa e juros.
 */
class CalculoAtraso {
    private Double multa;
    private Double juros;
    
    public CalculoAtraso(Double multa, Double juros) {
        this.multa = multa;
        this.juros = juros;
    }
    
    public Double getMulta() { return multa; }
    public Double getJuros() { return juros; }
}