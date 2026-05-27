package br.com.gestaodeusuarios.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.gestaodeusuarios.entities.RefreshToken;
import br.com.gestaodeusuarios.entities.Usuario;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

	Optional<RefreshToken> findByToken(String token);

	@Modifying
	@Query("DELETE FROM RefreshToken rt WHERE rt.usuario = :usuario")
	void deleteByUsuario(Usuario usuario);
}
