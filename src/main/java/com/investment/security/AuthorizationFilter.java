package com.investment.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Check if the request is for login or register
        if ((path.equals("/api/auth/login") || path.equals("/api/auth/register"))) {
            // Check if user is authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !authentication.getPrincipal().equals("anonymousUser")) {

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                String errorMessage = path.equals("/api/auth/login")
                        ? "{\"timestamp\":\"" + java.time.LocalDateTime.now()
                                + "\",\"message\":\"You are already logged in\",\"path\":\"" + path
                                + "\",\"errorCode\":400}"
                        : "{\"timestamp\":\"" + java.time.LocalDateTime.now()
                                + "\",\"message\":\"Please log out before registering a new account\",\"path\":\""
                                + path + "\",\"errorCode\":400}";

                response.getWriter().write(errorMessage);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
