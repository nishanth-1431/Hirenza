package com.hirenza;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
    public static void main(String[] args) {
        System.out.println("HASH_START:" + new BCryptPasswordEncoder().encode("hash") + ":HASH_END");
    }
}
