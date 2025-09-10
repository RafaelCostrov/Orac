package com.controller_oraculus.orac.handler;

import com.controller_oraculus.orac.model.Usuario;
import com.controller_oraculus.orac.service.JwtService;
import com.controller_oraculus.orac.wrapper.CustomOAuth2User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        Usuario usuario = customOAuth2User.getUsuario();

        String jwt = jwtService.gerarToken(usuario);

        System.out.println("Usuario: " + usuario);
        System.out.println("Nome: " + usuario.getNome());
        System.out.println("Email: " + usuario.getEmail());
        Map<String, String> body = new HashMap<>();
        body.put("token", jwt);
        body.put("nome", usuario.getNome());
        body.put("email", usuario.getEmail());
        System.out.println("Body: " + body);


        String json = new ObjectMapper().writeValueAsString(body);
        System.out.println("Payload enviado ao postMessage: " + json);

        String script = "<script>" +
                "window.opener.postMessage(" +
                json +
                ", '*'); window.close();" +
                "</script>";

        response.setContentType("text/html");
        response.getWriter().write(script);
    }
}
