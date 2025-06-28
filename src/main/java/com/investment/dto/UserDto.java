package com.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String designation;
    private String phoneNumber;
    private Set<String> roles;
    private Long managerId;
    private String managerName;
}
