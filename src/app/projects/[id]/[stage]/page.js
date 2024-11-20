"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ExpandableNavbar from "../../../../components/navbar";
import RequirementCard from "../../../../components/requirements";
import NewRequirementModal from "../../../../components/newrequirement";
import TarjetaTarea from "../../../../components/tasks";
import { Button } from "@mui/material";  // Updated import for Button
import "./globals.css";
import PostRequirementAIButton from "@/components/circlebuttonAI";

const ProjectPage = () => {
  const { id: projectId, stage } = useParams();
  const router = useRouter();
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
    try {
      const response = await fetch(`http://localhost:8080/Project/${projectId}`);
      if (!response.ok) {
        throw new Error(`Error fetching project data: ${response.statusText}`);
      }
      const data = await response.json();
      setProjectName(data.project_name);
      setProjectCompany(data.company_name);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(error.message);
    }
  };

  const fetchProjectData = async () => {
    if (!projectId || !stage) return;

    const endpoints = {
      requirements: `http://localhost:8080/Project/${projectId}/Requirements`,
      planning: `http://localhost:8080/project/${projectId}/planning`,
      estimation: `http://localhost:8080/project/${projectId}/getEstimation`,
      tasks: `http://localhost:8080/Project/${projectId}/Tasks`,
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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Cookies.get("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (newItem) => {
    setData((prevData) => [...prevData, newItem]);
    handleCloseModal();
  };

  const handleNextStage = () => {
    if (stage === "requirements") {
      router.push(`/Projects/${projectId}/Tasks`);
    }
  };

  useEffect(() => {
    fetchProjectData();
    getProjectData();
  }, [projectId, stage]);

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (stage === "tasks") {
      return (
        <div className="tasks-container">
          {Array.isArray(data) &&
            data.map((task, index) => (
              <TarjetaTarea
                key={index}
                tarea={{
                  id: task.id || `TASK-${index + 1}`,
                  titulo: task.title || task.nombre,
                  descripcion: task.description || task.descripcion,
                  area: task.area || task.equipo,
                  tiempo: task.estimated_time || task.tiempo_estimado,
                  costo: task.cost || task.costo,
                }}
              />
            ))}
        </div>
      );
    } else {
      return (
        <div className="requirements-container">
          {Array.isArray(data) && data !== null && data.length > 0 && data.map((requirement) => (
            <RequirementCard key={requirement.requirement_id} requirement={requirement} />
          ))}
        </div>

      );
    }
  };

  return (
    <div className="project-container">
      <ExpandableNavbar
        onNewProject={handleOpenModal}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isSidebarExpanded ? "expanded" : ""}`}>
        <div className="header">
          <h2 style={{ textAlign: "left" }}>Project: {projectName}</h2>
          <p className="subheader" style={{ textAlign: "left" }}>
            Company: {projectCompany}
          </p>
        </div>

        <div className="actions-container">
          <Button className="add-item-button" onClick={handleOpenModal}>
            {stage === "tasks" ? "Add Task" : "Add Requirement"}
          </Button>
          {stage === "requirements" && (
            <Button className="next-stage-button" onClick={handleNextStage}>
              Proceed to Tasks
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

      <NewRequirementModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onAddItem={handleAddItem}
        projectId={parseInt(projectId,10)}
        ownerId={parseInt(Cookies.get("userID"),10)}
        isTask={stage === "tasks"}
      />
      <div></div>
      <PostRequirementAIButton projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
