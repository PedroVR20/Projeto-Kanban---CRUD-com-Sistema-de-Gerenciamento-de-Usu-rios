package br.com.apideagencias.entities;

import java.util.UUID;

import br.com.apideagencias.dtos.AgenciaRequestDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Agencia") 
@Table(name = "agencias") 
@NoArgsConstructor 
@AllArgsConstructor 
@Setter
@Getter
@EqualsAndHashCode(of = "id") 
public class Agencia {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID) 
    private UUID id;

    private String nome; 

    private String cnpj;
    
    private String email;
    
    private String endereco; 

    private String telefone;
    
    public Agencia(AgenciaRequestDto dados) {
        this.nome = dados.nome();
        this.cnpj = dados.cnpj();
        this.endereco = dados.endereco();
        this.telefone = dados.telefone();
        this.email = dados.email();
    }

}
