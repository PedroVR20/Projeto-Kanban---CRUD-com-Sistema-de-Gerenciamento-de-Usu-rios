package br.com.gestaodeusuarios.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.gestaodeusuarios.dtos.RefreshTokenResponse;
import br.com.gestaodeusuarios.entities.RefreshToken;
import br.com.gestaodeusuarios.entities.Usuario;
import br.com.gestaodeusuarios.repositories.RefreshTokenRepository;
import br.com.gestaodeusuarios.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

	private final RefreshTokenRepository refreshTokenRepository;
	private final UsuarioRepository usuarioRepository;
	private final TokenService tokenService;

	@Transactional
	public String createRefreshToken(UUID usuarioId) {
		Usuario usuario = usuarioRepository.findById(usuarioId)
				.orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

		refreshTokenRepository.deleteByUsuario(usuario);

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setUsuario(usuario);
		refreshToken.setCreatedDate(Instant.now());
		refreshToken.setExpirationDate(Instant.now().plusSeconds(REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60));

		refreshTokenRepository.save(refreshToken);
		return refreshToken.getToken();
	}

	@Transactional
	public Optional<RefreshTokenResponse> refreshToken(String tokenStr) {
		return refreshTokenRepository.findByToken(tokenStr)
				.filter(rt -> rt.getExpirationDate().isAfter(Instant.now()))
				.map(rt -> {
					refreshTokenRepository.delete(rt);

					String novoAccessToken = tokenService.generateToken(rt.getUsuario());
					String novoRefreshToken = createRefreshToken(rt.getUsuario().getId());

					return new RefreshTokenResponse(novoAccessToken, novoRefreshToken);
				});
	}

	@Transactional
	public void deleteByUsuarioId(UUID usuarioId) {
		usuarioRepository.findById(usuarioId)
				.ifPresent(refreshTokenRepository::deleteByUsuario);
	}
}
