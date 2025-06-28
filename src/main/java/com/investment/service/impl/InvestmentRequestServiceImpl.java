package com.investment.service.impl;

import com.investment.dto.InvestmentRequestDto;
import com.investment.dto.InvestmentResponseDto;
import com.investment.entity.InvestmentRequest;
import com.investment.entity.User;
import com.investment.exception.AccessDeniedException;
import com.investment.exception.ResourceNotFoundException;
import com.investment.repository.InvestmentRequestRepository;
import com.investment.repository.UserRepository;
import com.investment.service.InvestmentRequestService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentRequestServiceImpl implements InvestmentRequestService {

    private final InvestmentRequestRepository investmentRequestRepository;
    private final UserRepository userRepository;

    public InvestmentRequestServiceImpl(InvestmentRequestRepository investmentRequestRepository,
            UserRepository userRepository) {
        this.investmentRequestRepository = investmentRequestRepository;
        this.userRepository = userRepository;
    }

    @Override
    public InvestmentResponseDto createInvestmentRequest(InvestmentRequestDto investmentRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        InvestmentRequest investmentRequest = InvestmentRequest.builder()
                .title(investmentRequestDto.getTitle())
                .description(investmentRequestDto.getDescription())
                .amount(investmentRequestDto.getAmount())
                .status(InvestmentRequest.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        InvestmentRequest savedRequest = investmentRequestRepository.save(investmentRequest);

        return mapToResponseDto(savedRequest);
    }

    @Override
    public List<InvestmentResponseDto> getUserInvestmentRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        return investmentRequestRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvestmentResponseDto> getManagedInvestmentRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER")) &&
                !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only managers and admins can access managed requests");
        }

        User manager = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        return investmentRequestRepository.findByUserManagerId(manager.getId()).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvestmentResponseDto> getEscalatedInvestmentRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only admins can access escalated requests");
        }

        return investmentRequestRepository.findByStatus(InvestmentRequest.Status.ESCALATED).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public InvestmentResponseDto approveInvestmentRequest(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User moderator = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        InvestmentRequest investmentRequest = investmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment Request", "id", id.toString()));

        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        boolean isManager = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER"));
        boolean isEscalated = investmentRequest.getStatus() == InvestmentRequest.Status.ESCALATED;
        boolean isPending = investmentRequest.getStatus() == InvestmentRequest.Status.PENDING;
        boolean isUserSubordinate = investmentRequest.getUser().getManager() != null &&
                investmentRequest.getUser().getManager().getId().equals(moderator.getId());

        if ((isAdmin && isEscalated) || (isManager && isPending && isUserSubordinate)) {
            investmentRequest.setStatus(InvestmentRequest.Status.APPROVED);
            investmentRequest.setModeratedAt(LocalDateTime.now());
            investmentRequest.setModerator(moderator);
            return mapToResponseDto(investmentRequestRepository.save(investmentRequest));
        } else {
            throw new AccessDeniedException("You don't have permission to approve this request");
        }
    }

    @Override
    public InvestmentResponseDto rejectInvestmentRequest(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User moderator = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        InvestmentRequest investmentRequest = investmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment Request", "id", id.toString()));

        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        boolean isManager = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER"));
        boolean isEscalated = investmentRequest.getStatus() == InvestmentRequest.Status.ESCALATED;
        boolean isPending = investmentRequest.getStatus() == InvestmentRequest.Status.PENDING;
        boolean isUserSubordinate = investmentRequest.getUser().getManager() != null &&
                investmentRequest.getUser().getManager().getId().equals(moderator.getId());

        if ((isAdmin && isEscalated) || (isManager && isPending && isUserSubordinate)) {
            investmentRequest.setStatus(InvestmentRequest.Status.REJECTED);
            investmentRequest.setModeratedAt(LocalDateTime.now());
            investmentRequest.setModerator(moderator);
            return mapToResponseDto(investmentRequestRepository.save(investmentRequest));
        } else {
            throw new AccessDeniedException("You don't have permission to reject this request");
        }
    }

    @Override
    public InvestmentResponseDto escalateInvestmentRequest(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User moderator = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authentication.getName()));

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER"))) {
            throw new AccessDeniedException("Only managers can escalate requests");
        }

        InvestmentRequest investmentRequest = investmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment Request", "id", id.toString()));

        if (investmentRequest.getStatus() != InvestmentRequest.Status.PENDING) {
            throw new AccessDeniedException("Only pending requests can be escalated");
        }

        boolean isUserSubordinate = investmentRequest.getUser().getManager() != null &&
                investmentRequest.getUser().getManager().getId().equals(moderator.getId());

        if (!isUserSubordinate) {
            throw new AccessDeniedException("You can only escalate requests from your subordinates");
        }

        investmentRequest.setStatus(InvestmentRequest.Status.ESCALATED);
        investmentRequest.setModeratedAt(LocalDateTime.now());
        investmentRequest.setModerator(moderator);

        return mapToResponseDto(investmentRequestRepository.save(investmentRequest));
    }

    @Override
    public List<InvestmentResponseDto> getAllInvestmentRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only admins can access all investment requests");
        }

        return investmentRequestRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private InvestmentResponseDto mapToResponseDto(InvestmentRequest investmentRequest) {
        InvestmentResponseDto responseDto = new InvestmentResponseDto();
        responseDto.setId(investmentRequest.getId());
        responseDto.setTitle(investmentRequest.getTitle());
        responseDto.setDescription(investmentRequest.getDescription());
        responseDto.setAmount(investmentRequest.getAmount());
        responseDto.setStatus(investmentRequest.getStatus().toString());
        responseDto.setCreatedAt(investmentRequest.getCreatedAt());
        responseDto.setModeratedAt(investmentRequest.getModeratedAt());
        responseDto.setUserId(investmentRequest.getUser().getId());
        responseDto.setUsername(investmentRequest.getUser().getUsername());

        if (investmentRequest.getModerator() != null) {
            responseDto.setModeratorId(investmentRequest.getModerator().getId());
            responseDto.setModeratorName(investmentRequest.getModerator().getUsername());
        }

        return responseDto;
    }
}
