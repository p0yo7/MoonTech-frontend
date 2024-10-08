"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import owlImage from '../assets/neo.png'; // Importa la imagen del búho
import neorisSageImage from '../assets/neoris-sage.png'; // Importa la imagen para "Neoris x Sage"
import nuImage from '../assets/nu.png'; // Imagen del proyecto Nu
import cemexImage from '../assets/cemex.png'; // Imagen del proyecto Cemex
import brandImage from '../assets/brand.png'; // Imagen del proyecto Brand
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import NewProjectModal from './newproj'; // Importa el modal
import "./globals.css"; // Estilos

const MenuPage = () => {
  const router = useRouter(); // Hook para redirigir
  const [isSidebarExpanded, setSidebarExpanded] = useState(false); // Estado de la sidebar
  const [isModalOpen, setModalOpen] = useState(false); // Estado del modal

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded); // Alternar estado de expansión
  };

  const handleOpenModal = () => setModalOpen(true); // Abre el modal
  const handleCloseModal = () => setModalOpen(false); // Cierra el modal

  return (
    <div className="menu-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarExpanded ? "expanded" : ""}`}>
        <button className="hamburger-button" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        {isSidebarExpanded && (
          <Image src={neorisSageImage} alt="Neoris x Sage" className="sidebar-logo" />
        )}
        <div className="sidebar-links">
          <button onClick={() => router.push("/menu")} className="sidebar-button">
            <HomeIcon />
            {isSidebarExpanded && " Dashboard"}
          </button>
          <button onClick={() => router.push("/kanban")} className="sidebar-button">
            <DashboardIcon />
            {isSidebarExpanded && " Kanban"}
          </button>
          <button onClick={() => router.push("/notifications")} className="sidebar-button">
            <NotificationsIcon />
            {isSidebarExpanded && " Notifications"}
          </button>
          <button onClick={() => router.push("/settings")} className="sidebar-button">
            <SettingsIcon />
            {isSidebarExpanded && " Settings"}
          </button>
          <button onClick={() => router.push("/login")} className="sidebar-button">
            <ExitToAppIcon />
            {isSidebarExpanded && " Log out"}
          </button>
          <button onClick={handleOpenModal} className="sidebar-button"> {/* Botón para abrir el modal */}
            <DashboardIcon />
            {isSidebarExpanded && " New Project"}
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className={`main-content ${isSidebarExpanded ? "expanded" : ""}`}>
        <div className="header">
          <h2>Welcome, Edward Altamirano</h2>
          <p className="subheader">Your projects</p>
        </div>

        {/* Sección de proyectos con scrollbar */}
        <div className="projects-section">
          <button onClick={() => router.push("/project")} className="project-card">
            <Image src={nuImage} alt="Nu Project" className="project-image" />
          </button>
          <button onClick={() => router.push("/project")} className="project-card">
            <Image src={cemexImage} alt="Cemex Project" className="project-image" />
          </button>
          <button onClick={() => router.push("/project")} className="project-card">
            <Image src={brandImage} alt="Brand Project" className="project-image" />
          </button>
          <button onClick={handleOpenModal} className="project-card">
            <div className="add-project">+</div>
          </button>
        </div>

        {/* Botón para crear nuevo proyecto */}
        <div className="new-project-button">
          <button onClick={handleOpenModal}>Create New Project</button>
        </div>
      </div>

      {/* Pestaña lateral derecha con texto y búho */}
      <div className="right-sidebar">
        <p className="helper-text">
          Hi! I'm Neo, we are working together from now and I will always be here to help you with whatever you need. <br /><br />
          Please, let's do a great job together! <br /><br />
          -Best regards, Neo.
        </p>
        <Image src={owlImage} alt="Owl" className="owl-image" /> {/* Imagen del búho */}
      </div>

      {/* Modal para Nuevo Proyecto */}
      <NewProjectModal open={isModalOpen} handleClose={handleCloseModal} />
    </div>
  );
};

export default MenuPage;
