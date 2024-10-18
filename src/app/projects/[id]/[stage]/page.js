"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
const componentsPath = "../../../../components";
import ExpandableNavbar from '../../../../components/navbar';
import RequirementCard from '../../../../components/requirements'; // Asegúrate de importar el componente RequirementCard
import NewRequirementModal from '../../../../components/newrequirement'; // Importa el modal para agregar requerimientos
import "./globals.css";

const ProjectPage = () => {
  const { id: projectId, stage } = useParams();
  const [projectName, setProjectName] = useState("");
  const [projectCompany, setProjectCompany] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  const getProjectData = async () => {
    const response = await fetch(`http://localhost:8080/Project/${projectId}`);
    const data = await response.json();
    setProjectName(data.projectInfo.project_name);
    setProjectCompany(data.projectInfo.company_name);
  };

  const fetchProjectData = async () => {
    if (!projectId || !stage) return;

    const endpoints = {
      requirements: `http://localhost:8080/Project/${projectId}/Requirements`,
      planning: `http://localhost:8080/project/${projectId}/planning`,
      estimation: `http://localhost:8080/project/${projectId}/getEstimation`
    };

    const endpoint = endpoints[stage];
    if (!endpoint) {
      setError(`Invalid stage: ${stage}`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Cookies.get("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // Esto debería ser un array de requerimientos
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = (newRequirement) => {
    setData((prevData) => [...prevData, newRequirement]); // Agregar el nuevo requerimiento a la lista
    handleCloseModal(); // Cerrar el modal después de agregar
  };

  useEffect(() => {
    fetchProjectData();
    getProjectData();
  }, [projectId, stage]);

  return (
    <div className="project-container">
      <ExpandableNavbar
        onNewProject={handleOpenModal}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isSidebarExpanded ? "expanded" : ""}`}>
        <div className="header">
          <h2 style={{ textAlign: 'left' }}>Project: {projectName}</h2>
          <p className="subheader" style={{ textAlign: 'left' }}>Company: {projectCompany}</p>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        
        <button className="add-requirement-button" onClick={handleOpenModal}>
          Add Requirement
        </button>

        {data && (
          <div className="requirements-container">
            {data.map((requirement, index) => (
              <RequirementCard key={index} requirement={requirement} />
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar requerimiento */}
      <NewRequirementModal open={isModalOpen} handleClose={handleCloseModal} onAddRequirement={handleAddRequirement} />
    </div>
  );
};

export default ProjectPage;
