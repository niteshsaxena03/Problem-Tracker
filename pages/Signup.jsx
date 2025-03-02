import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../backend/firebase-context";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signUpUserWithEmailAndPassword } = useFirebase();
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a192f 0%, #000000 100%)",
      padding: "clamp(16px, 5vw, 40px)",
      boxSizing: "border-box",
    },
    formContainer: {
      width: "100%",
      maxWidth: "min(90%, 450px)",
      padding: "clamp(20px, 5vw, 40px)",
      background: "linear-gradient(45deg, #112240, #1a365d)",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    heading: {
      color: "#64ffda",
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      marginBottom: "clamp(20px, 4vw, 30px)",
      textAlign: "center",
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontWeight: "700",
      letterSpacing: "2px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "clamp(15px, 3vw, 20px)",
      width: "100%",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
    },
    label: {
      color: "#64ffda",
      fontSize: "clamp(14px, 2vw, 16px)",
      marginLeft: "4px",
    },
    input: {
      width: "100%",
      padding: "clamp(10px, 2vw, 15px)",
      background: "#0a192f",
      border: "2px solid rgba(100, 255, 218, 0.3)",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "clamp(14px, 2vw, 16px)",
      transition: "all 0.3s ease",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "clamp(12px, 2.5vw, 18px)",
      marginTop: "clamp(10px, 2vw, 20px)",
      background: "linear-gradient(45deg, #0a192f, #112240)",
      color: "#64ffda",
      border: "2px solid rgba(100, 255, 218, 0.3)",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "clamp(14px, 2.5vw, 16px)",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
    },
    error: {
      color: "#ff6b6b",
      textAlign: "center",
      padding: "10px",
      background: "rgba(255, 107, 107, 0.1)",
      borderRadius: "8px",
      fontSize: "clamp(12px, 2vw, 14px)",
      border: "1px solid rgba(255, 107, 107, 0.3)",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUpUserWithEmailAndPassword(
        formData.email,
        formData.password,
        formData.name
      );
      navigate("/problems");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Sign Up</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#64ffda";
                e.target.style.boxShadow = "0 0 15px rgba(100, 255, 218, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#64ffda";
                e.target.style.boxShadow = "0 0 15px rgba(100, 255, 218, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#64ffda";
                e.target.style.boxShadow = "0 0 15px rgba(100, 255, 218, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(100, 255, 218, 0.2)";
              e.target.style.borderColor = "#64ffda";
              e.target.style.background =
                "linear-gradient(45deg, #112240, #1a365d)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
              e.target.style.background =
                "linear-gradient(45deg, #0a192f, #112240)";
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};
