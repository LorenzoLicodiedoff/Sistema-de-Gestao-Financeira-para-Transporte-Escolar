package com.gerenciaprojetos.SGFTE.repository;

import java.math.BigDecimal; // <-- Verifique este import
import java.time.LocalDate;  // <-- Verifique este import
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Verifique este import
import org.springframework.data.repository.query.Param; // <-- Verifique este import
import org.springframework.stereotype.Repository;

import com.gerenciaprojetos.SGFTE.model.Despesa;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByVeiculoId(Long veiculoId);

    // Este é o método que o controller está procurando
    @Query("SELECT SUM(d.valor) FROM Despesa d WHERE d.data BETWEEN :inicio AND :fim")
    BigDecimal sumTotalDespesasBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}