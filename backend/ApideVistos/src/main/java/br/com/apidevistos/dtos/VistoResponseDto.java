package br.com.apidevistos.dtos;

import java.util.UUID;

import lombok.Data;

@Data
public class VistoResponseDto {

	private UUID id;
	private String nome;
	private String nomeOperador;
	
}
