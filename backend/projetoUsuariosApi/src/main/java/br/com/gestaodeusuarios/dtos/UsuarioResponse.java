package br.com.gestaodeusuarios.dtos;

import java.util.UUID;

import br.com.gestaodeusuarios.entities.Perfil;
import br.com.gestaodeusuarios.entities.StatusUsuario;
import br.com.gestaodeusuarios.entities.Usuario;

public record UsuarioResponse(
        UUID id,
        String nome,
        String email,
        Perfil perfil,
        StatusUsuario status
) {

    public UsuarioResponse(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(),
             usuario.getPerfil(), usuario.getStatus());
    }
}