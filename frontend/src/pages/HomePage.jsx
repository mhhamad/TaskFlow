import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_BASE_URL = "http://localhost:8080";

function HomePage() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [username, setUsername] = useState("User");
    const [loading, setLoading] = useState(true);
    const [showAddProject, setShowAddProject] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const savedUsername =
            localStorage.getItem("username") ||
            localStorage.getItem("userName") ||
            "User";

        setUsername(savedUsername);
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: "GET",
                credentials: "include", // sends JSESSIONID cookie
            });

            if (response.status === 401) {
                navigate("/signin");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load projects.");
            }

            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Something went wrong while loading projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (event) => {
        event.preventDefault();

        const title = newProjectTitle.trim();

        if (!title) {
            setError("Project title cannot be empty.");
            return;
        }

        setCreatingProject(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: "POST",
                credentials: "include", // sends JSESSIONID cookie
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (response.status === 401) {
                navigate("/signin");
                return;
            }

            if (response.status === 400) {
                throw new Error("Please enter a valid project title.");
            }

            if (!response.ok) {
                throw new Error("Failed to create the project.");
            }

            const createdProject = await response.json();

            setProjects((currentProjects) => [
                createdProject,
                ...currentProjects,
            ]);

            setNewProjectTitle("");
            setShowAddProject(false);
        } catch (err) {
            setError(err.message || "Something went wrong while creating the project.");
        } finally {
            setCreatingProject(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        navigate("/signin");
    };

    const openProject = (projectId) => {
        navigate(`/projects/${projectId}/tasks`);
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Top navigation */}
            <nav className="navbar bg-white border-bottom shadow-sm">
                <div className="container py-2 d-flex justify-content-between align-items-center">
                    {/* TaskFlow logo + name */}
                    <button
                        type="button"
                        className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent p-0"
                        aria-label="Go to TaskFlow home"
                    >
                        <img
                            src="/image.png"
                            alt="TaskFlow logo"
                            width="44"
                            height="44"
                            className="rounded-3"
                        />
                        <span className="fw-bold fs-4 text-dark">TaskFlow</span>
                    </button>

                    {/* User dropdown */}
                    <div className="dropdown">
                        <button
                            type="button"
                            className="btn btn-light border d-flex align-items-center gap-2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span
                                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                                style={{ width: "36px", height: "36px" }}
                            >
                                {username.charAt(0).toUpperCase()}
                            </span>
                            <span className="fw-semibold">{username}</span>
                            <span className="ms-1">⌄</span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            <li>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => navigate("/profile")}
                                >
                                    Profile
                                </button>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="dropdown-item text-danger"
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">Your Projects</h1>
                        <p className="text-secondary mb-0">
                            Choose a project to view and manage its tasks.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={() => {
                            setError("");
                            setShowAddProject(true);
                        }}
                    >
                        + Add New Project
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center justify-content-between">
                        <span>{error}</span>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setError("")}
                        />
                    </div>
                )}

                {/* Projects */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-secondary mt-3">Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <div className="fs-1 mb-3">📁</div>
                            <h4 className="fw-bold">No projects yet</h4>
                            <p className="text-secondary mb-4">
                                Create a project to start managing your tasks.
                            </p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setShowAddProject(true)}
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {projects.map((project) => {
                            
                            const projectId = project.id ?? project.Id;

                            return (
                                <div className="col-12 col-md-6 col-lg-4" key={projectId}>
                                    <button
                                        type="button"
                                        className="card border-0 shadow-sm w-100 h-100 text-start p-0 overflow-hidden"
                                        onClick={() => openProject(projectId)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div
                                                    className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: "48px", height: "48px" }}
                                                >
                                                    {(project.title || "P").charAt(0).toUpperCase()}
                                                </div>

                                                <span className="text-secondary fs-4">→</span>
                                            </div>

                                            <h5 className="fw-bold text-dark mb-2">
                                                {project.title}
                                            </h5>

                                            <p className="small text-secondary mb-0">
                                                {project.adminEmail
                                                    ? `Admin: ${project.adminEmail}`
                                                    : "Project"}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Add project modal */}
            {showAddProject && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">Create New Project</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowAddProject(false)}
                                        disabled={creatingProject}
                                    />
                                </div>

                                <form onSubmit={handleCreateProject}>
                                    <div className="modal-body">
                                        <label htmlFor="projectTitle" className="form-label fw-semibold">
                                            Project Title
                                        </label>
                                        <input
                                            id="projectTitle"
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter project title"
                                            value={newProjectTitle}
                                            onChange={(event) => setNewProjectTitle(event.target.value)}
                                            maxLength={35}
                                            autoFocus
                                        />
                                        <div className="form-text">Maximum 35 characters.</div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowAddProject(false)}
                                            disabled={creatingProject}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={creatingProject}
                                        >
                                            {creatingProject ? "Creating..." : "Create Project"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        onClick={() => {
                            if (!creatingProject) {
                                setShowAddProject(false);
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default HomePage