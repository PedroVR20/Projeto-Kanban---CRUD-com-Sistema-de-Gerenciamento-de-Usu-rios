package br.com.gestaodeusuarios.dtos;

import java.util.UUID;

import br.com.gestaodeusuarios.entities.Usuario;


public record UsuarioPendenteDto(
		UUID id,
		String nome,
		String email
		) {
	
	

	public UsuarioPendenteDto(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }
	
}
