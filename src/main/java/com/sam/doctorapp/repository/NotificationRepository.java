package com.sam.doctorapp.repository;

import com.sam.doctorapp.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
