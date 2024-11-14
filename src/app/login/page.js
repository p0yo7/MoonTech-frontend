'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";
import Cookies from 'js-cookie';
// Import assets
import moontechLogo from '../assets/moontech.png';
import backgroundVideo from '../assets/animationone.mp4';

export default function Login() {
  const data = Cookies.get('username'); // Maneja Cookies
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); // Estado para controlar el error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const decodeJWT = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/login/native', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de autenticación');
      }
      const data = await response.json();
      Cookies.set('authToken', data.token, { expires: 7 }); // Maneja Cookies
      const claims = decodeJWT(data.token);
      Cookies.set('userID', claims.user_id, { expires: 7 }); // Maneja Cookies
      Cookies.set('role', claims.role, { expires: 7 }); // Maneja Cookies
      Cookies.set('team', claims.team, { expires: 7 }); // Maneja Cookies
      Cookies.set('user_first_name', claims.user_first_name, { expires: 7 }); // Maneja Cookies
      // Redirigir al dashboard si el inicio de sesión es exitoso
      router.push('/home'); // Redirigir al dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
