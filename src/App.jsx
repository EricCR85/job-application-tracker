import { useState, useEffect } from "react";
import StatsDashboard from "./components/StatsDashboard";
import JobForm from "./components/JobForm";
import FilterControls from "./components/FilterControls";
import JobCard from "./components/JobCard";

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
          dateApplied: "Jul 14, 2026",
          salary: "$90,000 - $110,000",
          jobUrl: "https://example.com/job-posting",
          notes: "Spoke with recruiter on LinkedIn. Follow-up next week!",
          tasks: [
            { id: 101, text: "Tailor resume", completed: true },
            { id: 102, text: "Submit application portfolio", completed: false },
          ],
        },
      ];
    }

    try {
      const parsed = JSON.parse(savedJobs);
      return parsed.map((job) => ({
        ...job,
        tasks: job.tasks || [],
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        notes: job.notes || "",
      }));
    } catch (e) {
      console.error("Failed to parse jobs from localStorage:", e);
      return [
        {
          id: 1,
          company: "Example Corp",
          role: "Frontend Developer",
          status: "Applied",
          dateApplied: "Jul 14, 2026",
          notes: "",
        },
      ];
    }
  });

  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    salary: "",
    jobUrl: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    salary: "",
    jobUrl: "",
    notes: "",
  });

  const [taskInputs, setTaskInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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
      salary: formData.salary,
      jobUrl: formData.jobUrl,
      notes: formData.notes,
      dateApplied: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      tasks: [],
    };

    setJobs([...jobs, newJob]);

    setFormData({
      company: "",
      role: "",
      status: "Applied",
      salary: "",
      jobUrl: "",
      notes: "",
    });
  };

  const handleDeleteJob = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application? This action cannot be undone.",
    );
    if (confirmDelete) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const handleEditClick = (job) => {
    setEditingId(job.id);

    setEditFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      salary: job.salary || "",
      jobUrl: job.jobUrl || "",
      notes: job.notes || "",
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
            salary: editFormData.salary,
            jobUrl: editFormData.jobUrl,
            notes: editFormData.notes,
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
      }),
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
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task,
            ),
          };
        }
        return job;
      }),
    );
  };

  const handleDeleteTask = (jobId, taskId) => {
    const confirmDelete = window.confirm("Remove this task?");
    if (confirmDelete) {
      setJobs(
        jobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              tasks: job.tasks.filter((task) => task.id !== taskId),
            };
          }
          return job;
        }),
      );
    }
  };

  const filteredJobs = jobs
    .filter((job) => filter === "all" || job.status === filter)
    .filter((job) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        job.company.toLowerCase().includes(query) ||
        job.role.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.dateApplied) - new Date(a.dateApplied) || b.id - a.id;
      }
      if (sortBy === "oldest") {
        return new Date(a.dateApplied) - new Date(b.dateApplied) || a.id - b.id;
      }
      if (sortBy === "progress") {
        const getProgress = (job) => {
          if (!job.tasks || job.tasks.length === 0) return 0;
          const completed = job.tasks.filter((t) => t.completed).length;
          return Math.round((completed / job.tasks.length) * 100);
        };
        return getProgress(b) - getProgress(a);
      }
      return 0;
    });

  return (
    <div className="app-container">
      <header>
        <h1>Job Application Tracker</h1>
      </header>
      <StatsDashboard jobs={jobs} />

      <main>
        <JobForm
          formData={formData}
          setFormData={setFormData}
          handleAddJob={handleAddJob}
        />

        <section className="job-list-section">
          <h2>My Applications</h2>
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <ul className="job-list">
            {filteredJobs.length === 0 ? (
              <li className="no-jobs-message-container">
                <div className="empty-state-icon">🔍</div>
                <h3>No Applications Found</h3>
                <p>
                  Try adjusting your search queries or adding a new application
                  card up above!
                </p>
              </li>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  editingId={editingId}
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                  handleSaveEdit={handleSaveEdit}
                  handleCancelEdit={handleCancelEdit}
                  handleDeleteJob={handleDeleteJob}
                  taskInputs={taskInputs}
                  setTaskInputs={setTaskInputs}
                  handleToggleTask={handleToggleTask}
                  handleDeleteTask={handleDeleteTask}
                  handleAddTask={handleAddTask}
                  handleEditClick={handleEditClick}
                />
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
