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

import com.restaurant.entity.MenuItem;
import com.restaurant.repository.MenuRepository;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {

    private final MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
    }

    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        return menuRepository.save(menuItem);
    }

    @PutMapping("/{id}")
    public MenuItem updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem menuItem) {

        MenuItem existing = menuRepository.findById(id)
                .orElseThrow();

        existing.setName(menuItem.getName());
        existing.setCategory(menuItem.getCategory());
        existing.setPrice(menuItem.getPrice());
        existing.setAvailable(menuItem.isAvailable());

        return menuRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable Long id) {
        menuRepository.deleteById(id);
    }
}