import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");
    return savedJobs
      ? JSON.parse(savedJobs)
      : [
          {
            id: 1,
            company: `Example Corp`,
            role: `Frontend Developer`,
            status: `Applied`,
          },
        ];
  });
  const [filter, setFilter] = useState("all")
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
  })

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
      jobs.map((job) =>
        job.id === id
          ? {
              ...job,
              company: editFormData.company,
              role: editFormData.role,
              status: editFormData.status,
            }
          : job,
      ),
    );
    setEditingId(null);
  };
  return (
    <div className="app-container">
      <header>
        <h1>Job Application Tracker</h1>
      </header>
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
          <label>Filter by status: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ul>
            {jobs
              .filter((job) => filter === "all" || job.status === filter)
              .map((job) => (
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
                    <div>
                        <strong>{job.company}</strong> - {job.role} ({job.status}
                        )
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleEditClick(job)}
                          className="edit-btn"
                          >
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
                  {/* <strong>{job.company}</strong> - {job.role} ({job.status})
                  <button onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </button> */}
                </li>
              ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
