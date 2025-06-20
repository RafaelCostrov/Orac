package com.controller_oraculus.orac.service;

import com.controller_oraculus.orac.model.Usuario;
import com.controller_oraculus.orac.repositorio.UsuarioRepository;
import com.controller_oraculus.orac.wrapper.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final UsuarioRepository usuarioRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUserService delegate = new OidcUserService();
        OidcUser oidcUser = delegate.loadUser(userRequest);

        String email = oidcUser.getAttribute("email");
        String nome = oidcUser.getAttribute("name");

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario novoUsuario = new Usuario(nome, email);
                    return usuarioRepository.save(novoUsuario);
                });

        return new CustomOAuth2User(oidcUser, usuario);
    }
}
