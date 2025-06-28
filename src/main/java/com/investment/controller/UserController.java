package com.investment.controller;

import com.investment.dto.UserDto;
import com.investment.dto.UserManagerDto;
import com.investment.dto.UserRoleDto;
import com.investment.dto.ApiResponse;
import com.investment.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/subordinates")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getSubordinates() {
        return ResponseEntity.ok(userService.getSubordinates());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUserRole(@RequestBody UserRoleDto userRoleDto) {
        userService.updateUserRole(userRoleDto);
        return ResponseEntity.ok(new ApiResponse(true, "User role updated successfully"));
    }

    @PutMapping("/manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> assignManager(@RequestBody UserManagerDto userManagerDto) {
        userService.assignManager(userManagerDto);
        return ResponseEntity.ok(new ApiResponse(true, "Manager assigned successfully"));
    }
}
