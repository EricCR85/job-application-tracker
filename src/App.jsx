import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (!savedJobs || savedJobs === "undefined") {
      return [
        {
          id: 1,
          company: "Example Corp",
          role: "Frontend Developer",
          status: "Applied",
          dateApplied: "jul 14, 2026",
          tasks: [
            { id: 101, text: "Tailor resume", completed: true },
            {id: 102, text: "Submit application porfolio", completed: false },
          ]
        },
      ];
    }

    try {
      const parsed = JSON.parse(savedJobs);
      return parsed.map((job) => ({
        ...job,
        tasks: job.tasks || [],
      }));
    } catch (e) {
      console.error("Falied to parse jobs from localStorage:", e);
      return [
        {
          id: 1,
          company: "Example Corp",
          role: "Frontend Developer",
          status: "Applied",
          dateApplied: "Jul 14, 2026",
        },
      ];
    }
  });
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
  });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
  });

  const [taskInputs, setTaskInputs] = useState({});

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const handleAddJob = (e) => {
    e.preventDefault();

    if (!formData.company || !formData.role) return;

    const newJob = {
      id: Date.now(),
      company: formData.company,
      role: formData.role,
      status: formData.status,
      dateApplied: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      tasks: [],
    };

    setJobs([...jobs, newJob]);
    setFormData({ company: "", role: "", status: "Applied" });
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleEditClick = (job) => {
    setEditingId(job.id);
    setEditFormData({
      company: job.company,
      role: job.role,
      status: job.status,
    });
  };

  const handleSaveEdit = (e, id) => {
    e.preventDefault();
    if (!editFormData.company || !editFormData.role) return;

    setJobs(
      jobs.map((job) => {
        if (job.id === id) {
          return {
            ...job,
            company: editFormData.company,
            role: editFormData.role,
            status: editFormData.status,
          };
        }
        return job;
      }),
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddTask = (jobId) => {
    const taskText = taskInputs[jobId]?.trim();
    if (!taskText) return;

    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            tasks: [
              ...(job.tasks || []),
              { id: Date.now(), text: taskText, completed: false },
            ],
          };
        }
        return job;
      })
    );
    setTaskInputs({ ...taskInputs, [jobId]: "" });
  };

  const handleToggleTask = (jobId, taskId) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            tasks: job.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          };
        }
        return job;
      })
    );
  };

  const handleDeleteTask = (jobId, taskId) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job, 
            tasks: job.tasks.filter((task) => task.id !== taskId),
          }
        }
        return job;
      })
    )
  }

  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((j) => j.status === "Applied").length;
  const interviewingCount = jobs.filter(
    (j) => j.status === "Interviewing",
  ).length;
  const offersCount = jobs.filter((j) => j.status === "Offer").length;

  const filteredJobs = jobs.filter(
    (job) => filter === "all" || job.status === filter,
  );
  return (
    <div className="app-container">
      <header>
        <h1>Job Application Tracker</h1>
      </header>

      <section className="stats-dashboard">
        <div className="stat-card">
          <span className="stat-value">{totalJobs}</span>
          <span className="stat-label">Total Apps</span>
        </div>
        <div className="stat-card status-applied">
          <span className="stat-value">{appliedCount}</span>
          <span className="stat-label">Applied</span>
        </div>
        <div className="stat-card status-interviewing">
          <span className="stat-value">{interviewingCount}</span>
          <span className="stat-label">Interviews</span>
        </div>
        <div className="stat-card status-offer">
          <span className="stat-value">{offersCount}</span>
          <span className="stat-label">Offers</span>
        </div>
      </section>

      <main>
        <section className="add-job-section">
          <form onSubmit={handleAddJob}>
            <input
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <input
              placeholder="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button type="submit">Add Job</button>
          </form>
        </section>

        <section className="job-list">
          <h2>My Applications</h2>
          <div className="filter-container">
            <label>Filter by status: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <ul className="job-list">
            {filteredJobs.length === 0 ? (
              <li className="no-jobs-message">
                No jobs found under this status.
              </li>
            ) : (
              filteredJobs.map((job) => {
                const hasTasks = job.tasks && job.tasks.length > 0;
                const completedTasks = hasTasks
                  ? job.tasks.filter((t) => t.completed).length
                  : 0;
                const taskPercentage = hasTasks
                  ? Math.round((completedTasks / job.tasks.length) * 100)
                  : 0;

                return (
                  <li key={job.id} className="job-card">
                    {editingId === job.id ? (
                    <form
                      onSubmit={(e) => handleSaveEdit(e, job.id)}
                      className="edit-form-inline"
                    >
                      <input
                        type="text"
                        value={editFormData.company}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            company: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        value={editFormData.role}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            role: e.target.value,
                          })
                        }
                        required
                      />
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
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
                          <span
                            className={`status-tag status-${job.status.toLowerCase()}`}
                          >
                            {job.status}
                          </span>
                          {job.dateApplied && (
                            <span
                              style={{
                                fontSize: "0.85em",
                                color: "#666",
                                marginLeft: "10px",
                              }}
                            >
                              Applied on {job.dateApplied}
                            </span>
                          )}
                        </div>
                        <div className="card-actions">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="job-tasks-section">
                        <div className="tasks-header">
                          <h4>Tasks Checklist</h4>
                          {hasTasks && (
                            <span className="tasks-progress">
                              {completedTasks}/{job.tasks.length} ({taskPercentage}%)
                            </span>
                          )}
                        </div>
                        {hasTasks && (
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar"
                              style={{ width: `${taskPercentage}%` }}
                            ></div>
                          </div>
                        )}
                        <ul className="task-sublist">
                          {(job.tasks || []).map((task) => (
                            <li key={task.id} className="task-item">
                              <label className="task-label">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleToggleTask(job.id, task.id)}
                                />
                                <span
                                  className={
                                    task.completed
                                      ? "task-text completed"
                                      : "task-text"
                                  }
                                >
                                  {task.text}
                                </span>
                              </label>
                              <button
                                type="button"
                                className="delete-task-btn"
                                onClick={() => handleDeleteTask(job.id, task.id)}
                              >
                                X
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="add-task-form">
                          <input
                            type="text"
                            placeholder="Add a step (e.g., Follow up...)"
                            value={taskInputs[job.id] || ""}
                            onChange={(e) =>
                              setTaskInputs({
                                ...taskInputs,
                                [job.id]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTask(job.id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTask(job.id)}
                          >
                            Add Task
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  </li>
              );
            })
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
