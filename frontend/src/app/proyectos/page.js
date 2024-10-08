"use client";
import React, { useState } from "react";
import Image from 'next/image';
import owlImage from '../assets/neo.png'; // Imagen del búho
import "./globals.css"; // Estilos globales

const Proyecto = () => {
  // Simulación de los requerimientos ingresados
  const [requirements, setRequirements] = useState([
    { id: 1, text: "Requirement 1", approved: false },
    { id: 2, text: "Requirement 2", approved: false },
    { id: 3, text: "Requirement 3", approved: false }
  ]);

  const [isPopupOpen, setPopupOpen] = useState(false); // Control del pop-up de confirmación
  const [isAllApproved, setAllApproved] = useState(false); // Verifica si todos los requerimientos están aprobados
  const [currentReqText, setCurrentReqText] = useState(""); // Almacena el texto del requerimiento modificado

  // Función para aprobar un requerimiento
  const handleApprove = (id) => {
    const updatedRequirements = requirements.map((req) => {
      if (req.id === id) {
        return { ...req, approved: true };
      }
      return req;
    });
    setRequirements(updatedRequirements);
    checkIfAllApproved(updatedRequirements); // Verificar si todos están aprobados
  };

  // Función para modificar un requerimiento
  const handleModify = (id, text) => {
    const updatedRequirements = requirements.map((req) => {
      if (req.id === id) {
        return { ...req, text };
      }
      return req;
    });
    setRequirements(updatedRequirements);
  };

  // Verificar si todos los requerimientos están aprobados
  const checkIfAllApproved = (updatedRequirements) => {
    const allApproved = updatedRequirements.every((req) => req.approved);
    setAllApproved(allApproved);
  };

  // Función para abrir el pop-up de confirmación
  const handleComplete = () => {
    setPopupOpen(true);
  };

  // Función para cerrar el pop-up
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="project-container">
      {/* Línea de tiempo (barra superior) */}
      <div className="timeline-bar">
        <div className="timeline-dot active"></div> {/* Primera fase activa */}
        <div className="timeline-dot"></div>
        <div className="timeline-dot"></div>
        <div className="timeline-dot"></div>
      </div>

      {/* Sección de requerimientos */}
      <h2 className="section-title">Requerimientos</h2>
      <div className="requirements-list">
        {requirements.map((req) => (
          <div key={req.id} className={`requirement-item ${req.approved ? 'approved' : ''}`}>
            {/* Input de texto modificable */}
            {!req.approved ? (
              <input
                type="text"
                className="requirement-text"
                value={req.text}
                onChange={(e) => handleModify(req.id, e.target.value)}
              />
            ) : (
              <p className="requirement-text">{req.text}</p>
            )}
            
            {/* Botones de approve/modify */}
            {!req.approved && (
              <div className="buttons">
                <button className="approve-button" onClick={() => handleApprove(req.id)}>Approve</button>
                <button className="modify-button">Modify</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de "Complete" */}
      {isAllApproved && (
        <button className="complete-button" onClick={handleComplete}>
          Complete
        </button>
      )}

      {/* Pop-up de confirmación */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="close-icon" onClick={handleClosePopup}>✕</div>
            <h2>Are you sure you want to move to the next stage?</h2>
            <p>When you click on "Yes" you will not be able to modify anything on this page.</p>
            <div className="popup-buttons">
              <button className="yes-button" onClick={handleClosePopup}>Yes</button>
              <button className="no-button" onClick={handleClosePopup}>No</button>
            </div>
            {/* Texto sobre el búho */}
            <div className="owl-text">
              <p>I'm proud of your great job!</p>
            </div>
            {/* Imagen del búho */}
            <div className="owl-container-popup">
              <Image src={owlImage} alt="Owl" className="owl-image-popup" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyecto;
