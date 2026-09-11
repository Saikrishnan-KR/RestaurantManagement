package com.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.entity.MenuItem;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {

}