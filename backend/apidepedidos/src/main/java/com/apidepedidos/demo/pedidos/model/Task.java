package com.apidepedidos.demo.pedidos.model;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor
@AllArgsConstructor	
@Table(name = "tb_pedidos")
public class Task {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
	@jakarta.persistence.Column(name = "client_name")
	private String clientName;
	@jakarta.persistence.Column(name = "visa_application_type")
    private String visaApplicationType;
	@jakarta.persistence.Column(name = "client_id")
    private String clientId;
    private String file;
    private String agency;
	@jakarta.persistence.Column(name = "agency_contact")
    private String agencyContact;
	@jakarta.persistence.Column(name = "hiring_date")
    private String hiringDate;
    private String state;
	@jakarta.persistence.Column(name = "casv_date_time")
    private String casvDateTime;
	@jakarta.persistence.Column(name = "consulate_date_time")
    private String consulateDateTime;
	@jakarta.persistence.Column(name = "visa_country")
    private String visaCountry;
    private String status;
	@jakarta.persistence.Column(name = "process_status")
    private String processStatus;
	@jakarta.persistence.Column(name = "owner_id")
    private String ownerId;
    
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public String getVisaApplicationType() {
		return visaApplicationType;
	}
	public void setVisaApplicationType(String visaApplicationType) {
		this.visaApplicationType = visaApplicationType;
	}
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
	}
	public String getAgency() {
		return agency;
	}
	public void setAgency(String agency) {
		this.agency = agency;
	}
	public String getAgencyContact() {
		return agencyContact;
	}
	public void setAgencyContact(String agencyContact) {
		this.agencyContact = agencyContact;
	}
	public String getHiringDate() {
		return hiringDate;
	}
	public void setHiringDate(String hiringDate) {
		this.hiringDate = hiringDate;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCasvDateTime() {
		return casvDateTime;
	}
	public void setCasvDateTime(String casvDateTime) {
		this.casvDateTime = casvDateTime;
	}
	public String getConsulateDateTime() {
		return consulateDateTime;
	}
	public void setConsulateDateTime(String consulateDateTime) {
		this.consulateDateTime = consulateDateTime;
	}
	public String getVisaCountry() {
		return visaCountry;
	}
	public void setVisaCountry(String visaCountry) {
		this.visaCountry = visaCountry;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getProcessStatus() {
		return processStatus;
	}
	public void setProcessStatus(String processStatus) {
		this.processStatus = processStatus;
	}
    
    
    
    
}
