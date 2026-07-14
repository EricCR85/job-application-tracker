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

  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied"
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
                <li key={job.id}>
                  <strong>{job.company}</strong> - {job.role} ({job.status})
                  <button onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
