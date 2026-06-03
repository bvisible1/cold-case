package com.patgame.coldcase;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

/**
 * Secure proxy to the Anthropic Messages API.
 * The frontend's window.claude.complete shim POSTs here; the API key
 * stays server-side and is read from the ANTHROPIC_API_KEY env var.
 */
@RestController
@RequestMapping("/api")
public class CompleteController {

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    @Value("${anthropic.model}")
    private String model;

    @Value("${anthropic.maxTokens}")
    private int maxTokens;

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody JsonNode body) {
        String apiKey = System.getenv("ANTHROPIC_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "ANTHROPIC_API_KEY not set on the server"));
        }

        try {
            // Build the Anthropic request body.
            ObjectNode req = mapper.createObjectNode();
            req.put("model", model);
            req.put("max_tokens", maxTokens);

            ArrayNode messages = req.putArray("messages");

            if (body.has("messages") && body.get("messages").isArray()) {
                // Pass through a messages array (role + content).
                for (JsonNode m : body.get("messages")) {
                    ObjectNode msg = messages.addObject();
                    msg.put("role", m.path("role").asText("user"));
                    msg.put("content", contentToText(m.path("content")));
                }
            } else {
                // Treat a bare prompt string as a single user message.
                String prompt = body.has("prompt")
                        ? body.get("prompt").asText()
                        : body.asText();
                ObjectNode msg = messages.addObject();
                msg.put("role", "user");
                msg.put("content", prompt);
            }

            // Optional top-level system instruction.
            if (body.has("system") && !body.get("system").asText().isBlank()) {
                req.put("system", body.get("system").asText());
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ANTHROPIC_URL))
                    .timeout(Duration.ofSeconds(60))
                    .header("content-type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(req)))
                    .build();

            HttpResponse<String> resp = http.send(request, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() >= 400) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "Anthropic API error", "detail", resp.body()));
            }

            // Extract the text from content[0].text and return it as { text: ... }
            JsonNode root = mapper.readTree(resp.body());
            String text = "";
            JsonNode content = root.path("content");
            if (content.isArray() && content.size() > 0) {
                text = content.get(0).path("text").asText("");
            }
            return ResponseEntity.ok(Map.of("text", text));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** Anthropic content can be a string or an array of blocks; normalize to text. */
    private String contentToText(JsonNode content) {
        if (content.isTextual()) return content.asText();
        if (content.isArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode block : content) {
                sb.append(block.path("text").asText(""));
            }
            return sb.toString();
        }
        return content.asText("");
    }
}
