"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import owlImage from '../assets/neo.png';
import nuImage from '../assets/nu.png';
import cemexImage from '../assets/cemex.png';
import brandImage from '../assets/brand.png';
import NewProjectModal from './newproj';
import "./globals.css";

// Componentes
import ExpandableNavbar from '../../components/navbar';

const MenuPage = () => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="menu-container">
      {/* Usar el componente ExpandableNavbar */}
      <ExpandableNavbar 
        onNewProject={handleOpenModal}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />

      {/* Contenedor principal */}
      <div className={`main-content ${isSidebarExpanded ? "expanded" : ""}`}>
        <div className="header">
          <h2>Welcome, Edward Altamirano</h2>
          <p className="subheader">Your projects</p>
        </div>

        {/* Sección de proyectos con scrollbar */}
        <div className="projects-section">
          <button onClick={() => router.push("/project/")} className="project-card">
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
        <Image src={owlImage} alt="Owl" className="owl-image" />
      </div>

      {/* Modal para Nuevo Proyecto */}
      <NewProjectModal open={isModalOpen} handleClose={handleCloseModal} />
    </div>
  );
};

export default MenuPage;