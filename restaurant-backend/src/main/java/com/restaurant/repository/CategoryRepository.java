package com.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}