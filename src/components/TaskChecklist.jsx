import React from "react";

const TaskChecklist = ({
  job,
  hasTasks,
  taskInputs,
  setTaskInputs,
  handleToggleTask,
  handleDeleteTask,
  handleAddTask,
}) => {
  const completedTasks = hasTasks
    ? job.tasks.filter((t) => t.completed).length
    : 0;
  const taskPercentage = hasTasks
    ? Math.round((completedTasks / job.tasks.length) * 100)
    : 0;

  return (
    <>
      <div className="job-tasks-section">
        <div className="tasks-header">
          <h4>Tasks Checklist</h4>
          {hasTasks && (
            <span className="tasks-progress">
              {completedTasks}/{job.tasks.length} Completed ({taskPercentage}%)
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
                    task.completed ? "task-text completed" : "task-text"
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
                ×
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
          <button type="button" onClick={() => handleAddTask(job.id)}>
            Add Task
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskChecklist;
