package br.com.gestaodeusuarios.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API para Gestão de  Usuários")
                .version("v1")
                .description("Documentação da API - Projeto Spring Boot com banco de dados PostGreSQL")
            );
    }
}