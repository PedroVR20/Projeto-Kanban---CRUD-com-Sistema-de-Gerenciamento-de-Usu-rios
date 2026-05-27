package br.com.gestaodeusuarios.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenResponse {

	private String token;
	private String refreshToken;
}
