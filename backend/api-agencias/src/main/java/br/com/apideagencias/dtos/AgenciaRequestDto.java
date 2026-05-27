package br.com.apideagencias.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AgenciaRequestDto(
	@NotBlank(message = "Nome é obrigatório")
	@Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
	String nome,

	@NotBlank(message = "CNPJ é obrigatório")
	String cnpj,

	@NotBlank(message = "Endereço é obrigatório")
	String endereco,

	@NotBlank(message = "Telefone é obrigatório")
	String telefone,

	@NotBlank(message = "Email é obrigatório")
	@Email(message = "Email inválido")
	String email
) {}
