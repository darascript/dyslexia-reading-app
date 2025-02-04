package com.example.dyslexia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.ArrayList;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@Configuration
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private String secretKey = "your256bitlongsecretkeyyour256bitlong"; // Use the same secret key you used for signing the JWT.

    @Override
    protected void doFilterInternal(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        if (token != null && validateToken(token)) {
            String username = getUsernameFromToken(token);

            // Create the authentication object
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username, null, new ArrayList<>()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Set authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Get token after "Bearer "
        }
        return null;
    }

    private boolean validateToken(String token) {
        try {
            Key key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256"); // Using HmacSHA256 for signing the JWT
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String getUsernameFromToken(String token) {
        Key key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
