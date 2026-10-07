package com.yaman.task_manager_backend.security;

import com.yaman.task_manager_backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AppUserDetails implements UserDetails {

    private final User user;

    public AppUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    @Override
    public String getUsername() {
        // Spring's uses "username" as a method don't confuse it with (our email)
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        // the BCrypt hash
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // no roles yet
        return List.of();
    }

    // Account-status flags: we don't use these features, so all true (needed for the im)
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}