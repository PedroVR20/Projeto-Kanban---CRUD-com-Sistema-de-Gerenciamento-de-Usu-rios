package com.apidepedidos.demo.logs.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_logsentry")
public class LogsEntry {
	
	
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	private String taskId;
    private String action;
    private String reason;
    
    @Column(name = "user_name")
    private String user;
    
    private LocalDateTime timestamp;
    
    @Column(columnDefinition = "TEXT")
    private String changes;
    
    

    public LogsEntry(String taskId, String action, String reason, String user) {
        this.taskId = taskId;
        this.action = action;
        this.reason = reason;
        this.user = user;
        this.timestamp = LocalDateTime.now();
    }
    
    public LogsEntry(String taskId, String action, String reason, String user, String changes) {
        this.taskId = taskId;
        this.action = action;
        this.reason = reason;
        this.user = user;
        this.timestamp = LocalDateTime.now();
        this.changes = changes;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public String getChanges() {
		return changes;
	}

	public void setChanges(String changes) {
		this.changes = changes;
	}
    
    
    
}