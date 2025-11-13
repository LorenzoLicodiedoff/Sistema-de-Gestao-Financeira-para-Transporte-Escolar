package com.gerenciaprojetos.SGFTE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.gerenciaprojetos.SGFTE.model.Aluno;
import com.gerenciaprojetos.SGFTE.model.Pagamento;
import com.gerenciaprojetos.SGFTE.repository.AlunoRepository;
import com.gerenciaprojetos.SGFTE.repository.PagamentoRepository;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    // --- REQUISITO 3: Consultar histórico de pagamentos de um aluno ---
    @GetMapping("/aluno/{alunoId}")
    public List<Pagamento> listarPagamentosPorAluno(@PathVariable Long alunoId) {
        // Usa o método que criamos no PagamentoRepository
        return pagamentoRepository.findByAlunoId(alunoId);
    }

    // SALVAR um novo pagamento (associado a um aluno)
    @PostMapping("/aluno/{alunoId}")
    public Pagamento criarPagamento(
            @PathVariable Long alunoId, // <-- Recebe o ID do aluno pela URL
            @RequestBody Pagamento pagamento) { // <-- O 'pagamento' vem sem o aluno

        // Busca o aluno completo no banco usando o ID da URL
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        
        // Associa o aluno real ao pagamento
        pagamento.setAluno(aluno);
        
        // O campo 'aluno' no objeto 'pagamento' é ignorado pelo JSON
        // (graças ao @JsonIgnore), mas é salvo corretamente no banco.
        return pagamentoRepository.save(pagamento);
    }
    
    // (Não incluí PUT e DELETE de pagamentos, mas podem ser adicionados se necessário)
}