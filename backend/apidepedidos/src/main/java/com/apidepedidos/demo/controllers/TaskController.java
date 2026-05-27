package com.apidepedidos.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apidepedidos.demo.dtos.CreateTaskRequest;
import jakarta.validation.Valid;
import com.apidepedidos.demo.dtos.UpdateTaskRequest;
import com.apidepedidos.demo.pedidos.model.Task;
import com.apidepedidos.demo.services.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	@Autowired private TaskService taskService;
	
	@PostMapping
	public ResponseEntity<Task> createTask(@RequestBody @Valid CreateTaskRequest request) {
		
	    Task createdTask = taskService.createTask(request);
	    
	    return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
	}
	
	@GetMapping
	public ResponseEntity<Iterable<Task>> getAllTasks() {
	    Iterable<Task> tasks = taskService.findAllTasks();
	    
	    return ResponseEntity.ok(tasks);
	}
	
	@PatchMapping("/{Id}")
	public ResponseEntity<Task> updateTask(@PathVariable Long Id, @RequestBody UpdateTaskRequest request) {
	try { 
		
		Task updatedTask = taskService.updateTask(Id, request);
	    
	    return ResponseEntity.ok(updatedTask);
	
	} catch (RuntimeException e) {
	    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}
  }
	
	@DeleteMapping("/{id}" )
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam String reason) {
        try {
            taskService.deleteTask(id, reason);
            
       
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
           
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
	}
}
