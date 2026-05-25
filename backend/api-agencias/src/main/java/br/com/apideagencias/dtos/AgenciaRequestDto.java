package br.com.apideagencias.dtos;

public record AgenciaRequestDto(
	String nome,
	String cnpj,
	String endereco,
	String telefone,
	String email
	){

	
}
