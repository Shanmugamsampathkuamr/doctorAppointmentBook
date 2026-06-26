package com.sam.doctorapp.auth.repository;

import com.sam.doctorapp.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.deleted = false")
    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = ?1 AND u.deleted = false")
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id = ?1 AND u.deleted = false")
    Optional<User> findByIdAndNotDeleted(Long id);
}
