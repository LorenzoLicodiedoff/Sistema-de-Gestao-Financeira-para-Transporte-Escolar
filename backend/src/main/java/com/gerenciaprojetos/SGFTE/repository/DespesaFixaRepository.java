package com.gerenciaprojetos.SGFTE.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gerenciaprojetos.SGFTE.model.DespesaFixa;

@Repository
public interface DespesaFixaRepository extends JpaRepository<DespesaFixa, Long> {

    List<DespesaFixa> findByDiaDoMesRegistro(int dia);
}