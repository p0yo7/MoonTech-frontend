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

const ProjectPage = () => {
  const { id: projectId, stage } = useParams();
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectCompany, setProjectCompany] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [planningData, setPlanningData] = useState([]);
  const [contract, setContract] = useState("");
  const [tasks, setTasks] = useState([]);
  const [estimationData, setEstimationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const stages = ['requirements', 'planning', 'estimation'];

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
      setProjectName(data.projectInfo.project_name);
      setProjectCompany(data.projectInfo.company_name);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(error.message);
    }
  };

  const getProjectData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/Project/${projectId}`, {
        headers: {
          'Authorization': `${Cookies.get("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjectName(data.projectInfo.project_name);
      setProjectCompany(data.projectInfo.company_name);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(error.message);
    }
  };

  const fetchStageData = async () => {
    if (!projectId || !stage) return;

    const endpoints = {
      requirements: `http://localhost:8080/Project/${projectId}/Requirements`,
      planning: `http://localhost:8080/project/${projectId}/planning`,
      estimation: `http://localhost:8080/project/${projectId}/getEstimation`,
      tasks: `http://localhost:8080/project/${projectId}/tasks`,
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
      console.error(`Error fetching ${stage} data:`, error);
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
      router.push(`/projects/${projectId}/tasks`);
    }
  };

  useEffect(() => {
    getProjectData();
    fetchStageData();
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
          {data.map((requirement) => (
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
    </div>
  );
};

export default ProjectPage;

