package org.uway.NarayanSena.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.uway.NarayanSena.services.CorsService;
import java.util.List;
@Configuration
public class CorsConfig {

    private final CorsService corsService;

    public CorsConfig(CorsService corsService) {
        this.corsService = corsService;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Get allowed origins from CorsService
        List<String> allowedOrigins = corsService.getAllowedOrigins();
        System.out.println("Allowed Origins: " + allowedOrigins);//debugging line

        // Dynamically fetch allowed origins from CorsService
        corsConfiguration.setAllowedOrigins(corsService.getAllowedOrigins());
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
