package main

import (
	"time"
)

// BusinessTypes representa la tabla de tipos de negocio
type BusinessTypes struct {
	BusinessTypeID int    `gorm:"column:business_type_id;primaryKey;autoIncrement"`
	BusinessName   string `gorm:"column:name;size:100"`
	BusinessColor  string `gorm:"column:color;size:20"`
}

func (BusinessTypes) TableName() string {
	return "businessTypes"
}

// Representatives representa la tabla de representantes
type Representatives struct {
	RepresentativeID          int    `gorm:"column:representative_id;primaryKey;autoIncrement"`
	representative_first_name string `gorm:"column:firstname;size:50"`
	representative_last_name  string `gorm:"column:lastname;size:50"`
	representative_work_email string `gorm:"column:work_email;size:100"`
	representative_work_phone string `gorm:"column:work_phone;size:20"`
}

func (Representatives) TableName() string {
	return "representatives"
}

type Teams struct {
	TeamID   int    `gorm:"column:team_id;primaryKey;autoIncrement"`
	TeamName string `gorm:"column:team_name;size:100"`
}

func (Teams) TableName() string {
	return "teams"
}

// Areas representa la tabla de áreas
type Areas struct {
	AreaID           int    `gorm:"column:area_id;primaryKey;autoIncrement"`
	area_name        string `gorm:"column:name;size:100"`
	area_description string `gorm:"column:description;type:text"`
}

func (Areas) TableName() string {
	return "areas"
}

// Companies representa la tabla de compañías
type Companies struct {
	CompanyID        int             `gorm:"column:company_id;primaryKey;autoIncrement"`
	CompanyName      string          `gorm:"column:name;size:100"`
	RepresentativeID int             `gorm:"column:representativeId"`
	BusinessTypeID   int             `gorm:"column:businessType"`
	Country 		string          `gorm:"column:country;size:100"`
	CompanySize	  int             `gorm:"column:company_size"`
	CompanyDescription string `gorm:"company_description"`
	representative   Representatives `gorm:"foreignKey:RepresentativeID;references:RepresentativeID"`
	business_type    BusinessTypes   `gorm:"foreignKey:BusinessTypeID;references:BusinessTypeID"`
}

func (Companies) TableName() string {
	return "companies"
}

// Users representa la tabla de usuarios
type Users struct {
	ID        int    `gorm:"column:id;primaryKey;autoIncrement"`
	Username  string `gorm:"column:username;size:50;not null"`
	FirstName string `gorm:"column:first_name;size:50"`
	LastName  string `gorm:"column:lastname;size:50"`
	WorkEmail string `gorm:"column:work_email;size:100;unique"`
	WorkPhone string `gorm:"column:work_phone;size:20"`
	Password  string `gorm:"column:password;size:255;not null"`
	TeamID    int    `gorm:"column:team"` // Asegúrate de que sea el ID correcto
	LeaderID  *int   `gorm:"column:leaderId"`
	Position  string `gorm:"column:position;size:100"`
	Role      string `gorm:"column:role;size:50"`
	Team      Teams  `gorm:"foreignKey:TeamID;references:id"`   // Usa 'id' en lugar de 'ID'
	Leader    *Users `gorm:"foreignKey:LeaderID;references:id"` // Usa 'id' en lugar de 'ID'
}

func (Users) TableName() string {
	return "users"
}

// Frameworks represent las tecnologias que se pueden usar en el proyecto
type Frameworks struct {
	ID            int    `gorm:"column:id;primaryKey;autoIncrement"`
	FrameworkName string `gorm:"column:name;size:40"`
	Language      string `gorm:"column:language;size:40"`
	Licence       string `gorm:"column:licence;size:40"`
	Compatibility string `gorm:"column:compatibility;size:40"`
}

// Projects representa la tabla de proyectos
type Projects struct {
	ID          int       `gorm:"column:id;primaryKey;autoIncrement"`
	ProjectName string    `gorm:"column:projName;size:100"`
	OwnerID     int       `gorm:"column:owner"`
	CompanyID   int       `gorm:"column:company"`
	AreaID      int       `gorm:"column:area"`
	ProjectDescription string    `gorm:"column:projectDescription;type:text"`
	Budget      int       `gorm:"column:budget"`
	start_date  time.Time `gorm:"column:startDate;type:date"`
	Owner       Users     `gorm:"foreignKey:OwnerID;references:ID"`
	Company     Companies `gorm:"foreignKey:CompanyID;references:CompanyID"`
	Area        Areas     `gorm:"foreignKey:AreaID;references:AreaID"`
}

func (Projects) TableName() string {
	return "projects"
}

// Leaders representa la tabla de líderes
type Leaders struct {
	ID      int      `gorm:"column:id;primaryKey;autoIncrement"`
	ProjID  int      `gorm:"column:proj_id"`
	UserID  int      `gorm:"column:user_id"`
	Project Projects `gorm:"foreignKey:ProjID;references:ID"`
	User    Users    `gorm:"foreignKey:UserID;references:ID"`
}

func (Leaders) TableName() string {
	return "leaders"
}

