import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddTaskModal from "../components/AddTaskModal";
import ProjectMembersModal from "../components/ProjectMembersModal";

const API_BASE_URL = "http://localhost:8080";

function TaskPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [username, setUsername] = useState("User");

    const [loading, setLoading] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [error, setError] = useState("");

    const [showAddTask, setShowAddTask] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    useEffect(() => {
        const storedUsername =
            localStorage.getItem("username") ||
            localStorage.getItem("userName") ||
            sessionStorage.getItem("username") ||
            "User";

        setUsername(storedUsername);

        fetchProject();
        fetchTasks();
    }, [projectId]);

    const fetchProject = async () => {
        setLoadingProject(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/projects/${projectId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 401) {
                navigate("/signin");
                return;
            }

            if (response.status === 404) {
                throw new Error("Project not found.");
            }

            if (!response.ok) {
                throw new Error("Failed to load project.");
            }

            const data = await response.json();
            setProject(data);
        } catch (err) {
            setError(err.message || "Failed to load project.");
        } finally {
            setLoadingProject(false);
        }
    };

    const fetchTasks = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/projects/${projectId}/tasks`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 401) {
                navigate("/signin");
                return;
            }

            if (response.status === 404) {
                throw new Error("You are not a member of this project.");
            }

            if (!response.ok) {
                throw new Error("Failed to load tasks.");
            }

            const data = await response.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Something went wrong while loading tasks.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No due date";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "OPEN":
                return "bg-primary-subtle text-primary";

            case "IN_PROGRESS":
                return "bg-warning-subtle text-warning-emphasis";

            case "DONE":
            case "COMPLETED":
                return "bg-success-subtle text-success";

            case "CANCELLED":
                return "bg-danger-subtle text-danger";

            default:
                return "bg-secondary-subtle text-secondary";
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom shadow-sm">
                <div className="container py-2">
                    {/* TaskFlow logo */}
                    <button
                        type="button"
                        className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent p-0"
                        onClick={() => navigate("/homepage")}
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
                            className="btn btn-light border d-flex align-items-center gap-2"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span
                                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                                style={{ width: "36px", height: "36px" }}
                            >
                                {username.charAt(0).toUpperCase()}
                            </span>

                            <span className="fw-semibold">{username}</span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            <li>
                                <button
                                    className="dropdown-item"
                                    type="button"
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
                                    className="dropdown-item text-danger"
                                    type="button"
                                    onClick={() => navigate("/signin")}
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
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0 mb-2"
                            onClick={() => navigate("/homepage")}
                        >
                            ← Back to Projects
                        </button>

                        {loadingProject ? (
                            <h1 className="fw-bold mb-1">Loading project...</h1>
                        ) : (
                            <>
                                <h1 className="fw-bold mb-1">
                                    {project?.title || "Project"}
                                </h1>

                                <p className="text-secondary mb-0">
                                    Manage and view the tasks in this project.
                                </p>
                            </>
                        )}
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary px-4"
                            onClick={() => setShowMembers(true)}
                        >
                            👥 View Members
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary px-4"
                            onClick={() => {
                                setShowAddTask(true);
                                setError("");
                            }}
                        >
                            + Add New Task
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="alert alert-danger d-flex justify-content-between align-items-center"
                        role="alert"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setError("")}
                        />
                    </div>
                )}

                {/* Tasks */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>

                        <p className="text-secondary mt-3 mb-0">
                            Loading tasks...
                        </p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <div className="display-6 mb-3">✓</div>

                            <h4 className="fw-semibold">No tasks yet</h4>

                            <p className="text-secondary mb-0">
                                This project does not have any tasks yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {tasks.map((task) => (
                            <div className="col-12 col-md-6 col-xl-4" key={task.id}>
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        {/* Top row */}
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <span
                                                className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status || "UNKNOWN"}
                                            </span>

                                            <span className="text-secondary small">
                                                #{task.id}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h5 className="fw-bold text-dark mb-2">
                                            {task.title}
                                        </h5>

                                        {/* Description */}
                                        <p className="text-secondary mb-4">
                                            {task.description || "No description provided."}
                                        </p>

                                        {/* Bottom details */}
                                        <div className="border-top pt-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-secondary small">
                                                    Due date
                                                </span>

                                                <span
                                                    className={`small fw-semibold ${task.dueDate
                                                        ? "text-dark"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    {formatDate(task.dueDate)}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="text-secondary small">
                                                    Created
                                                </span>

                                                <span className="small text-dark">
                                                    {formatDate(task.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <AddTaskModal
                show={showAddTask}
                projectId={projectId}
                onClose={() => setShowAddTask(false)}
                onTaskCreated={(createdTask) => {
                    setTasks((currentTasks) => [
                        createdTask,
                        ...currentTasks,
                    ]);
                }}
            />
            <ProjectMembersModal
                show={showMembers}
                projectId={projectId}
                onClose={() => setShowMembers(false)}
            />
        </div>
    );
}
export default TaskPage