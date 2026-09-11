package com.restaurant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.entity.OrderItem;
import com.restaurant.repository.OrderItemRepository;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    private final OrderItemRepository orderItemRepository;

    public OrderItemController(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getItemsByOrder(
            @PathVariable Long orderId) {

        return orderItemRepository.findByOrderId(orderId);
    }

    @PostMapping
    public OrderItem addOrderItem(
            @RequestBody OrderItem orderItem) {

        orderItem.setSubtotal(
                orderItem.getQuantity()
                * orderItem.getUnitPrice()
        );

        return orderItemRepository.save(orderItem);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderItem(@PathVariable Long id) {
        orderItemRepository.deleteById(id);
    }
}