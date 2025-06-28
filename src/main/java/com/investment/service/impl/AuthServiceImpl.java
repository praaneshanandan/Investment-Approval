package com.investment.service.impl;

import com.investment.dto.JwtAuthResponse;
import com.investment.dto.LoginDto;
import com.investment.dto.RegisterDto;
import com.investment.dto.UserDto;
import com.investment.dto.ApiResponse;
import com.investment.entity.Role;
import com.investment.entity.User;
import com.investment.exception.BadRequestException;
import com.investment.exception.ResourceNotFoundException;
import com.investment.repository.RoleRepository;
import com.investment.repository.UserRepository;
import com.investment.security.JwtTokenProvider;
import com.investment.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", loginDto.getUsername()));

        UserDto userDto = mapToUserDto(user);

        return new JwtAuthResponse(token, userDto);
    }

    @Override
    public ApiResponse register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .designation(registerDto.getDesignation())
                .phoneNumber(registerDto.getPhoneNumber())
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_REGULAR)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_REGULAR"));
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        UserDto userDto = mapToUserDto(savedUser);

        return new ApiResponse(true, "User registered successfully", userDto);
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
