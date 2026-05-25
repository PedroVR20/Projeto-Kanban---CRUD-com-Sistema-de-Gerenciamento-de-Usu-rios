package br.com.gestaodeusuarios.components;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.gestaodeusuarios.dtos.CriarUsuarioResponse;

@Component
public class RabbitMQProducerComponent {

	@Autowired RabbitTemplate rabbitTemplate; 	
	@Autowired ObjectMapper objectMapper;		
	@Autowired Queue queue;						
	
	
	public void send(CriarUsuarioResponse usuario) {
		try {
			var json = objectMapper.writeValueAsString(usuario);
			rabbitTemplate.convertAndSend(queue.getName(), json);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}
