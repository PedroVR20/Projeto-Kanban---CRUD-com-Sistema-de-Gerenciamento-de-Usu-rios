package com.apidepedidos.demo.pedidos.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apidepedidos.demo.pedidos.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwnerId(String ownerId, Pageable pageable);
}
