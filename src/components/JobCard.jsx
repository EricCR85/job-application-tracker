import TaskChecklist from "./TaskChecklist";

const JobCard = ({
  job,
  editingId,
  editFormData,
  setEditFormData,
  handleSaveEdit,
  handleCancelEdit,
  handleEditClick,
  handleDeleteJob,
  taskInputs,
  setTaskInputs,
  handleToggleTask,
  handleDeleteTask,
  handleAddTask,
}) => {
  const hasTasks = job.tasks && job.tasks.length > 0;

  return (
    <li className="job-card">
      {editingId === job.id ? (
        <form
          onSubmit={(e) => handleSaveEdit(e, job.id)}
          className="edit-form-inline"
        >
          <input
            type="text"
            value={editFormData.company}
            onChange={(e) =>
              setEditFormData({ ...editFormData, company: e.target.value })
            }
            required
          />
          <input
            type="text"
            value={editFormData.role}
            onChange={(e) =>
              setEditFormData({ ...editFormData, role: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Salary"
            value={editFormData.salary}
            onChange={(e) =>
              setEditFormData({ ...editFormData, salary: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Job Link url"
            value={editFormData.jobUrl}
            onChange={(e) =>
              setEditFormData({ ...editFormData, jobUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Notes/Follow-up plans..."
            value={editFormData.notes}
            onChange={(e) =>
              setEditFormData({ ...editFormData, notes: e.target.value })
            }
          />
          <select
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="card-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="job-info">
            <div>
              <strong>{job.company}</strong> - {job.role}
              <span className={`status-tag status-${job.status.toLowerCase()}`}>
                {job.status}
              </span>
            </div>

            {job.salary && (
              <span
                style={{
                  fontSize: "0.85em",
                  color: "#2e7d32",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {job.salary}
              </span>
            )}

            <span
              style={{
                fontSize: "0.85em",
                color: "#666",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              Applied on: {job.dateApplied}
            </span>

            {job.jobUrl && (
              <div className="job-url-link" style={{ marginTop: "5px" }}>
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.85em", color: "#0066cc" }}
                >
                  View Job Posting
                </a>
              </div>
            )}

            {job.notes && (
              <div className="job-notes-container">
                <span className="notes-heading">Notes: </span>
                {job.notes}
              </div>
            )}
          </div>

          <TaskChecklist
            job={job}
            hasTasks={hasTasks}
            taskInputs={taskInputs}
            setTaskInputs={setTaskInputs}
            handleToggleTask={handleToggleTask}
            handleDeleteTask={handleDeleteTask}
            handleAddTask={handleAddTask}
          />

          <div className="card-actions">
            <button onClick={() => handleEditClick(job)} className="edit-btn">
              Edit
            </button>
            <button
              onClick={() => handleDeleteJob(job.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default JobCard;
