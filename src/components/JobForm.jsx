
const JobForm = ({ formData, setFormData, handleAddJob }) => {
  return (
    <section className="add-job-section">
      <form onSubmit={handleAddJob}>
        <input
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Salary (e.g. $100k or $100,000)"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        />

        <input
          type="url"
          placeholder="Job Link URL (https://...)"
          value={formData.jobUrl}
          onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
        />

        <input
          type="text"
          placeholder="Notes/Follow-up notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button type="submit">Add Job</button>
      </form>
    </section>
  );
};

export default JobForm;
