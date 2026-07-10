package com.fitsphere.controller;

import com.fitsphere.dto.LoginRequestDto;
import com.fitsphere.dto.LoginResponseDto;
import com.fitsphere.security.CustomUserDetailsService;
import com.fitsphere.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        // 1. Authenticate the user (this internally finds the user and verifies the password using BCrypt)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        // 2. If authentication succeeded, load UserDetails
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDto.getEmail());

        // 3. Generate the JWT token
        final String jwt = jwtUtil.generateToken(userDetails);

        // 4. Return the response
        LoginResponseDto response = LoginResponseDto.builder()
                .token(jwt)
                .message("Login successful")
                .build();

        return ResponseEntity.ok(response);
    }
}
