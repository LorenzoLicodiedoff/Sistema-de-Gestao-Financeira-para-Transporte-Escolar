package com.gerenciaprojetos.SGFTE.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.gerenciaprojetos.SGFTE.model.Aluno;
import com.gerenciaprojetos.SGFTE.model.Responsavel;
import com.gerenciaprojetos.SGFTE.repository.AlunoRepository;
import com.gerenciaprojetos.SGFTE.repository.ResponsavelRepository;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private ResponsavelRepository responsavelRepository;

    // SALVAR um novo aluno (associado a um responsável)
    @PostMapping
    public Aluno criarAluno(@RequestBody Aluno aluno) {
        // Pega o ID do responsável que veio no JSON
        Long responsavelId = aluno.getResponsavel().getId();
        
        // Busca o responsável completo no banco
        Responsavel responsavel = responsavelRepository.findById(responsavelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsável não encontrado"));
        
        // Associa o responsável real ao aluno
        aluno.setResponsavel(responsavel);
        return alunoRepository.save(aluno);
    }

    // ATUALIZAR um aluno (ex: nome, escola, ou status ativo/inativo)
    @PutMapping("/{id}")
public ResponseEntity<Aluno> atualizarAluno(@PathVariable Long id, @RequestBody Aluno dadosAluno) {

    // 1. Busca o aluno que já existe no banco
    Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

    // 2. Busca o responsável que veio no JSON (caso tenha mudado, embora não mude)
    Responsavel responsavel = responsavelRepository.findById(dadosAluno.getResponsavel().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsável não encontrado"));

    // 3. Atualiza todos os campos do aluno (o que veio do banco)
    //    com os dados que vieram do frontend (dadosAluno)
    aluno.setNome(dadosAluno.getNome());
    aluno.setInstituicao(dadosAluno.getInstituicao());
    aluno.setSerie(dadosAluno.getSerie());
    aluno.setNivelEscolaridade(dadosAluno.getNivelEscolaridade());
    aluno.setNivelOutro(dadosAluno.getNivelOutro());
    aluno.setAtivo(dadosAluno.isAtivo());
    aluno.setResponsavel(responsavel); // <-- ESTA ERA A LINHA QUE FALTAVA

    // 4. Salva o aluno atualizado
    Aluno atualizado = alunoRepository.save(aluno);
    return ResponseEntity.ok(atualizado);
}

    // EXCLUIR um aluno
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAluno(@PathVariable Long id) {
        return alunoRepository.findById(id)
                .map(aluno -> {
                    alunoRepository.delete(aluno);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}