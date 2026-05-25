package br.com.gestaodeusuarios.dtos;

import br.com.gestaodeusuarios.entities.Perfil;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizarPerfilRequest {

    @NotNull(message = "Perfil é obrigatório.")
    private Perfil perfil;
}