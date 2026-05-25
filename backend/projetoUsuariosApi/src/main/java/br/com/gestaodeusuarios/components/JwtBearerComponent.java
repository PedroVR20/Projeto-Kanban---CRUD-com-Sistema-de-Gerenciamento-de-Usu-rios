package br.com.gestaodeusuarios.components;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtBearerComponent {

	
	@Value("${jwt.secretkey}")
	private String jwtSecret;
	
	
	@Value("${jwt.expiration}")
	private String jwtExpiration;
	
	
	public Date getExpiration() {
		//Data atual + o tempo de expiração em milisegundos
		var dataAtual = new Date();
		return new Date(dataAtual.getTime() + Integer.parseInt(jwtExpiration));
	}
	
	
	public String getToken(String emailUsuario) {
		
		return Jwts.builder()
				.setSubject(emailUsuario) //identificação do usuário do token
				.setIssuedAt(new Date()) //data de geração do token
				.setExpiration(getExpiration()) //data de expiração do token
				.signWith(SignatureAlgorithm.HS256, jwtSecret) //chave de assinatura
				.compact(); //finaliza e retorna o token gerado
	}	
}
