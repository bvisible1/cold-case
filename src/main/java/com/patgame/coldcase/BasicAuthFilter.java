package com.patgame.coldcase;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Optional site-wide HTTP Basic Auth gate.
 *
 * Activates ONLY when the env var APP_PASSWORD is set. When it is unset
 * (e.g. local development, the shared zip), this filter is a no-op and the
 * site is open exactly as before.
 *
 * Configure on Railway:
 *   APP_PASSWORD = your-shared-password   (required to turn the gate on)
 *   APP_USERNAME = team                    (optional, defaults to "team")
 *
 * Visitors get a browser login prompt; they enter the username + password
 * once and the browser remembers it for the session.
 */
@Component
@Order(1)
public class BasicAuthFilter implements Filter {

    private final String username;
    private final String password;
    private final boolean enabled;

    public BasicAuthFilter() {
        String u = System.getenv("APP_USERNAME");
        String p = System.getenv("APP_PASSWORD");
        this.username = (u == null || u.isBlank()) ? "team" : u.trim();
        this.password = (p == null) ? "" : p.trim();
        this.enabled = !this.password.isBlank();
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        if (!enabled) {
            chain.doFilter(req, res);
            return;
        }

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Basic ")) {
            String base64 = header.substring(6).trim();
            String decoded;
            try {
                decoded = new String(Base64.getDecoder().decode(base64), StandardCharsets.UTF_8);
            } catch (IllegalArgumentException e) {
                decoded = "";
            }
            int colon = decoded.indexOf(':');
            if (colon >= 0) {
                String u = decoded.substring(0, colon);
                String p = decoded.substring(colon + 1);
                if (constantTimeEquals(u, username) && constantTimeEquals(p, password)) {
                    chain.doFilter(req, res);
                    return;
                }
            }
        }

        response.setHeader("WWW-Authenticate", "Basic realm=\"Cold Case\", charset=\"UTF-8\"");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("text/plain; charset=UTF-8");
        response.getWriter().write("Authentication required.");
    }

    /** Length-aware constant-time comparison to avoid timing leaks. */
    private static boolean constantTimeEquals(String a, String b) {
        byte[] x = a.getBytes(StandardCharsets.UTF_8);
        byte[] y = b.getBytes(StandardCharsets.UTF_8);
        if (x.length != y.length) return false;
        int result = 0;
        for (int i = 0; i < x.length; i++) {
            result |= x[i] ^ y[i];
        }
        return result == 0;
    }
}
