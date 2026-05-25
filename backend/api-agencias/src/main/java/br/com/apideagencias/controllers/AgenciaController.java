package br.com.apideagencias.controllers;


import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.util.UriComponentsBuilder;

import br.com.apideagencias.dtos.AgenciaRequestDto;
import br.com.apideagencias.dtos.AgenciaResponseDto;
import br.com.apideagencias.entities.Agencia;
import br.com.apideagencias.repositories.AgenciaRepository;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/v1/agencias")
public class AgenciaController {

    @Autowired
    private AgenciaRepository repository;

    
    @PostMapping
    @Transactional
    public ResponseEntity<AgenciaResponseDto> cadastrar(@RequestBody AgenciaRequestDto dados, UriComponentsBuilder uriBuilder) {
        
        Agencia novaAgencia = new Agencia(dados);
        
        
        repository.save(novaAgencia);

      
        var uri = uriBuilder.path("/agencias/{id}").buildAndExpand(novaAgencia.getId()).toUri();
        
     
        return ResponseEntity.created(uri).body(new AgenciaResponseDto(novaAgencia));
    }

   
    @GetMapping
    public ResponseEntity<List<AgenciaResponseDto>> listar() {
      
        List<AgenciaResponseDto> listaDto = repository.findAll().stream().map(AgenciaResponseDto::new).toList();
        

        return ResponseEntity.ok(listaDto);
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<AgenciaResponseDto> buscarPorId(@PathVariable UUID id) {
        return repository.findById(id)
                .map(agencia -> ResponseEntity.ok(new AgenciaResponseDto(agencia))) 
                .orElse(ResponseEntity.notFound().build());
    }

   
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<AgenciaResponseDto> atualizar(@PathVariable UUID id, @RequestBody AgenciaRequestDto dados) {
        return repository.findById(id)
                .map(agenciaExistente -> {
                   
                    agenciaExistente.setNome(dados.nome());
                    agenciaExistente.setCnpj(dados.cnpj());
                    agenciaExistente.setEndereco(dados.endereco());
                    agenciaExistente.setTelefone(dados.telefone());
                    agenciaExistente.setEmail(dados.email());
                    
                    repository.save(agenciaExistente); 
                    
                  
                    return ResponseEntity.ok(new AgenciaResponseDto(agenciaExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
   
    
    
    
}
