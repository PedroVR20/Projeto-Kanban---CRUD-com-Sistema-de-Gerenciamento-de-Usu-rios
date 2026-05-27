package br.com.gestaodeusuarios.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.gestaodeusuarios.dtos.AtualizarPerfilRequest;
import br.com.gestaodeusuarios.dtos.AutenticarUsuarioRequest;
import br.com.gestaodeusuarios.dtos.AutenticarUsuarioResponse;
import br.com.gestaodeusuarios.dtos.CriarUsuarioRequest;
import br.com.gestaodeusuarios.dtos.CriarUsuarioResponse;
import br.com.gestaodeusuarios.dtos.RefreshTokenRequest;
import br.com.gestaodeusuarios.dtos.RefreshTokenResponse;
import br.com.gestaodeusuarios.dtos.UsuarioPendenteDto;
import br.com.gestaodeusuarios.dtos.UsuarioResponse;
import br.com.gestaodeusuarios.services.RefreshTokenService;
import br.com.gestaodeusuarios.services.UsuarioService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

	@Autowired UsuarioService usuarioService;
	@Autowired RefreshTokenService refreshTokenService;
	
	@PostMapping("criar")
	public CriarUsuarioResponse criar(@RequestBody @Valid CriarUsuarioRequest request) {
		return usuarioService.criarUsuario(request);
	}
	
	@PostMapping("autenticar")
	public AutenticarUsuarioResponse autenticar(@RequestBody @Valid AutenticarUsuarioRequest request) {
		return usuarioService.autenticarUsuario(request);
	}

	@PostMapping("refresh")
	public ResponseEntity<?> refresh(@RequestBody @Valid RefreshTokenRequest request) {
		return refreshTokenService.refreshToken(request.getRefreshToken())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.status(401).build());
	}
	
	@GetMapping("/pendentes")
	@PreAuthorize("hasRole('MASTER')")
	public ResponseEntity<List<UsuarioPendenteDto>> listarPendentes() {
	    List<UsuarioPendenteDto> listaDePendentes = usuarioService.listarUsuariosPendentes();
	    return ResponseEntity.ok(listaDePendentes);
	}
	
	@PutMapping("/{id}/aprovar")
	@PreAuthorize("hasRole('MASTER')") 
	@Transactional
	public ResponseEntity<Void> aprovar(@PathVariable UUID id) {
	    usuarioService.aprovarUsuario(id);
	    return ResponseEntity.noContent().build(); 
	}
	
	@PutMapping("/{id}/rejeitar")
	@PreAuthorize("hasRole('MASTER')")
	@Transactional
	public ResponseEntity<Void> rejeitar(@PathVariable UUID id) {
	    usuarioService.rejeitarUsuario(id);
	    return ResponseEntity.noContent().build();
	}

	@GetMapping
	@PreAuthorize("hasRole('MASTER')")
	public ResponseEntity<List<UsuarioResponse>> listarAprovados() {
	    List<UsuarioResponse> usuarios = usuarioService.listarUsuariosAprovados();
	    return ResponseEntity.ok(usuarios);
	}

	@PutMapping("/{id}/perfil")
	@PreAuthorize("hasRole('MASTER')")
	@Transactional
	public ResponseEntity<Void> atualizarPerfil(
	        @PathVariable UUID id,
	        @RequestBody @Valid AtualizarPerfilRequest request) {
	    usuarioService.atualizarPerfil(id, request.getPerfil());
	    return ResponseEntity.noContent().build();
	}
}
