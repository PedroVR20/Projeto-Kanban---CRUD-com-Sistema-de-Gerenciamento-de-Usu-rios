package com.apidepedidos.demo.dtos;
import lombok.Data;

@Data
public class UpdateTaskRequest {
   
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

	public String getEditReason() {
		return editReason;
	}

	public void setEditReason(String editReason) {
		this.editReason = editReason;
	}

	private String clientName;
    private String visaApplicationType;
    private String clientId;
    private String file;
    private String agency;
    private String agencyContact;
    private String hiringDate;
    private String state;
    private String casvDateTime;
    private String consulateDateTime;
    private String visaCountry;
    private String status;
    private String processStatus;
    
    private String editReason;
}