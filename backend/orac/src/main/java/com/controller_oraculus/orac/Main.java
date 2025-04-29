package com.controller_oraculus.orac;

import com.controller_oraculus.orac.model.Empresa;
import com.controller_oraculus.orac.repositorio.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Main {

    @Autowired
    private EmpresaRepository repository;

    public List<Empresa> getEmpresas() {
        return repository.findAll();
    }
}
