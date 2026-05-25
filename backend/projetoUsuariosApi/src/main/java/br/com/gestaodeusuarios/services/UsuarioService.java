package br.com.gestaodeusuarios.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- USANDO APENAS A VERSÃO DO SPRING

import br.com.gestaodeusuarios.dtos.AutenticarUsuarioRequest;
import br.com.gestaodeusuarios.dtos.AutenticarUsuarioResponse;
import br.com.gestaodeusuarios.dtos.CriarUsuarioRequest;
import br.com.gestaodeusuarios.dtos.CriarUsuarioResponse;
import br.com.gestaodeusuarios.dtos.UsuarioPendenteDto;
import br.com.gestaodeusuarios.dtos.UsuarioResponse;
import br.com.gestaodeusuarios.entities.Perfil;
import br.com.gestaodeusuarios.entities.StatusUsuario;
import br.com.gestaodeusuarios.entities.Usuario;
import br.com.gestaodeusuarios.exceptions.EmailJaCadastradoException;
import br.com.gestaodeusuarios.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
// import jakarta.transaction.Transactional; // <-- REMOVENDO COMPLETAMENTE A VERSÃO JAKARTA
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    
    @Transactional(readOnly = true)
    public List<UsuarioPendenteDto> listarUsuariosPendentes() {
        List<Usuario> usuariosPendentes = usuarioRepository.findByStatus(StatusUsuario.PENDENTE);
        return usuariosPendentes.stream()      
                                .map(UsuarioPendenteDto::new) 
                                .toList();                    
    }
    
    @Transactional
    public CriarUsuarioResponse criarUsuario(CriarUsuarioRequest request) {
        
        Optional<Usuario> usuarioExistenteOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioExistenteOpt.isPresent()) {
            Usuario usuarioExistente = usuarioExistenteOpt.get();

            if (usuarioExistente.getStatus() == StatusUsuario.REJEITADO) {
                usuarioExistente.setStatus(StatusUsuario.PENDENTE);
                usuarioRepository.save(usuarioExistente);

                var response = new CriarUsuarioResponse();
                response.setId(usuarioExistente.getId());
                response.setNome(usuarioExistente.getNome());
                response.setEmail(usuarioExistente.getEmail());
                response.setDataHoraCriacao(LocalDateTime.now());
                
                return response;
            } else {
                throw new EmailJaCadastradoException();
            }
        }
                
        var usuario = new Usuario();
        
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setPerfil(Perfil.USER);     
        usuario.setStatus(StatusUsuario.PENDENTE);
        
        usuarioRepository.save(usuario);
        
        var response = new CriarUsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setDataHoraCriacao(LocalDateTime.now());
        
        return response;
    }
    
    public AutenticarUsuarioResponse autenticarUsuario(AutenticarUsuarioRequest request) {
    
        var authenticationToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário autenticado não encontrado no banco de dados."));
        
        var response = new AutenticarUsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setDataHoraAcesso(LocalDateTime.now());
        response.setToken(tokenService.generateToken(usuario));
    
        return response;
    }    
    
    @Transactional 
    public void aprovarUsuario(UUID idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + idUsuario));
        usuario.setStatus(StatusUsuario.APROVADO);
        usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void rejeitarUsuario(UUID idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + idUsuario));
        usuario.setStatus(StatusUsuario.REJEITADO);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuariosAprovados() {
        List<Usuario> usuarios = usuarioRepository.findByStatus(StatusUsuario.APROVADO);
        return usuarios.stream()
                       .map(UsuarioResponse::new)
                       .toList();
    }

    @Transactional
    public void atualizarPerfil(UUID idUsuario, Perfil novoPerfil) {
        // Buscar o usuário alvo
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + idUsuario));

        // Verificar se o usuário está aprovado
        if (usuario.getStatus() != StatusUsuario.APROVADO) {
            throw new IllegalStateException("Apenas usuários aprovados podem ter o perfil alterado.");
        }

        // Impedir auto-rebaixamento
        String emailUsuarioLogado = SecurityContextHolder.getContext().getAuthentication().getName();
        if (usuario.getEmail().equals(emailUsuarioLogado) && usuario.getPerfil() == Perfil.MASTER && novoPerfil == Perfil.USER) {
            throw new IllegalStateException("Você não pode rebaixar seu próprio perfil de MASTER para USER.");
        }

        usuario.setPerfil(novoPerfil);
        usuarioRepository.save(usuario);
    }
}
