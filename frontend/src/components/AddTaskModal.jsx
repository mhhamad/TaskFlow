import { useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function AddTaskModal({
  show,
  projectId,
  onClose,
  onTaskCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTask = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/tasks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTitle,
            description: trimmedDescription || null,
            dueDate: dueDate || null,
          }),
        }
      );

      if (response.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      if (response.status === 403) {
        setError("Only the project admin can create tasks.");
        return;
      }

      if (response.status === 400) {
        setError("Please enter a valid task title.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create the task.");
      }

      const createdTask = await response.json();

      
      onTaskCreated({
        ...createdTask,
        dueDate: createdTask.dueDate ?? dueDate ?? null,
      });

      // Clear the form
      setTitle("");
      setDescription("");
      setDueDate("");
      setError("");

      // Close the popup
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setTitle("");
    setDescription("");
    setDueDate("");
    setError("");

    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Add New Task
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask}>
              <div className="modal-body">

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div className="mb-3">
                  <label
                    htmlFor="taskTitle"
                    className="form-label fw-semibold"
                  >
                    Task Title
                  </label>

                  <input
                    id="taskTitle"
                    type="text"
                    className="form-control"
                    placeholder="Enter task title"
                    maxLength={35}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    autoFocus
                    disabled={loading}
                  />

                  <div className="form-text">
                    Maximum 35 characters.
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label
                    htmlFor="taskDescription"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>

                  <textarea
                    id="taskDescription"
                    className="form-control"
                    rows="4"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    disabled={loading}
                  />
                </div>

                {/* Due Date */}
                <div className="mb-2">
                  <label
                    htmlFor="taskDueDate"
                    className="form-label fw-semibold"
                  >
                    Due Date
                  </label>

                  <input
                    id="taskDueDate"
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTaskModal;
