package org.uway.NarayanSena.services;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CorsService {
    public List<String> getAllowedOrigins() {
        return List.of(
                "https://narayansena-frontend-dy-bxagb8hdcpg5ftgt.eastasia-01.azurewebsites.net", // ✅ Your frontend domain
                "http://localhost:8090",
                "http://localhost:63342",
                "http://localhost:3000"
        );
    }
}
