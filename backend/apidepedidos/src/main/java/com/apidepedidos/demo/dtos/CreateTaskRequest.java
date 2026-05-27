package com.apidepedidos.demo.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTaskRequest {

	@NotBlank(message = "Nome do cliente é obrigatório")
	private String clientName;

	@NotBlank(message = "Tipo de solicitação é obrigatório")
	private String visaApplicationType;

	@NotBlank(message = "ID do cliente é obrigatório")
	private String clientId;

	private String file;
	private String agency;
	private String agencyContact;

	@NotBlank(message = "Data de contratação é obrigatória")
	private String hiringDate;

	private String state;
	private String casvDateTime;
	private String consulateDateTime;

	@NotBlank(message = "País do visto é obrigatório")
	private String visaCountry;

	private String status;

	@NotBlank(message = "Status do pedido é obrigatório")
	private String processStatus;
}
