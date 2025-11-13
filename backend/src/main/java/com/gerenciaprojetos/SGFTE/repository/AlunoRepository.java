package com.gerenciaprojetos.SGFTE.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gerenciaprojetos.SGFTE.model.Aluno;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
}