package br.com.apideagencias.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.apideagencias.entities.Agencia;

public interface AgenciaRepository extends JpaRepository<Agencia, UUID> {



}
