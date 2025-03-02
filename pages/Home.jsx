export const Home = () => {
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #0a192f 0%, #000000 100%)",
      padding: "20px",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    heading: {
      color: "#64ffda",
      fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
      marginBottom: "40px",
      textAlign: "center",
      textShadow:
        "0 0 10px rgba(100, 255, 218, 0.3), 0 0 20px rgba(100, 255, 218, 0.2)",
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontWeight: "700",
      letterSpacing: "2px",
      textTransform: "uppercase",
      animation: "glow 2s ease-in-out infinite alternate",
      padding: "0 10px",
    },
    buttonContainer: {
      display: "flex",
      gap: "clamp(15px, 4vw, 30px)",
      flexDirection: "row",
      "@media (max-width: 480px)": {
        flexDirection: "column",
      },
    },
    button: {
      padding: "clamp(12px, 3vw, 15px) clamp(25px, 5vw, 40px)",
      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
      border: "1px solid rgba(100, 255, 218, 0.3)",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      width: "clamp(140px, 30vw, 200px)",
    },
    loginButton: {
      background: "linear-gradient(45deg, #0a192f, #112240)",
      color: "#64ffda",
      boxShadow: "0 4px 15px rgba(10, 25, 47, 0.5)",
    },
    signupButton: {
      background: "linear-gradient(45deg, #112240, #1a365d)",
      color: "#64ffda",
      boxShadow: "0 4px 15px rgba(26, 54, 93, 0.5)",
    },
    footer: {
      width: "100%",
      textAlign: "center",
      padding: "20px 10px",
      color: "#64ffda",
      fontSize: "clamp(0.8rem, 2vw, 1rem)",
      background: "linear-gradient(180deg, transparent, rgba(10, 25, 47, 0.5))",
      marginTop: "40px",
    },
    footerText: {
      marginBottom: "8px",
      letterSpacing: "1px",
    },
    copyright: {
      color: "#8892b0",
      fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>CP Problem Tracker</h1>
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.loginButton }}
            onClick={() => (window.location.href = "/login")}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 8px 25px rgba(100, 255, 218, 0.2)";
              e.target.style.border = "1px solid #64ffda";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(10, 25, 47, 0.5)";
              e.target.style.border = "1px solid rgba(100, 255, 218, 0.3)";
            }}
          >
            Login
          </button>
          <button
            style={{ ...styles.button, ...styles.signupButton }}
            onClick={() => (window.location.href = "/signup")}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 8px 25px rgba(100, 255, 218, 0.2)";
              e.target.style.border = "1px solid #64ffda";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(26, 54, 93, 0.5)";
              e.target.style.border = "1px solid rgba(100, 255, 218, 0.3)";
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
      <footer style={styles.footer}>
        <div style={styles.footerText}>
          Made with ❤️ and 💻 by Nitesh Saxena
        </div>
        <div style={styles.copyright}>© 2025 All Rights Reserved</div>
      </footer>
    </div>
  );
};
