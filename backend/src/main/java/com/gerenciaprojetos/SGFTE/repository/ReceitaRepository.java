package com.gerenciaprojetos.SGFTE.repository;

import java.math.BigDecimal; // <-- Verifique este import
import java.time.LocalDate;  // <-- Verifique este import

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Verifique este import
import org.springframework.data.repository.query.Param; // <-- Verifique este import
import org.springframework.stereotype.Repository;

import com.gerenciaprojetos.SGFTE.model.Receita;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    // Este é o método que o controller está procurando
    @Query("SELECT SUM(r.valor) FROM Receita r WHERE r.data BETWEEN :inicio AND :fim")
    BigDecimal sumTotalReceitasBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
    @Query("SELECT SUM(r.valor) FROM Receita r WHERE r.veiculo.id = :veiculoId AND r.data BETWEEN :inicio AND :fim")
    BigDecimal sumTotalReceitasByVeiculoBetween(
        @Param("veiculoId") Long veiculoId,
        @Param("inicio") LocalDate inicio,
        @Param("fim") LocalDate fim);

}