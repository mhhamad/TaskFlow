import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();

      console.log("User created:", data);

    } catch (error) {
      setError(error.message);
      console.error(error);
    }
    navigate("/signin");
  };

  return (
    <div className="bg-light min-vh-100">

      {/* Header */}
      <div className="text-center pt-5">

        <h2 className="fw-bold">
          <img src="/image.png" alt="Logo" className="mb-3" style={{ width: "60px", height: "50px", paddingRight: "10px" }} />
          TaskFlow</h2>
        <p className="text-muted">Create your account</p>
      </div>

      {/* Signup Card */}
      <div className="container d-flex justify-content-center">
        <div className="card shadow-sm p-4 mt-3" style={{ width: "400px" }}>

          <h3 className="text-center mb-4">Sign Up</h3>

          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label d-block text-start">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-block text-start">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-block text-start">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              type="submit"
            >
              Sign Up
            </button>
          </form>



          <p className="text-center text-muted mt-3 mb-0">
            Already have an account? <Link to="/signin"> Sign In </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Signup;

