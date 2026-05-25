package br.com.apidevistos.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.apidevistos.dtos.VistoRequestDto;
import br.com.apidevistos.dtos.VistoResponseDto;
import br.com.apidevistos.entities.Visto;
import br.com.apidevistos.services.VistoService;

@RestController
@RequestMapping("/api/v1/vistos")
public class VistoController {

    @Autowired
    private VistoService vistoService;

    @GetMapping
    public ResponseEntity<List<VistoResponseDto>> listarVistos() {

        List<Visto> vistos = vistoService.listarTodosVistos();

        List<VistoResponseDto> vistosDto = vistos.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(vistosDto);
    }

    @PostMapping
    public ResponseEntity<VistoResponseDto> criarVisto(@RequestBody VistoRequestDto vistoRequestDto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID operadorId = UUID.fromString(jwt.getClaimAsString("userId"));
        Visto novoVisto = vistoService.criarVisto(vistoRequestDto.getNome(), operadorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponseDto(novoVisto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisto(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        String userProfile = jwt.getClaimAsString("role");

        vistoService.deleteVisto(id);
        return ResponseEntity.noContent().build();
    }

    private VistoResponseDto convertToResponseDto(Visto visto) {
        VistoResponseDto dto = new VistoResponseDto();
        dto.setId(visto.getId());
        dto.setNome(visto.getNome());
        dto.setNomeOperador("Operador ID: " + visto.getOperadorId());
        return dto;
    }
}
