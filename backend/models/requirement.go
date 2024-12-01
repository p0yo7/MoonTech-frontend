package models

import (
	"database/sql"
	"errors"
	"time"
)

type Requirement struct {
	ID          string    `json:"id"`
	ProjectID   string    `json:"projectId"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func GetRequirementsByProject(db *sql.DB, projectID string) ([]Requirement, error) {
	query := `SELECT id, project_id, description, status, created_at, updated_at 
	          FROM requirements WHERE project_id = ?`
	rows, err := db.Query(query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requirements []Requirement
	for rows.Next() {
		var req Requirement
		err := rows.Scan(&req.ID, &req.ProjectID, &req.Description, 
		                 &req.Status, &req.CreatedAt, &req.UpdatedAt)
		if err != nil {
			return nil, err
		}
		requirements = append(requirements, req)
	}
	return requirements, nil
}

func (r *Requirement) Create(db *sql.DB) error {
	if r.Description == "" {
		return errors.New("requirement description is required")
	}

	query := `INSERT INTO requirements (project_id, description, created_by) 
	          VALUES (?, ?, ?) RETURNING id, created_at, updated_at`
	return db.QueryRow(query, r.ProjectID, r.Description, r.CreatedBy).
	       Scan(&r.ID, &r.CreatedAt, &r.UpdatedAt)
}

func (r *Requirement) Update(db *sql.DB) error {
	query := `UPDATE requirements SET description = ?, status = ? 
	          WHERE id = ? RETURNING updated_at`
	return db.QueryRow(query, r.Description, r.Status, r.ID).Scan(&r.UpdatedAt)
}

func DeleteRequirement(db *sql.DB, id string) error {
	query := `DELETE FROM requirements WHERE id = ?`
	result, err := db.Exec(query, id)
	if err != nil {
		return err
	}
	
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("requirement not found")
	}
	return nil
}