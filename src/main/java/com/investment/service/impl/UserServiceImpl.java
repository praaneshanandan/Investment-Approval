package com.investment.service.impl;

import com.investment.dto.UserDto;
import com.investment.dto.UserManagerDto;
import com.investment.dto.UserRoleDto;
import com.investment.entity.Role;
import com.investment.entity.User;
import com.investment.exception.AccessDeniedException;
import com.investment.exception.ResourceNotFoundException;
import com.investment.repository.RoleRepository;
import com.investment.repository.UserRepository;
import com.investment.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<UserDto> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return userRepository.findAll().stream()
                    .map(this::mapToUserDto)
                    .collect(Collectors.toList());
        } else {
            User manager = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

            return userRepository.findByManagerId(manager.getId()).stream()
                    .map(this::mapToUserDto)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public List<UserDto> getSubordinates() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User manager = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        return userRepository.findByManagerId(manager.getId()).stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));

        return mapToUserDto(user);
    }

    @Override
    public void updateUserRole(UserRoleDto userRoleDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only admin can update user roles");
        }

        User currentAdmin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        User user = userRepository.findById(userRoleDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userRoleDto.getUserId().toString()));

        if (user.getId().equals(currentAdmin.getId())) {
            throw new AccessDeniedException("Admin cannot change their own role");
        }

        Role role = roleRepository.findByName(Role.RoleName.valueOf(userRoleDto.getRoleName()))
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", userRoleDto.getRoleName()));

        // Check if trying to demote admin
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleName.ROLE_ADMIN);

        if (isAdmin && role.getName() != Role.RoleName.ROLE_ADMIN) {
            throw new AccessDeniedException("Cannot demote an admin to another role");
        }

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        userRepository.save(user);
    }

    @Override
    public void assignManager(UserManagerDto userManagerDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only admin can assign managers");
        }

        User user = userRepository.findById(userManagerDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userManagerDto.getUserId().toString()));

        User manager = userManagerDto.getManagerId() != null ? userRepository.findById(userManagerDto.getManagerId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("User", "id", userManagerDto.getManagerId().toString()))
                : null;

        boolean isUserRegular = user.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleName.ROLE_REGULAR);

        if (!isUserRegular) {
            throw new AccessDeniedException("Only regular users can be assigned managers");
        }

        if (manager != null) {
            boolean isManagerAManager = manager.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleName.ROLE_MANAGER);

            if (!isManagerAManager) {
                throw new AccessDeniedException("The assigned manager must have MANAGER role");
            }
        }

        user.setManager(manager);
        userRepository.save(user);
    }

    private UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setDesignation(user.getDesignation());
        userDto.setPhoneNumber(user.getPhoneNumber());

        userDto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toSet()));

        if (user.getManager() != null) {
            userDto.setManagerId(user.getManager().getId());
            userDto.setManagerName(user.getManager().getUsername());
        }

        return userDto;
    }
}
