package com.gerenciaprojetos.SGFTE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.gerenciaprojetos.SGFTE.model.Receita;
import com.gerenciaprojetos.SGFTE.model.Veiculo;
import com.gerenciaprojetos.SGFTE.repository.ReceitaRepository;
import com.gerenciaprojetos.SGFTE.repository.VeiculoRepository;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private VeiculoRepository veiculoRepository; // Para associar ao veículo

    // Endpoint para LISTAR todas as receitas
    @GetMapping
    public List<Receita> listarReceitas() {
        return receitaRepository.findAll();
    }

    // Endpoint para SALVAR uma nova receita
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Receita registrarReceita(@RequestBody Receita receita) {
        
        // Lógica para associar o veículo (igual fizemos nas Despesas)
        // Verifica se o frontend mandou um veículo associado
        if (receita.getVeiculo() != null && receita.getVeiculo().getId() != null) {
            Long veiculoId = receita.getVeiculo().getId();
            Veiculo veiculo = veiculoRepository.findById(veiculoId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));
            receita.setVeiculo(veiculo);
        } else {
            // Se não veio veículo, apenas salva a receita como "geral"
            receita.setVeiculo(null);
        }

        return receitaRepository.save(receita);
    }
}