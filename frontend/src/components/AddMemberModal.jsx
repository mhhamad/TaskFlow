import { useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function AddMemberModal({
  show,
  projectId,
  onClose,
  onMemberAdded,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddMember = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/members`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      if (response.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      if (response.status === 403) {
        setError("Only the project admin can add members.");
        return;
      }

      if (response.status === 404) {
        setError("Project not found or user could not be found.");
        return;
      }

      if (response.status === 409) {
        setError("This user is already a member of the project.");
        return;
      }

      if (response.status === 400) {
        setError("Please enter a valid email.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add the member.");
      }

      const addedMember = await response.json();

      onMemberAdded(addedMember);

      setEmail("");
      setError("");

      onClose();
    } catch (err) {
      setError(
        err.message || "Something went wrong while adding the member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setEmail("");
    setError("");
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
      />

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">

            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Add New Member
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleAddMember}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label
                    htmlFor="memberEmail"
                    className="form-label fw-semibold"
                  >
                    Member Email
                  </label>

                  <input
                    id="memberEmail"
                    type="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    disabled={loading}
                    autoFocus
                  />

                  <div className="form-text">
                    Enter the email address of an existing TaskFlow user.
                  </div>
                </div>
              </div>

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
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
export default AddMemberModal

