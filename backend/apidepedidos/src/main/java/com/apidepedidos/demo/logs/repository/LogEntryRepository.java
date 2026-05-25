package com.apidepedidos.demo.logs.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apidepedidos.demo.logs.model.LogsEntry;

@Repository
public interface LogEntryRepository extends JpaRepository<LogsEntry, String> {

}