// Requirements representa la tabla de requerimientos
type Requirements struct {
	ID                     int       `gorm:"column:id;primaryKey;autoIncrement"`
	ProjectID              int       `gorm:"column:projectId"`
	OwnerID                int       `gorm:"column:owner"`
	RequirementDescription string    `gorm:"column:requirement_description;type:text"`
	timestamp              time.Time `gorm:"column:timestamp;type:datetime;default:CURRENT_TIMESTAMP"`
	approved               bool      `gorm:"column:approved"`
	ApproverID             int       `gorm:"column:approverId"`
	Project                Projects  `gorm:"foreignKey:ProjectID;references:ID"`
	Owner                  Users     `gorm:"foreignKey:OwnerID;references:ID"`
	Approver               Users     `gorm:"foreignKey:ApproverID;references:ID"`
}

func (Requirements) TableName() string {
	return "requirements"
}

// Comments representa la tabla de comentarios
type Comments struct {
	ID        int          `gorm:"column:id;primaryKey;autoIncrement"`
	OwnerID   int          `gorm:"column:owner_id"`
	ParentID  *int         `gorm:"column:parent_id"` // Puede ser nulo
	Text      string       `gorm:"column:text;type:text"`
	Timestamp time.Time    `gorm:"column:timestamp;type:datetime;default:CURRENT_TIMESTAMP"`
	Owner     Users        `gorm:"foreignKey:OwnerID;references:ID"`
	Parent    Requirements `gorm:"foreignKey:ParentID;references:ID"`
}

func (Comments) TableName() string {
	return "comments"
}

// CREATE TABLE tasks (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     requirement INT, -- referencia al requerimiento del que se creo
//     team INT, -- referencia al equipo que se involucra
//     createdBy INT, -- referencia al usuario que lo creo
//     name VARCHAR(100), -- nombre de la task
//     description VARCHAR(255),
//     language INT, -- referencia al lenguaje que se utiliza
//     framework INT, -- referencia al framework que se utiliza
//     estimated_time INT, -- tiempo que dura el desarrollo (horas)
//     estimated_cost INT, -- costo en dolares del desarrollo
//     ajuste DECIMAL, -- ajuste
//     FOREIGN KEY (requirement) REFERENCES requirements(id),
//     FOREIGN KEY (team) REFERENCES teams(id),
//     FOREIGN KEY (createdBy) REFERENCES users(id),
//     FOREIGN KEY (framework) REFERENCES frameworks(name),
//     FOREIGN KEY (language) REFERENCES frameworks(language)
// );

type Tasks struct {
	ID            int        `gorm:"column:id;primaryKey;autoIncrement"`
	RequirementID int        `gorm:"column:requirement"`
	Team        int        `gorm:"column:team"`
	CreatedBy   int        `gorm:"column:createdBy"`
	Name          string     `gorm:"column:name;size:40"`
	Description   string     `gorm:"column:description"`
	Language      int        `gorm:"column:language"`
	// Framework  int        `gorm:"column:framework"`
	EstimatedTime int        `gorm:"column:estimated_time"`
	EstimateCost  int        `gorm:"column:estimated_cost"`
	Ajuste        float64    `gorm:"column:ajuste;type:decimal(10,2)"`
	CreatedTime   time.Time  `gorm:"column:createdTime;type:timestamp;default:CURRENT_TIMESTAMP"` // Default a CURRENT_TIMESTAMP
	Requirements          Requirements      `gorm:"foreignKey:RequirementID;references:ID"`
	// Teams          Teams      `gorm:"foreignKey:TeamID;references:ID"`
	// CreatedBy     Users      `gorm:"foreignKey:CreatedByID;references:ID"`
	// Frameworks     Frameworks `gorm:"foreignKey:FrameworkID;references:ID"`
}

// Tasks representa la tabla de tareas
// type Tasks struct {
// 	ID            int       `gorm:"column:id;primaryKey;autoIncrement"`
// 	AreaID        int       `gorm:"column:area_id"`
// 	Title         string    `gorm:"column:title;size:100"`
// 	CreatedBy     int       `gorm:"column:created_by"`
// 	Description   string    `gorm:"column:description;type:text"`
// 	Timestamp     time.Time `gorm:"column:timestamp;type:datetime;default:CURRENT_TIMESTAMP"`
// 	EstimatedTime int       `gorm:"column:estimated_time"`
// 	Approved      bool      `gorm:"column:approved"`
// 	ApproverID    int       `gorm:"column:approver_id"`
// 	Area          Areas     `gorm:"foreignKey:AreaID;references:AreaID"`
// 	Creator       Users     `gorm:"foreignKey:CreatedBy;references:ID"`
// 	Approver      Users     `gorm:"foreignKey:ApproverID;references:ID"`
// }

func (Tasks) TableName() string {
	return "tasks"
}

type Notifications struct {
	ID          int       `gorm:"column:id;primaryKey;autoIncrement"`
	Status      int       `gorm:"column:status;"`
	CreatedTime time.Time `gorm:"column:created_time"`
	ProjectID   int       `gorm:"column:project"`
	Project     Projects  `gorm:"foreignKey:ProjectID;refereces:ID"`
}

func (Notifications) TableName() string {
	return "notifications"
}

type ProjectUser struct {
    ID        int      `gorm:"primaryKey"`
    ProjectID int      `gorm:"column:project_id"`
    UserID    int      `gorm:"column:user_id"`
}

func (ProjectUser) TableName() string {
    return "project_users"
}
