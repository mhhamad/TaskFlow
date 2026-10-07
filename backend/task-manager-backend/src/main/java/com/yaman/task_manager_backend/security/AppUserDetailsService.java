package com.yaman.task_manager_backend.security;

import com.yaman.task_manager_backend.model.User;
import com.yaman.task_manager_backend.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Spring finds this bean and automatically uses it as its user lookup. Dont call it or anything
// This only finds the User it does not check the password.
@Service
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepo userRepo;

    public AppUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findById(email).orElseThrow(() -> new UsernameNotFoundException("No user with email " + email));
        return new AppUserDetails(user);
    }
}