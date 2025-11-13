package com.gerenciaprojetos.SGFTE.controller;

import com.gerenciaprojetos.SGFTE.model.Veiculo;
import com.gerenciaprojetos.SGFTE.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos") // A URL que o frontend chama
public class VeiculoController {

    @Autowired
    private VeiculoRepository veiculoRepository;

    // O método GET que o frontend precisa para carregar a lista
    @GetMapping
    public List<Veiculo> listarVeiculos() {
        return veiculoRepository.findAll();
    }

    // O método POST que o frontend precisa para salvar
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Veiculo salvarVeiculo(@RequestBody Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }
}