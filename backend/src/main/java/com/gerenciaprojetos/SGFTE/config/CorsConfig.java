package com.gerenciaprojetos.SGFTE.config; 

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration 
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        // Estamos a configurar as permissões para todas as URLs que começam com /api/
        registry.addMapping("/api/**")
            
            // Permite pedidos vindos desta origem (o seu frontend Vite/React)
            .allowedOrigins("http://localhost:5173") 
            
            // Permite estes métodos HTTP (GET para ler, POST para criar, etc.)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            
            // Permite todos os cabeçalhos (headers)
            .allowedHeaders("*")
            
            // Permite o envio de cookies (importante para autenticação futura)
            .allowCredentials(true);
    }
}