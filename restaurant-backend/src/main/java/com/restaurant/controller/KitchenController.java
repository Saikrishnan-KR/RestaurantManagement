package com.restaurant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.entity.Order;
import com.restaurant.repository.OrderRepository;

@RestController
@RequestMapping("/api/kitchen")
@CrossOrigin(origins = "http://localhost:5173")
public class KitchenController {

    private final OrderRepository orderRepository;

    public KitchenController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/orders")
    public List<Order> getKitchenOrders() {

        return orderRepository.findAll()
                .stream()
                .filter(order ->
                    !"COMPLETED".equalsIgnoreCase(order.getStatus()))
                .toList();
    }
}