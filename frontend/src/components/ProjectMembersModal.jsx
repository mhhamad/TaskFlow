import { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";

const API_BASE_URL = "http://localhost:8080";

function ProjectMembersModal({
    show,
    projectId,
    onClose,
}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showAddMember, setShowAddMember] = useState(false);

    useEffect(() => {
        if (!show) {
            return;
        }

        fetchMembers();
    }, [show, projectId]);

    const fetchMembers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/projects/${projectId}/members`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 401) {
                setError("Your session has expired. Please sign in again.");
                return;
            }

            if (response.status === 404) {
                setError("You are not a member of this project.");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load project members.");
            }

            const data = await response.json();

            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.message || "Something went wrong while loading members."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

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
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow">

                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">
                                Project Members
                            </h5>

                            <div className="d-flex align-items-center gap-2 ms-auto">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setShowAddMember(true)}
                                >
                                    + Add Member
                                </button>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleClose}
                                    disabled={loading}
                                    aria-label="Close"
                                />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="modal-body">

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>

                                    <p className="text-secondary mt-3 mb-0">
                                        Loading members...
                                    </p>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="text-center py-4">
                                    <div className="display-6 mb-3">👥</div>

                                    <h5 className="fw-semibold">
                                        No members found
                                    </h5>

                                    <p className="text-secondary mb-0">
                                        This project currently has no members.
                                    </p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {members.map((member, index) => {
                                        const name =
                                            member.userName ||
                                            member.username ||
                                            "Unknown User";

                                        const email = member.email || "No email";

                                        return (
                                            <div
                                                key={`${member.email}-${index}`}
                                                className="list-group-item px-0 py-3 border-bottom"
                                            >
                                                <div className="d-flex align-items-center gap-3">

                                                    {/* Avatar */}
                                                    <div
                                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{
                                                            width: "45px",
                                                            height: "45px",
                                                        }}
                                                    >
                                                        <span className="fw-bold">
                                                            {name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {/* User information */}
                                                    <div>
                                                        <h6 className="fw-semibold mb-1">
                                                            {name}
                                                        </h6>

                                                        <div className="text-secondary small">
                                                            {email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <span className="text-secondary me-auto">
                                {members.length}{" "}
                                {members.length === 1 ? "member" : "members"}
                            </span>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <AddMemberModal show={showAddMember} projectId={projectId} onClose={() => setShowAddMember(false)}
                onMemberAdded={(addedMember) => {
                    setMembers((currentMembers) =>
                        [...currentMembers, addedMember,]);
                }} />
        </>
    );
}

export default ProjectMembersModal