package br.com.gestaodeusuarios.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.gestaodeusuarios.entities.StatusUsuario;
import br.com.gestaodeusuarios.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
	
	Optional<Usuario> findByEmail(String email);
	
	 List<Usuario> findByStatus(StatusUsuario status);

	@Query("""
			SELECT COUNT(u) > 0
			FROM Usuario u
			WHERE u.email = :email
			""")
	Boolean existsByEmail(@Param("email") String email);
	
	@Query("""
			SELECT u FROM Usuario u
			WHERE u.email = :email
			  AND u.senha = :senha
			""")
	Usuario find(@Param("email") String email, @Param("senha") String senha);
}