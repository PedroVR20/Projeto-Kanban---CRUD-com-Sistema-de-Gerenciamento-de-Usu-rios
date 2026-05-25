package br.com.gestaodeusuarios;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeradordeSenha {


    public static void main(String[] args) {
        
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        
        
        String senhaPlana = "SenhaMaster2025!"; 
        
       
        String senhaHasheada = passwordEncoder.encode(senhaPlana);
        
       
        System.out.println("================================================================");
        System.out.println("SENHA HASH GERADA (copie a linha abaixo):");
        System.out.println(senhaHasheada);
        System.out.println("================================================================");
    }
}
	
	
