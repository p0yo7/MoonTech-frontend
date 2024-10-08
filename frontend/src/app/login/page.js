'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";

// Import assets
import moontechLogo from '../assets/moontech.png';
import backgroundVideo from '../assets/animationone.mp4';

export default function Login() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); // Estado para controlar el error

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    if (username !== "" && password !== "") {
      setShowError(false); // Escondemos el mensaje de error si el login es exitoso
      router.push('/menu');
    } else {
      setShowError(true); // Mostramos el mensaje de error si las credenciales son incorrectas
    }
  };

  return (
    <div className="login-page">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo.src} type="video/mp4" />
      </video>

      <div className={`container ${showLogin ? 'slide-in' : ''}`}>
        <h1>NEORIS x SAGE</h1>

        <div className="input-container">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Mensaje de error si las credenciales son incorrectas */}
        {showError && <div className="error-message">Credenciales incorrectas. Por favor, inténtalo de nuevo.</div>}

        {/* Botón de login centrado */}
        <button className="login-button" onClick={handleLogin}>Login</button>

        <div className="auth-buttons">
          <div className="auth-button">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft Auth"
              width={30}
              height={30}
            />
          </div>
          <div className="auth-button">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google Auth"
              width={30}
              height={30}
            />
          </div>
        </div>

        <div className="logo-container">
          <Image 
            src={moontechLogo}
            alt="Moontech logo"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
