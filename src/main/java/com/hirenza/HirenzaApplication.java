package com.hirenza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableRetry
public class HirenzaApplication {
    public static void main(String[] args) {
        SpringApplication.run(HirenzaApplication.class, args);
    }
}
