package com.gerenciaprojetos.SGFTE.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gerenciaprojetos.SGFTE.model.Responsavel;
import com.gerenciaprojetos.SGFTE.repository.ResponsavelRepository;

@RestController
@RequestMapping("/api/responsaveis")
public class ResponsavelController {

    @Autowired
    private ResponsavelRepository responsavelRepository;

    // LISTAR todos os responsáveis (com seus alunos junto)
    @GetMapping
    public List<Responsavel> listarResponsaveis() {
        return responsavelRepository.findAll();
    }

    // SALVAR um novo responsável
    @PostMapping
    public Responsavel criarResponsavel(@RequestBody Responsavel responsavel) {
        // Zera os IDs de alunos, pois eles devem ser criados separadamente
        if (responsavel.getAlunos() != null) {
            responsavel.getAlunos().clear(); 
        }
        return responsavelRepository.save(responsavel);
    }

    // ATUALIZAR um responsável existente
    @PutMapping("/{id}")
    public ResponseEntity<Responsavel> atualizarResponsavel(@PathVariable Long id, @RequestBody Responsavel dadosResponsavel) {
        return responsavelRepository.findById(id)
                .map(responsavel -> {
                    responsavel.setNome(dadosResponsavel.getNome());
                    responsavel.setTelefone(dadosResponsavel.getTelefone());
                    responsavel.setLogradouro(dadosResponsavel.getLogradouro());
                    responsavel.setNumero(dadosResponsavel.getNumero());
                    responsavel.setBairro(dadosResponsavel.getBairro());
                    responsavel.setCep(dadosResponsavel.getCep());
                    Responsavel atualizado = responsavelRepository.save(responsavel);
                    return ResponseEntity.ok(atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }

    // EXCLUIR um responsável
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarResponsavel(@PathVariable Long id) {
        return responsavelRepository.findById(id)
                .map(responsavel -> {
                    responsavelRepository.delete(responsavel);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}