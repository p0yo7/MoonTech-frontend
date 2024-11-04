"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpandableNavbar from '../../../../components/navbar';
import RequirementCard from '../../../../components/requirements';
import NewRequirementModal from '../../../../components/newrequirement';
import Cookies from "js-cookie";
import "./globals.css";

const ProjectPage = ({ params }) => {
  const { id: projectId, stage } = params;
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

  const handleNextStage = () => {
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      router.push(`/projects/${projectId}/${nextStage}`);
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
      planning: `http://localhost:8080/Project/${projectId}/planning`,
      estimation: `http://localhost:8080/Project/${projectId}/getEstimation`
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
      
      switch(stage) {
        case 'requirements':
          setRequirements(result.data || []);
          break;
        case 'planning':
          setPlanningData(result.data || []);
          break;
        case 'estimation':
          setEstimationData(result.data || []);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${stage} data:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = (newRequirement) => {
    setRequirements((prevRequirements) => [...prevRequirements, {
      requirement_id: newRequirement.id,
      requirement_text: newRequirement.description,
      requirement_approved: false,
      requirement_timestamp: new Date().toISOString()
    }]);
    handleCloseModal();
  };

  const renderStageContent = () => {
    switch(stage) {
      case 'requirements':
        return (
          <>
            <div style={{ 
              padding: '0 20px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleOpenModal}
                  style={{
                    backgroundColor: '#0366d6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Add Requirement
                </button>
                <button 
                  onClick={handleNextStage}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  Next: Planning Phase
                  <span style={{ fontSize: '20px' }}>→</span>
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '8px 16px', 
                borderRadius: '4px',
                color: '#666'
              }}>
                Requirements Phase
              </div>
            </div>

            <div className="scroll-container" style={{ padding: '0 20px' }}>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {requirements.map((requirement) => (
                  <RequirementCard
                    key={requirement.requirement_id}
                    requirement={requirement}
                  />
                ))}
              </div>
            </div>
          </>
        );

      case 'planning':
        return (
          <>
            <div style={{ 
              padding: '0 20px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleNextStage}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  Next: Estimation Phase
                  <span style={{ fontSize: '20px' }}>→</span>
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '8px 16px', 
                borderRadius: '4px',
                color: '#666'
              }}>
                Planning Phase
              </div>
            </div>

            <div className="scroll-container" style={{ padding: '0 20px' }}>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {planningData.map((item) => (
                  <div key={item.id} className="planning-card">
                    {/* Contenido del planning */}
                    {item.description} {/* Por ejemplo */}
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'estimation':
        return (
          <>
            <div style={{ 
              padding: '0 20px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '8px 16px', 
                borderRadius: '4px',
                color: '#666'
              }}>
                Estimation Phase
              </div>
            </div>

            <div className="scroll-container" style={{ padding: '0 20px' }}>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {estimationData.map((item) => (
                  <div key={item.id} className="estimation-card">
                    {/* Contenido de la estimación */}
                    {item.estimated_value} {/* Por ejemplo */}
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return <div>Invalid stage</div>;
    }
  };

  useEffect(() => {
    getProjectData();
    fetchStageData();
  }, [projectId, stage]);

  return (
    <div className="project-container">
      <ExpandableNavbar
        onNewProject={handleOpenModal}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isSidebarExpanded ? "expanded" : ""}`}>
        <div className="header" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            Project: {projectName}
          </h2>
          <h3 style={{ fontSize: '20px', color: '#666' }}>
            Company: {projectCompany}
          </h3>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          renderStageContent()
        )}
      </div>

      {isModalOpen && (
        <NewRequirementModal
          onClose={handleCloseModal}
          onAddRequirement={handleAddRequirement}
        />
      )}
    </div>
  );
};

export default ProjectPage;

