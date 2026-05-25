package br.com.apideagencias.dtos;

import java.util.UUID;

import br.com.apideagencias.entities.Agencia;

public record AgenciaResponseDto(
		
		UUID id,
	String nome,
	String cnpj,
	String endereco,
	String telefone,
	String email
	){ 
	
	public AgenciaResponseDto(Agencia agencia) { 
		this(
		agencia.getId( ),
		agencia.getNome( ),
		agencia.getCnpj( ),
		agencia.getEndereco( ),
		agencia.getTelefone( ),
		agencia.getEmail( )
				);
		
	}

	
	
}
