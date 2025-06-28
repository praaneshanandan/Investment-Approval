package com.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentRequestDto {
    private String title;
    private String description;
    private BigDecimal amount;
}
