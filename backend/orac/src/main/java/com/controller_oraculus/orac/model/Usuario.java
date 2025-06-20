package com.controller_oraculus.orac.model;

import com.controller_oraculus.orac.enums.AuthProvider;
import com.controller_oraculus.orac.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(nullable = false, unique = true)
    private String email;
    private String senha;
    @Enumerated(EnumType.STRING)
    private Role nivel;
    @Column(name = "auth_provider")
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    public Usuario(String nome, String email, String senha) {

        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nivel = Role.USER;
        this.authProvider = AuthProvider.LOCAL;
    }

    public Usuario(String nome, String email) {

        this.nome = nome;
        this.email = email;
        this.nivel = Role.USER;
        this.authProvider = AuthProvider.GOOGLE;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(nivel.name()));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
