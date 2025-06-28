package com.investment.service;

import com.investment.dto.UserDto;
import com.investment.dto.UserRoleDto;
import com.investment.dto.UserManagerDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();

    List<UserDto> getSubordinates();

    UserDto getUserById(Long id);

    void updateUserRole(UserRoleDto userRoleDto);

    void assignManager(UserManagerDto userManagerDto);
}
