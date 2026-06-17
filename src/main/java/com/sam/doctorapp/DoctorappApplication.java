package com.sam.doctorapp;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DoctorappApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoctorappApplication.class, args);

        System.out.println(new BCryptPasswordEncoder().encode("Sampathadmin12222@944475@812226"));
	}




}
