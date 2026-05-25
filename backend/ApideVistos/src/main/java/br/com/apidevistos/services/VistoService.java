package br.com.apidevistos.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.apidevistos.entities.Visto;
import br.com.apidevistos.repositories.VistoRepository;

@Service
public class VistoService {

	@Autowired 
	private VistoRepository vistoRepository;
	
	/**
	 * NOVO MÉTODO: Busca todos os vistos do banco de dados, sem aplicar nenhum filtro.
	 * É este método que o VistoController passará a usar.
	 * @return Uma lista com todos os vistos cadastrados.
	 */
	public List<Visto> listarTodosVistos() {
		return vistoRepository.findAll();
	}

	public Visto criarVisto(String nomeCliente, UUID operadorId) {
        Visto novoVisto = new Visto();
        novoVisto.setNome(nomeCliente);
        novoVisto.setOperadorId(operadorId); 

        return vistoRepository.save(novoVisto);
	}
	
	public void deleteVisto(UUID id) {
      
        if (!vistoRepository.existsById(id)) {
          
            System.out.println("Tentativa de deletar visto com ID inexistente: " + id);
            return;
        }
        vistoRepository.deleteById(id);
    }
	
}
