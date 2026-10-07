import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom"; 

function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:8080/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Invalid email or password ");
      }

      const data = await response.json();

      console.log("Signed in:", data);

      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);

      navigate("/HomePage");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-light min-vh-100">

      {/* Header */}
      <div className="text-center pt-5">
        <h2 className="fw-bold">
          <img
            src="/image.png"
            alt="Logo"
            className="mb-3"
            style={{
              width: "60px",
              height: "50px",
              paddingRight: "10px"
            }}
          />
          TaskFlow
        </h2>

        <p className="text-muted">Welcome back</p>
      </div>

      {/* Signin Card */}
      <div className="container d-flex justify-content-center">
        <div
          className="card shadow-sm p-4 mt-3"
          style={{ width: "400px" }}
        >

          <h3 className="text-center mb-4">Sign In</h3>

          <form onSubmit={handleSignin}>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label d-block text-start">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label d-block text-start">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
              />
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              className="btn btn-primary w-100"
              type="submit"
            >
              Sign In
            </button>

          </form>

          <p className="text-center text-muted mt-3 mb-0">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Signin;