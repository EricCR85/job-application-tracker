import React from "react";

const StatsDashboard = ({ jobs }) => {
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((j) => j.status === "Applied").length;
  const interviewingCount = jobs.filter(
    (j) => j.status === "Interviewing",
  ).length;
  const offersCount = jobs.filter((j) => j.status === "Offer").length;
  const rejectedCount = jobs.filter((j) => j.status === "Rejected").length;

  return (
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

      <div className="stat-card status-rejected">
        <span className="stat-value">{rejectedCount}</span>
        <span className="stat-label">Rejected</span>
      </div>
    </section>
  );
};

export default StatsDashboard;
