package com.apidepedidos.demo.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.apidepedidos.demo.dtos.CreateTaskRequest;
import com.apidepedidos.demo.dtos.UpdateTaskRequest;
import com.apidepedidos.demo.logs.model.LogsEntry;
import com.apidepedidos.demo.logs.repository.LogEntryRepository;
import com.apidepedidos.demo.pedidos.model.Task;
import com.apidepedidos.demo.pedidos.repository.TaskRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class TaskService {

	@Autowired 
	private TaskRepository taskRepository;
	
	@Autowired
    private ObjectMapper objectMapper;
	
	@Autowired 
	private LogEntryRepository logEntryRepository;
	
	private String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
			String userId = jwt.getClaimAsString("userId");
			return (userId != null) ? userId : "Usuário Padrão";
		}
		return "Usuário Padrão";
	}

	private boolean isUserMaster() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
			String role = jwt.getClaimAsString("role");
			return "MASTER".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
		}
		return false;
	}

	public Task createTask(CreateTaskRequest request) {
		Task newTask = new Task();
        newTask.setClientName(request.getClientName());
        newTask.setVisaApplicationType(request.getVisaApplicationType());
        newTask.setClientId(request.getClientId());
        newTask.setFile(request.getFile());
        newTask.setAgency(request.getAgency());
        newTask.setAgencyContact(request.getAgencyContact());
        newTask.setHiringDate(request.getHiringDate());
        newTask.setState(request.getState());
        newTask.setCasvDateTime(request.getCasvDateTime());
        newTask.setConsulateDateTime(request.getConsulateDateTime());
        newTask.setVisaCountry(request.getVisaCountry());
        newTask.setStatus(request.getStatus());
        newTask.setProcessStatus(request.getProcessStatus());
        newTask.setOwnerId(getCurrentUserId());
        return taskRepository.save(newTask);
	}
	
	public List<Task> findAllTasks() {
		String currentUserId = getCurrentUserId();
		if (isUserMaster()) {
			return taskRepository.findAll();
		}
		
		if ("Usuário Padrão".equals(currentUserId)) {
			return java.util.Collections.emptyList();
		}
		
		return taskRepository.findByOwnerId(currentUserId);
	}
	
	public Task updateTask(Long taskId, UpdateTaskRequest request) {
	    Task existingTask = taskRepository.findById(taskId)
	            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o ID: " + taskId));

		if (!isUserMaster() && !existingTask.getOwnerId().equals(getCurrentUserId())) {
			throw new RuntimeException("Você não tem permissão para alterar esta tarefa.");
		}

	    Map<String, Object> changes = new HashMap<>();

	    compareAndSet(changes, "clientName", existingTask.getClientName(), request.getClientName(), () -> existingTask.setClientName(request.getClientName()));
	    compareAndSet(changes, "visaApplicationType", existingTask.getVisaApplicationType(), request.getVisaApplicationType(), () -> existingTask.setVisaApplicationType(request.getVisaApplicationType()));
	    compareAndSet(changes, "clientId", existingTask.getClientId(), request.getClientId(), () -> existingTask.setClientId(request.getClientId()));
	    compareAndSet(changes, "file", existingTask.getFile(), request.getFile(), () -> existingTask.setFile(request.getFile()));
	    compareAndSet(changes, "agency", existingTask.getAgency(), request.getAgency(), () -> existingTask.setAgency(request.getAgency()));
	    compareAndSet(changes, "agencyContact", existingTask.getAgencyContact(), request.getAgencyContact(), () -> existingTask.setAgencyContact(request.getAgencyContact()));
	    compareAndSet(changes, "hiringDate", existingTask.getHiringDate(), request.getHiringDate(), () -> existingTask.setHiringDate(request.getHiringDate()));
	    compareAndSet(changes, "state", existingTask.getState(), request.getState(), () -> existingTask.setState(request.getState()));
	    compareAndSet(changes, "casvDateTime", existingTask.getCasvDateTime(), request.getCasvDateTime(), () -> existingTask.setCasvDateTime(request.getCasvDateTime()));
	    compareAndSet(changes, "consulateDateTime", existingTask.getConsulateDateTime(), request.getConsulateDateTime(), () -> existingTask.setConsulateDateTime(request.getConsulateDateTime()));
	    compareAndSet(changes, "visaCountry", existingTask.getVisaCountry(), request.getVisaCountry(), () -> existingTask.setVisaCountry(request.getVisaCountry()));
	    compareAndSet(changes, "status", existingTask.getStatus(), request.getStatus(), () -> existingTask.setStatus(request.getStatus()));

	    
	    compareAndSet(changes, "processStatus", existingTask.getProcessStatus(), request.getProcessStatus(), () -> existingTask.setProcessStatus(request.getProcessStatus()));

	    if (!changes.isEmpty()) {
	        Task updatedTask = taskRepository.save(existingTask);
	        if (request.getEditReason() != null && !request.getEditReason().trim().isEmpty()) {
	        	
	        	try {
		        		String changesJson = objectMapper.writeValueAsString(changes);
		        		
		        		LogsEntry log = new LogsEntry(taskId.toString(), "EDIÇÃO", request.getEditReason(), getCurrentUserId(), changesJson);
		        		logEntryRepository.save(log);
	        	} catch (JsonProcessingException e) {
	        		e.printStackTrace();
	        	}
	        }
	        return updatedTask;
	    } else {
	        return existingTask;
	    }
	}

    public void deleteTask(Long taskId, String reason) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o ID: " + taskId));

		if (!isUserMaster() && !existingTask.getOwnerId().equals(getCurrentUserId())) {
			throw new RuntimeException("Você não tem permissão para deletar esta tarefa.");
		}

        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("O motivo do cancelamento é obrigatório.");
        }
        taskRepository.deleteById(taskId);
        LogsEntry log = new LogsEntry(taskId.toString(), "CANCELAMENTO", reason, getCurrentUserId());
        logEntryRepository.save(log);
    }

    private void compareAndSet(Map<String, Object> changes, String fieldName, String oldValue, String newValue, Runnable setter) {
        if (newValue != null && !newValue.equals(oldValue)) {
            Map<String, String> changeDetail = new HashMap<>();
            changeDetail.put("de", oldValue);
            changeDetail.put("para", newValue);
            changes.put(fieldName, changeDetail);
            setter.run();
        }
    }
}
