package com.hirenza.domain;

import jakarta.persistence.*;

/*
Represents an extracted skill from a resume.
We store these separately so we don't duplicate "Java" a million times.
*/
@Entity
@Table(name = "skills")
public class Skill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    protected Skill() {}

    public Skill(String name) {
        this.name = name;
    }
    
    public Long getId() { return id; }
    public String getName() { return name; }
}
