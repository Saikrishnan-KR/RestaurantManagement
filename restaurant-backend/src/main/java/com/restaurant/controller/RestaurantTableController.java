package com.restaurant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.entity.RestaurantTable;
import com.restaurant.repository.RestaurantTableRepository;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantTableController {

    private final RestaurantTableRepository tableRepository;

    public RestaurantTableController(
            RestaurantTableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @PostMapping
    public RestaurantTable addTable(
            @RequestBody RestaurantTable table) {
        return tableRepository.save(table);
    }

    @PutMapping("/{id}")
    public RestaurantTable updateTable(
            @PathVariable Long id,
            @RequestBody RestaurantTable table) {

        RestaurantTable existing =
                tableRepository.findById(id).orElseThrow();

        existing.setTableNumber(table.getTableNumber());
        existing.setCapacity(table.getCapacity());
        existing.setStatus(table.getStatus());
        existing.setLocation(table.getLocation());

        return tableRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable Long id) {
        tableRepository.deleteById(id);
    }
}