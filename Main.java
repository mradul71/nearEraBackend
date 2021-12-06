import java.math.*;
import java.util.*;
import java.security.*;
import java.io.*;

public class Main
{
    public static void main(String[] args) throws IOException
    {
        BigInteger p, b, c, secretKey;
        Random sc = new SecureRandom();
        secretKey = new BigInteger("43"); //33+10
        //
        // public key calculation
        //
        System.out.println("secretKey = " + secretKey);
        p = BigInteger.probablePrime(29, sc);
        b = new BigInteger("3");
        c = b.modPow(secretKey, p);
        
        //
        // Encryption
        //
        System.out.print("Enter your Big Number message -->");
        String s = "976776468";
        BigInteger X = new BigInteger(s);
        BigInteger r = new BigInteger(29, sc);
        BigInteger EC = X.multiply(c.modPow(r, p)).mod(p);
        BigInteger brmodp = b.modPow(r, p);
        System.out.println("Plaintext = " + X);
        
        //
        // Decryption
        //
        BigInteger crmodp = brmodp.modPow(secretKey, p);
        BigInteger d = crmodp.modInverse(p);
        BigInteger ad = d.multiply(EC).mod(p);
        
        System.out.println("Decrypt: " + ad);

    }
}