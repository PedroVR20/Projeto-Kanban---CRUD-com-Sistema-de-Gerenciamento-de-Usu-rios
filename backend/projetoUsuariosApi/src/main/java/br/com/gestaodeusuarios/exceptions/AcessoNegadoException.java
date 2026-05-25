package br.com.gestaodeusuarios.exceptions;

@SuppressWarnings("serial")
public class AcessoNegadoException extends RuntimeException {

	/*
	 * Método para retornar a mensagem de erro
	 */
	@Override
	public String getMessage() {	
		return "Acesso negado. Verifique as credenciais informadas.";
	}
}
