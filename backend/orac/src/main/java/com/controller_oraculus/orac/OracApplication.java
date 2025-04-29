package com.controller_oraculus.orac;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OracApplication implements CommandLineRunner {

	private final Main main;

	@Autowired
	public OracApplication(Main main) {
		this.main = main;
	}

	public static void main(String[] args) {
		SpringApplication.run(OracApplication.class, args);
	}

	@Override
	public void run(String... args) {
		var empresas = main.getEmpresas();
		empresas.forEach(System.out::println);
	}
}

