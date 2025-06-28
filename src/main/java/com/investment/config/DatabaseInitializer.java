package com.investment.config;

import com.investment.entity.Role;
import com.investment.entity.User;
import com.investment.repository.RoleRepository;
import com.investment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        createAdminAccount();
    }

    private void initRoles() {
        if (roleRepository.findByName(Role.RoleName.ROLE_REGULAR).isEmpty()) {
            Role regularRole = new Role();
            regularRole.setName(Role.RoleName.ROLE_REGULAR);
            roleRepository.save(regularRole);
        }

        if (roleRepository.findByName(Role.RoleName.ROLE_MANAGER).isEmpty()) {
            Role managerRole = new Role();
            managerRole.setName(Role.RoleName.ROLE_MANAGER);
            roleRepository.save(managerRole);
        }

        if (roleRepository.findByName(Role.RoleName.ROLE_ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }

    private void createAdminAccount() {
        // Check if admin already exists
        if (!userRepository.existsByUsername("admin")) {
            // Create admin user
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .designation("System Administrator")
                    .phoneNumber("1234567890")
                    .build();

            // Assign admin role
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }
}
