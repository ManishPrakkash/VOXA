package com.webautomation.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/java")
@CrossOrigin(origins = "*")
public class VerifierController {

    @PostMapping("/verifier")
    public Map<String, Object> verify(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        
        String instruction = payload.getOrDefault("instruction", "unknown");
        
        response.put("verified", true);
        response.put("note", "Java microservice is operational");
        response.put("instruction_received", instruction);
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("service", "Web Automation Java Microservice");
        response.put("version", "1.0.0");
        
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Java Microservice");
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return response;
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Web Automation Java Microservice");
        response.put("version", "1.0.0");
        response.put("description", "A simple Java microservice for the Web Automation Agent system");
        response.put("java_version", System.getProperty("java.version"));
        response.put("spring_boot_version", "3.2.0");
        return response;
    }
}

