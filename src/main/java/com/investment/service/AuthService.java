package com.investment.service;

import com.investment.dto.LoginDto;
import com.investment.dto.RegisterDto;
import com.investment.dto.JwtAuthResponse;
import com.investment.dto.ApiResponse;

public interface AuthService {
    JwtAuthResponse login(LoginDto loginDto);

    ApiResponse register(RegisterDto registerDto);
}
