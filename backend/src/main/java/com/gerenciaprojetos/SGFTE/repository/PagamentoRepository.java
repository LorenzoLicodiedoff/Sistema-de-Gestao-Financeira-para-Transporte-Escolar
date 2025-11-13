package com.gerenciaprojetos.SGFTE.repository;

import java.util.List; // Importar
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gerenciaprojetos.SGFTE.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    // Requisito 3: Consultar histórico de pagamentos de um aluno
    List<Pagamento> findByAlunoId(Long alunoId);
}