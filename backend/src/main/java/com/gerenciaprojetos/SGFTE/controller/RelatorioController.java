package com.gerenciaprojetos.SGFTE.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map; // Importar

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gerenciaprojetos.SGFTE.repository.DespesaRepository;
import com.gerenciaprojetos.SGFTE.repository.ReceitaRepository;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    /**
     * Requisito 1: Relatório de fluxo de caixa (receitas – despesas) por período.
     */
    @GetMapping("/fluxo-caixa")
    public ResponseEntity<?> getFluxoDeCaixa(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        // Busca o total de receitas no período
        BigDecimal totalReceitas = receitaRepository.sumTotalReceitasBetween(inicio, fim);
        if (totalReceitas == null) {
            totalReceitas = BigDecimal.ZERO; // Garante que não é nulo
        }

        // Busca o total de despesas no período
        BigDecimal totalDespesas = despesaRepository.sumTotalDespesasBetween(inicio, fim);
        if (totalDespesas == null) {
            totalDespesas = BigDecimal.ZERO; // Garante que não é nulo
        }

        // Calcula o saldo
        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        // Retorna um JSON com os três valores
        // Ex: { "totalReceitas": 1000, "totalDespesas": 300, "saldo": 700 }
        Map<String, BigDecimal> resultado = Map.of(
            "totalReceitas", totalReceitas,
            "totalDespesas", totalDespesas,
            "saldo", saldo
        );

        return ResponseEntity.ok(resultado);
    }
    

    @GetMapping("/faturamento-veiculo")
public ResponseEntity<?> getFaturamentoPorVeiculo(
        @RequestParam Long veiculoId, // ID do veículo é obrigatório
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

    // Busca o total de receitas para esse veículo específico no período
    BigDecimal totalReceitasVeiculo = receitaRepository.sumTotalReceitasByVeiculoBetween(veiculoId, inicio, fim);

    if (totalReceitasVeiculo == null) {
        totalReceitasVeiculo = BigDecimal.ZERO; // Garante que não é nulo
    }

    // Retorna um JSON simples com o total
    // Ex: { "totalFaturamentoVeiculo": 500 }
    Map<String, BigDecimal> resultado = Map.of(
        "totalFaturamentoVeiculo", totalReceitasVeiculo
    );

    return ResponseEntity.ok(resultado);
}
}