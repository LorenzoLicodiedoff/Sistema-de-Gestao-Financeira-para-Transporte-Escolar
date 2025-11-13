package com.gerenciaprojetos.SGFTE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException; // Importar

import com.gerenciaprojetos.SGFTE.model.Despesa;
import com.gerenciaprojetos.SGFTE.model.DespesaFixa;
import com.gerenciaprojetos.SGFTE.model.Veiculo; // Importar
import com.gerenciaprojetos.SGFTE.repository.DespesaFixaRepository;
import com.gerenciaprojetos.SGFTE.repository.DespesaRepository;
import com.gerenciaprojetos.SGFTE.repository.VeiculoRepository; // Importar

@RestController
@RequestMapping("/api/despesas")
public class DespesaController {

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private DespesaFixaRepository despesaFixaRepository;

    // (Opcional, mas recomendado: para validar se o veículo existe)
    // --- ESTA É A MUDANÇA IMPORTANTE ---
    @Autowired
    private VeiculoRepository veiculoRepository;

    // --- Requisitos 1 e 2: Registar Despesa Manual ---
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Despesa registrarDespesaManual(@RequestBody Despesa despesa) {
        
        // --- LÓGICA ADICIONADA ---
        // 1. Pega o ID do veículo que o frontend enviou (ex: {"id": 1})
        Long veiculoId = despesa.getVeiculo().getId();

        // 2. Busca o veículo completo no banco de dados
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        // 3. Define o veículo real (encontrado no banco) na despesa
        despesa.setVeiculo(veiculo);
        
        // 4. Salva a despesa com o veículo correto
        return despesaRepository.save(despesa);
    }

    // Endpoint para LISTAR despesas de um veículo específico
    @GetMapping("/veiculo/{veiculoId}")
    public List<Despesa> listarDespesasPorVeiculo(@PathVariable Long veiculoId) {
        return despesaRepository.findByVeiculoId(veiculoId);
    }

    // --- Requisito 3: Agendar Despesa Fixa ---
    
    @PostMapping("/agendar-fixa")
    @ResponseStatus(HttpStatus.CREATED)
    public DespesaFixa agendarDespesaFixa(@RequestBody DespesaFixa despesaFixa) {
        
        // --- LÓGICA ADICIONADA (igual à de cima) ---
        Long veiculoId = despesaFixa.getVeiculo().getId();

        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        despesaFixa.setVeiculo(veiculo);
        
        return despesaFixaRepository.save(despesaFixa);
    }

    // Endpoint para LISTAR todos os agendamentos
    @GetMapping("/agendadas")
    public List<DespesaFixa> listarDespesasFixasAgendadas() {
        return despesaFixaRepository.findAll();
    }
}