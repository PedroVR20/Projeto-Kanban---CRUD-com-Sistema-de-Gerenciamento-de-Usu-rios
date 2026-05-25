package br.com.gestaodeusuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException; // <-- IMPORTAR A EXCEÇÃO
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.gestaodeusuarios.entities.StatusUsuario; 
import br.com.gestaodeusuarios.entities.Usuario;
import br.com.gestaodeusuarios.repositories.UsuarioRepository;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
       
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + username));

       
        if (usuario.getStatus() != StatusUsuario.APROVADO) {
           
            throw new DisabledException("Usuário pendente de aprovação ou rejeitado.");
        }
       

       
        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha()) 
                .authorities("ROLE_" + usuario.getPerfil().name())
                .build();
    }
}
