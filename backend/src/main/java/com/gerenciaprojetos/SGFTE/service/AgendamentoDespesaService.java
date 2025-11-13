package com.gerenciaprojetos.SGFTE.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gerenciaprojetos.SGFTE.model.Despesa;
import com.gerenciaprojetos.SGFTE.model.DespesaFixa;
import com.gerenciaprojetos.SGFTE.repository.DespesaFixaRepository;
import com.gerenciaprojetos.SGFTE.repository.DespesaRepository;

@Service
public class AgendamentoDespesaService {

    @Autowired
    private DespesaFixaRepository despesaFixaRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    @Scheduled(cron = "0 0 5 * * ?")
    @Transactional
    public void registrarDespesasFixasAgendadas() {
        System.out.println("Iniciando job de registro de despesas fixas...");

        LocalDate hoje = LocalDate.now();
        int diaDeHoje = hoje.getDayOfMonth();

        List<DespesaFixa> despesasParaLancarHoje = despesaFixaRepository.findByDiaDoMesRegistro(diaDeHoje);

        if (despesasParaLancarHoje.isEmpty()) {
            System.out.println("Nenhuma despesa fixa para lançar hoje (" + diaDeHoje + ").");
            return;
        }

        System.out.println("Encontradas " + despesasParaLancarHoje.size() + " despesas fixas para o dia " + diaDeHoje);

        for (DespesaFixa molde : despesasParaLancarHoje) {
            
            Despesa novaDespesa = new Despesa();
            novaDespesa.setCategoria(molde.getCategoria());
            novaDespesa.setValor(molde.getValor());
            novaDespesa.setVeiculo(molde.getVeiculo());
            novaDespesa.setData(hoje); 
            novaDespesa.setDescricao(molde.getDescricao() + " (Lançamento automático)");

            despesaRepository.save(novaDespesa);
        }
        
        System.out.println("Job de registro de despesas fixas concluído.");
    }
}