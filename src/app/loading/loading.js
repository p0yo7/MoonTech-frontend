import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./globals.css";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/menu");  // Redirigir al menú después de 2 segundos
    }, 2000);
  }, [navigate]);

  return (
    <div className="loading-screen">
      <h1>NEORIS x SAGE</h1>
      <div className="loading-bar">
        <div className="bar"></div>
      </div>
      <p>We are preparing your feed...</p>
    </div>
  );
}
