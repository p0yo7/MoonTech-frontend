"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos useRouter
import owlImage from '../assets/neo.png';
import "./globals.css";
import Cookies from "js-cookie";

const NuevoProyecto = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [projectArea, setProjectArea] = useState("");
  const [selectedCompanyAreas, setSelectedCompanyAreas] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [headerText, setHeaderText] = useState("Let's create a new project!");
  const [dropdownVisible, setDropdownVisible] = useState({});
  const router = useRouter(); // Inicializamos useRouter
  // Recibir los users por area
  // Recibir las areas
  // Hacer post a la ruta de backend para crear el proyecto
  // 
  const projectAreas = ["Alimenticia", "Agrícola", "Textil", "Manufactura", "Tecnología"];
  const companyAreas = {
    "Comercial": ["User 1", "User 2", "User 3"],
    "GDM": ["User 3", "User 4"],
    "Dev": ["User 5", "User 6"],
    "Finanzas": ["User 7", "User 8"],
  };

  const dropdownRefs = useRef({});

  const handleTitleSubmit = () => {
    if (title.trim() !== "") {
      setStep(2);
      setHeaderText("Select the area of the project");
    }
  };

  const handleProjectAreaSubmit = () => {
    if (projectArea) {
      setStep(3);
      setHeaderText("Which company areas are involved?");
    }
  };

  const handleUserSelection = (area, user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const updatedUsers = { ...prevSelectedUsers };
      if (!updatedUsers[area]) {
        updatedUsers[area] = [];
      }
      if (!updatedUsers[area].includes(user)) {
        updatedUsers[area] = [...updatedUsers[area], user];
      }
      return updatedUsers;
    });
  };

  const removeSelectedUser = (area, user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const updatedUsers = { ...prevSelectedUsers };
      updatedUsers[area] = updatedUsers[area].filter((u) => u !== user);
      if (updatedUsers[area].length === 0) {
        delete updatedUsers[area];
      }
      return updatedUsers;
    });
  };

  const toggleDropdown = (area) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(dropdownRefs.current).forEach((area) => {
      if (dropdownRefs.current[area] && !dropdownRefs.current[area].contains(event.target)) {
        setDropdownVisible((prev) => ({
          ...prev,
          [area]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const decodeJWT = (token) => {
  //   const base64Url = token.split(".")[1];
  //   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //   const jsonPayload = decodeURIComponent(
  //     window
  //       .atob(base64)
  //       .split("")
  //       .map(function (c) {
  //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join("")
  //   );
  //   return JSON.parse(jsonPayload);
  // }
  const handleFinalStep = () => {
    setStep(4);
    setHeaderText("Almost there! Ready to start?");
  };
  const handleProjectCreation = async () => {
    // const claims = decodeJWT(Cookies.get("authToken"));
    const request = {
      ProjectName: title,
      AreaID: 1,
      // OwnerID: parseInt(Cookies.get("userID"), 10), no se necesita
      CompanyID: 1, // Reemplazar con el ID de la empresa actual
      StartDate: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
    };
    try {
      const response = await fetch('http://localhost:8080/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Cookies.get("authToken")}`,
        },
        body: JSON.stringify(request),
      });
  
      // Verificar si la respuesta es correcta (código 200-299)
      if (!response.ok) {
        console.error("Error al crear el proyecto:", response);
        return; // Salir si hay un error
      }
  
      // Intentar extraer el cuerpo como JSON
      const data = await response.json();
  
      console.log("Mensaje:", data.message); // Accede al mensaje de éxito
      console.log("ID del Proyecto:", data.project); // Accede al ID del proyecto
  
      // Redirigir al proyecto creado
      router.push(`/projects/${data.project}`);
    } catch (error) {
      console.error("Error de red:", error); // Manejo de errores de red
    }
  };
  
  const handleClose = () => {
    
  }
  return (
    <div className="new-project-container">
      <div className="header">
        <div className="header-text">
          <p>{headerText}</p>
        </div>
        <div className="owl-container">
          <Image src={owlImage} alt="Owl" className="owl-image" width={50} height={50} />
        </div>
      </div>

      <div className="content">
        {step === 1 && (
          <div className="step-content">
            <h2>Write down your title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter project title"
            />
            <button className="arrow-button" onClick={handleTitleSubmit}>➔</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Select the project area</h2>
            <select
              value={projectArea}
              onChange={(e) => setProjectArea(e.target.value)}
              className="input-field"
            >
              <option value="">Select a project area</option>
              {projectAreas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
            <button className="arrow-button" onClick={handleProjectAreaSubmit}>➔</button>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Select the company areas and members</h2>
            <div className="areas-container">
              <div className="areas-selection">
                {Object.keys(companyAreas).map((area, index) => (
                  <div key={index} className="company-area-section">
                    <h3>{area}</h3>
                    <select
                      className="dropdown-select"
                      onChange={(e) => handleUserSelection(area, e.target.value)}
                      value=""
                    >
                      <option value="">Select a member</option>
                      {companyAreas[area].map((user, userIndex) => (
                        <option key={userIndex} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="selected-users">
                <h3>Selected Members</h3>
                {Object.entries(selectedUsers).map(([area, users]) => (
                  <div key={area} className="selected-area">
                    <h4>{area}</h4>
                    {users.map((user, index) => (
                      <div key={index} className="selected-user">
                        {user}
                        <button
                          className="remove-user"
                          onClick={() => removeSelectedUser(area, user)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button className="arrow-button" onClick={handleFinalStep}>➔</button>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Are you sure you want to create a new project?</h2>
            <div className="confirm-buttons">
              <button className="yes-button" onClick={handleProjectCreation}>Yes</button>
              <button className="no-button" onClick={handleClose}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NuevoProyecto;

// Agregar la parte de que no se quiere crear el proyecto y te regresa al menu anterior