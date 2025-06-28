package com.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentResponseDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime moderatedAt;
    private Long userId;
    private String username;
    private Long moderatorId;
    private String moderatorName;
}
