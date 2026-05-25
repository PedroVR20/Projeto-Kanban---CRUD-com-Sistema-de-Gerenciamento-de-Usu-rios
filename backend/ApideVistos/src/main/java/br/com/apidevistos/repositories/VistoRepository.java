package br.com.apidevistos.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.apidevistos.entities.Visto;

@Repository
public interface VistoRepository extends JpaRepository<Visto, UUID> {
	
	
	
	List<Visto> findByOperadorId(UUID operadorId);

}
