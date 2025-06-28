package com.investment.repository;

import com.investment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<User> findByManagerId(Long managerId);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_REGULAR'")
    List<User> findAllRegularUsers();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_MANAGER'")
    List<User> findAllManagers();
}
