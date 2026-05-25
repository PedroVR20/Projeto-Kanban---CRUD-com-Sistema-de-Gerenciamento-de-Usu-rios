package br.com.apidevistos.configurations; // <-- Pacote correto, como na sua estrutura

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth"; 
        
        return new OpenAPI()
               
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(
                    new Components()
                        .addSecuritySchemes(securitySchemeName,
                            new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                        )
                )
              
                .info(new Info()
                        .title("API de Vistos")
                        .version("v1")
                        .description("API para gerenciamento de vistos, com controle de acesso por perfil (ADMIN/OPERADOR).")
                        .termsOfService("http://swagger.io/terms/" )
                        .license(new License().name("Apache 2.0").url("http://springdoc.org" )));
    }
}
