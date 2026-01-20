package com.soulink;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SoulinkApplication {

    public static void main(String[] args) {
        // 🔹 Cargar .env antes de Spring
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // 🔹 Pasar variables al sistema
        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        System.setProperty("JWT_EXPIRATION", dotenv.get("JWT_EXPIRATION"));

        // 🔹 Debug rápido para verificar variables
        System.out.println("DB_URL=" + System.getProperty("DB_URL"));
        System.out.println("DB_USERNAME=" + System.getProperty("DB_USERNAME"));
        System.out.println("DB_PASSWORD=" + System.getProperty("DB_PASSWORD"));

        SpringApplication.run(SoulinkApplication.class, args);
    }
}
