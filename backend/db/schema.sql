DROP DATABASE IF EXISTS MoonTech;
CREATE DATABASE MoonTech;
USE MoonTech;

CREATE TABLE frameworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40),
    language VARCHAR(40),
    licence VARCHAR(40),
    compatibility VARCHAR(40)
);


CREATE TABLE teams ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name varchar(100)
);

-- Tabla de tipos de negocio
CREATE TABLE businessTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    color VARCHAR(20)
);

-- Tabla de representantes
CREATE TABLE representatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    work_email VARCHAR(100),
    work_phone VARCHAR(20)
);

-- Tabla de áreas
CREATE TABLE areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);
-- descripcion


-- Tabla de compañías
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    representativeId INT, -- Hace referencia a la tabla de Representantes
    businessType INT, -- Hace referencia a la tabla businessType
    country VARCHAR(50),
    company_size INT,
    company_description VARCHAR(1000),
    FOREIGN KEY (representativeId) REFERENCES representatives(id),
    FOREIGN KEY (businessType) REFERENCES businessTypes(id)
);

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    lastname VARCHAR(50),
    work_email VARCHAR(100) UNIQUE,
    work_phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    team INT,
    leaderId INT,
    position VARCHAR(100),
    role VARCHAR(50),
    FOREIGN KEY (team) REFERENCES teams(id),
    FOREIGN KEY (leaderId) REFERENCES users(id) -- Referencia a sí mismo
);

-- Tabla de proyectos
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projName VARCHAR(100),
    owner INT, -- Hace referencia al userId
    company INT, -- Hace referencia a la tabla de Companies
    area INT, -- Hace referencia a la tabla de Areas
    startDate DATE,
    projectDescription VARCHAR(1000),
    budget INT, -- budget en dolares
    status INT, -- active 1 inactive 0
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (company) REFERENCES companies(id),
    FOREIGN KEY (area) REFERENCES areas(id)
);

-- Tabla de líderes
CREATE TABLE leaders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projId INT, -- Hace referencia a Project
    userId INT, -- Hace referencia a User
    FOREIGN KEY (projId) REFERENCES projects(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Update requirements table to match project needs
DROP TABLE IF EXISTS requirements;
CREATE TABLE requirements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_requirements_project_id ON requirements(project_id);

-- Tabla de comentarios
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner INT, -- Hace referencia a User
    parent INT, -- Puede ser un requerimiento o una tarea
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (parent) REFERENCES requirements(id)
);

-- id, requerimiento, createdBy, nombre, descripcion, area (equipo), lenguajes, frameworks, tiempo, costo, ajuste, 
-- Integrar la parte de ajuste (feedback), descripcion, lenguajes, frameworks 
-- Tabla de tareas
-- CREATE TABLE tasks (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     requirement INT, 
--     area INT, -- Hace referencia a Area
--     name VARCHAR(100),
--     createdBy INT, -- Hace referencia a User
--     description TEXT,
--     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
--     estimatedTime INT,
--     FOREIGN KEY (area) REFERENCES areas(id),
--     FOREIGN KEY (createdBy) REFERENCES users(id)
-- );

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requirement INT, -- referencia al requerimiento del que se creo
    team INT, -- referencia al equipo que se involucra
    createdBy INT, -- referencia al usuario que lo creo 
    name VARCHAR(100), -- nombre de la task
    description VARCHAR(255),
    language VARCHAR(40), -- referencia al lenguaje que se utiliza
    -- framework INT NULL, -- referencia al framework que se utiliza
    estimated_time INT, -- tiempo que dura el desarrollo (horas)
    estimated_cost INT, -- costo en dolares del desarrollo
    ajuste DECIMAL(10,2), -- ajuste
    createdTime datetime,
    FOREIGN KEY (requirement) REFERENCES requirements(id),
    FOREIGN KEY (team) REFERENCES teams(id),
    FOREIGN KEY (createdBy) REFERENCES users(id)
    -- FOREIGN KEY (framework) REFERENCES frameworks(id)
);

-- notifications () 
-- id, status, titulo, texto, createdat,
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status INT default 1, -- active, inactive
    created_time TIMESTAMP,
    project INT,
    FOREIGN KEY (project) REFERENCES projects(id)
);

CREATE TABLE project_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- get Areas
-- get Teams 
-- get 
CREATE VIEW getAreas AS 
    select id, name from areas a;

CREATE VIEW getTeams AS 
    select id, team_name from teams t;





-- DELIMITER $$
-- CREATE PROCEDURE GetProjectInfo(
--     IN projId int
-- )
-- BEGIN
--     select projName, company from project p
--     where p.id = projId;

-- END$$
-- DELIMITER ;




-- Obtener la informacion de un proyecto cuando se le da click por id
-- Se necesitan: requerimientos, tareas, comments
DELIMITER $$
CREATE PROCEDURE GetProjectRequirements(
    IN projectId INT
)
BEGIN 
    SELECT 
        r.id AS requirement_id,
        r.requirement_description AS requirement_description,
        r.approved AS requirement_approved,
        r.timestamp AS requirement_timestamp
    FROM 
        requirements r
    WHERE 
        r.projectId = projectId;
END$$
DELIMITER ;



-- get Tasks
DELIMITER $$
CREATE PROCEDURE GetProjectTasks(
    IN project_Id INT
)
BEGIN 
    SELECT 
        t.id AS task_id,
        t.name AS task_title,
        t.description AS task_description,
        t.estimated_time AS task_estimated_time
    FROM 
        tasks t
    WHERE 
        t.requirement IN (SELECT id FROM requirements WHERE projectId = project_Id);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE GetProjectInfo(
    IN project_id INT
)
BEGIN 
    SELECT 
        p.id as project_id,
        p.projName as project_name,
        p.projectDescription as project_description,
        p.budget as project_budget,
        c.name as company_name,
        c.company_description,
        c.company_size 
    FROM projects p
    INNER JOIN companies c ON p.company = c.id
    WHERE p.id = project_id;
END$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetActiveProjectsForUser(
    IN user_id INT
)
BEGIN
    SELECT 
        p.id AS project_id,
        p.projName AS project_name,
        p.projectDescription AS project_description,
        p.budget AS project_budget,
        c.name AS company_name,
        c.companyDescription AS company_description,
        c.companySize AS company_size
    FROM projects p
    INNER JOIN companies c ON p.company = c.id
    INNER JOIN user_projects up ON up.project_id = p.id
    WHERE up.user_id = user_id
      AND p.status = 'active'; -- Suponiendo que hay un campo `status` para identificar proyectos activos
END$$

DELIMITER ;


-- get ActiveProjectsForUser
-- calculate Progress based on stage and requirements
-- get ProjectInfo