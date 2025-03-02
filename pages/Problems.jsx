import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../backend/firebase-context";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";

export const Problems = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [newProblem, setNewProblem] = useState({ name: "", link: "" });
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomProblem, setRandomProblem] = useState(null);
  const [revisionDays, setRevisionDays] = useState(20);
  const { user, isLoggedIn, logOut } = useFirebase();
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        if (user && user.email) {
          const userRef = doc(db, "users", user.email);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setProblems(userData.unsolvedQuestions || []);

            // Set revision days from user settings if available
            if (userData.revisionDays) {
              setRevisionDays(userData.revisionDays);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoggedIn, navigate, db]);

  const handleAddProblem = async (e) => {
    e.preventDefault();

    if (!newProblem.name || !newProblem.link) return;

    const problemWithTimestamp = {
      ...newProblem,
      timestamp: Date.now(),
    };

    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        unsolvedQuestions: arrayUnion(problemWithTimestamp),
      });

      setProblems([...problems, problemWithTimestamp]);
      setNewProblem({ name: "", link: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  };

  const handleDeleteProblem = async () => {
    if (!problemToDelete) return;

    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        unsolvedQuestions: arrayRemove(problemToDelete),
      });

      setProblems(
        problems.filter(
          (p) =>
            p.name !== problemToDelete.name || p.link !== problemToDelete.link
        )
      );
      setShowDeleteModal(false);
      setProblemToDelete(null);
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const updateRevisionDays = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        revisionDays: revisionDays,
      });
      setShowSettingsModal(false);
    } catch (error) {
      console.error("Error updating revision days:", error);
    }
  };

  const getRandomProblemForRevision = () => {
    const currentTime = Date.now();
    const eligibleProblems = problems.filter((problem) => {
      if (!problem.timestamp) return false;

      const daysSinceAdded = Math.floor(
        (currentTime - problem.timestamp) / (1000 * 60 * 60 * 24)
      );

      return daysSinceAdded >= revisionDays;
    });

    if (eligibleProblems.length === 0) {
      setRandomProblem(null);
      setShowRevisionModal(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleProblems.length);
    setRandomProblem(eligibleProblems[randomIndex]);
    setShowRevisionModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #0a192f 0%, #000000 100%)",
      padding: "clamp(16px, 5vw, 40px)",
      boxSizing: "border-box",
      color: "#e6f1ff",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "15px",
      marginTop: "40px",
    },
    heading: {
      color: "#64ffda",
      fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontWeight: "700",
      letterSpacing: "1px",
      margin: 0,
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    addButton: {
      padding: "10px 15px",
      background: "transparent",
      color: "#64ffda",
      border: "2px solid #64ffda",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
    },
    reviseButton: {
      padding: "10px 15px",
      background: "transparent",
      color: "#a8b2d1",
      border: "2px solid #a8b2d1",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
    },
    settingsButton: {
      padding: "10px 15px",
      background: "transparent",
      color: "#8892b0",
      border: "2px solid #8892b0",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
    },
    problemsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
      gap: "16px",
      width: "100%",
    },
    problemCard: {
      background: "linear-gradient(45deg, #112240, #1a365d)",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      border: "1px solid rgba(100, 255, 218, 0.1)",
      position: "relative",
    },
    problemName: {
      color: "#64ffda",
      fontSize: "clamp(1rem, 4vw, 1.2rem)",
      marginBottom: "8px",
      fontWeight: "600",
      paddingRight: "30px",
    },
    problemLink: {
      color: "#a8b2d1",
      textDecoration: "none",
      fontSize: "clamp(0.8rem, 3.5vw, 0.95rem)",
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      transition: "color 0.3s ease",
      wordBreak: "break-all",
    },
    problemMeta: {
      color: "#8892b0",
      fontSize: "clamp(0.7rem, 3vw, 0.85rem)",
      marginTop: "10px",
      display: "flex",
      justifyContent: "space-between",
    },
    deleteButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "transparent",
      border: "none",
      color: "#a8b2d1",
      fontSize: "18px",
      cursor: "pointer",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "all 0.2s ease",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "0 16px",
    },
    modalContent: {
      background: "linear-gradient(45deg, #112240, #1a365d)",
      padding: "20px",
      borderRadius: "15px",
      width: "100%",
      maxWidth: "450px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(100, 255, 218, 0.2)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    modalTitle: {
      color: "#64ffda",
      fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
      margin: 0,
    },
    closeButton: {
      background: "transparent",
      border: "none",
      color: "#a8b2d1",
      fontSize: "24px",
      cursor: "pointer",
      transition: "color 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "30px",
      height: "30px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      color: "#64ffda",
      fontSize: "14px",
    },
    input: {
      padding: "12px",
      background: "#0a192f",
      border: "2px solid rgba(100, 255, 218, 0.3)",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "15px",
      width: "100%",
      boxSizing: "border-box",
    },
    submitButton: {
      padding: "12px",
      background: "#64ffda",
      color: "#0a192f",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      marginTop: "8px",
    },
    deleteModalContent: {
      textAlign: "center",
      padding: "10px",
    },
    deleteModalText: {
      color: "#e6f1ff",
      fontSize: "16px",
      marginBottom: "20px",
    },
    deleteModalButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
    cancelButton: {
      padding: "10px 20px",
      background: "transparent",
      color: "#a8b2d1",
      border: "1px solid #a8b2d1",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    confirmButton: {
      padding: "10px 20px",
      background: "#ff6b6b",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    revisionModalContent: {
      textAlign: "center",
      padding: "20px 10px",
    },
    revisionProblemName: {
      color: "#64ffda",
      fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
      marginBottom: "15px",
    },
    revisionButton: {
      padding: "12px 25px",
      background: "#64ffda",
      color: "#0a192f",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      marginTop: "20px",
    },
    noRevisionText: {
      color: "#e6f1ff",
      fontSize: "16px",
      marginBottom: "20px",
    },
    emptyState: {
      textAlign: "center",
      padding: "30px 20px",
      color: "#a8b2d1",
      fontSize: "16px",
    },
    loadingState: {
      textAlign: "center",
      padding: "30px 20px",
      color: "#64ffda",
      fontSize: "16px",
    },
    settingsInfo: {
      color: "#8892b0",
      fontSize: "14px",
      marginBottom: "20px",
    },
    logoutButton: {
      position: "absolute",
      top: "clamp(16px, 5vw, 25px)",
      right: "clamp(16px, 5vw, 25px)",
      padding: "10px 16px",
      background: "rgba(10, 25, 47, 0.7)",
      color: "#a8b2d1",
      border: "1px solid #a8b2d1",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "clamp(12px, 3vw, 14px)",
      fontWeight: "500",
      transition: "all 0.3s ease",
      zIndex: 10,
      backdropFilter: "blur(5px)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "80px",
      textAlign: "center",
    },
    logoutModalContent: {
      textAlign: "center",
      padding: "10px",
    },
    logoutModalText: {
      color: "#e6f1ff",
      fontSize: "16px",
      marginBottom: "20px",
    },
    logoutModalButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.logoutButton}
        onClick={handleLogout}
        onMouseOver={(e) => {
          e.target.style.background = "rgba(168, 178, 209, 0.15)";
          e.target.style.color = "#e6f1ff";
          e.target.style.borderColor = "#64ffda";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "rgba(10, 25, 47, 0.7)";
          e.target.style.color = "#a8b2d1";
          e.target.style.borderColor = "#a8b2d1";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        }}
      >
        Logout
      </button>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Problem List</h1>
        <div style={styles.buttonContainer}>
          <button
            style={styles.reviseButton}
            onClick={getRandomProblemForRevision}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(168, 178, 209, 0.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Get Revision Problem
          </button>
          <button
            style={styles.addButton}
            onClick={() => setShowModal(true)}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(100, 255, 218, 0.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            + Add Problem
          </button>
          <button
            style={styles.settingsButton}
            onClick={() => setShowSettingsModal(true)}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(136, 146, 176, 0.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Revision Settings
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingState}>Loading your problems...</div>
      ) : problems.length === 0 ? (
        <div style={styles.emptyState}>
          You haven't added any problems yet. Click the "Add Problem" button to
          get started.
        </div>
      ) : (
        <div style={styles.problemsGrid}>
          {problems.map((problem, index) => (
            <div key={index} style={styles.problemCard}>
              <div style={styles.problemName}>{problem.name}</div>
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.problemLink}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                {problem.link}
              </a>
              <div style={styles.problemMeta}>
                <span>Revision: {revisionDays} days</span>
                <span>
                  {problem.timestamp
                    ? new Date(problem.timestamp).toLocaleDateString()
                    : "No date"}
                </span>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => {
                  setProblemToDelete(problem);
                  setShowDeleteModal(true);
                }}
                onMouseOver={(e) => {
                  e.target.style.color = "#ff6b6b";
                  e.target.style.background = "rgba(255, 107, 107, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                  e.target.style.background = "transparent";
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Problem</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowModal(false)}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                ×
              </button>
            </div>
            <form style={styles.form} onSubmit={handleAddProblem}>
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="problemName">
                  Problem Name
                </label>
                <input
                  id="problemName"
                  type="text"
                  style={styles.input}
                  value={newProblem.name}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, name: e.target.value })
                  }
                  placeholder="Enter problem name"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#64ffda";
                    e.target.style.boxShadow =
                      "0 0 10px rgba(100, 255, 218, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="problemLink">
                  Problem Link
                </label>
                <input
                  id="problemLink"
                  type="url"
                  style={styles.input}
                  value={newProblem.link}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, link: e.target.value })
                  }
                  placeholder="https://example.com/problem"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#64ffda";
                    e.target.style.boxShadow =
                      "0 0 10px rgba(100, 255, 218, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                style={styles.submitButton}
                onMouseOver={(e) => {
                  e.target.style.background = "#4fd1c5";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(100, 255, 218, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#64ffda";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Add Problem
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowDeleteModal(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Confirm Delete</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowDeleteModal(false)}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                ×
              </button>
            </div>
            <div style={styles.deleteModalContent}>
              <p style={styles.deleteModalText}>
                Are you sure you want to delete "{problemToDelete?.name}"?
              </p>
              <div style={styles.deleteModalButtons}>
                <button
                  style={styles.cancelButton}
                  onClick={() => setShowDeleteModal(false)}
                  onMouseOver={(e) => {
                    e.target.style.background = "rgba(168, 178, 209, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  style={styles.confirmButton}
                  onClick={handleDeleteProblem}
                  onMouseOver={(e) => {
                    e.target.style.background = "#e05252";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#ff6b6b";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowSettingsModal(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Revision Settings</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowSettingsModal(false)}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                ×
              </button>
            </div>
            <form style={styles.form} onSubmit={updateRevisionDays}>
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="revisionDaysSetting">
                  Days Until Revision
                </label>
                <input
                  id="revisionDaysSetting"
                  type="number"
                  min="0"
                  max="365"
                  style={styles.input}
                  value={revisionDays}
                  onChange={(e) =>
                    setRevisionDays(parseInt(e.target.value) || 0)
                  }
                  placeholder="Days until revision (default: 20)"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#64ffda";
                    e.target.style.boxShadow =
                      "0 0 10px rgba(100, 255, 218, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(100, 255, 218, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <p style={styles.settingsInfo}>
                Problems will be eligible for revision {revisionDays} days after
                they were added.
              </p>
              <button
                type="submit"
                style={styles.submitButton}
                onMouseOver={(e) => {
                  e.target.style.background = "#4fd1c5";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(100, 255, 218, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#64ffda";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {showRevisionModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowRevisionModal(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Time to Revise!</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowRevisionModal(false)}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                ×
              </button>
            </div>
            <div style={styles.revisionModalContent}>
              {randomProblem ? (
                <>
                  <div style={styles.revisionProblemName}>
                    {randomProblem.name}
                  </div>
                  <p style={styles.deleteModalText}>
                    This problem was added on{" "}
                    {new Date(randomProblem.timestamp).toLocaleDateString()} and
                    is due for revision.
                  </p>
                  <a
                    href={randomProblem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.revisionButton,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#4fd1c5";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 5px 15px rgba(100, 255, 218, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#64ffda";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Open Problem
                  </a>
                </>
              ) : (
                <p style={styles.noRevisionText}>
                  No problems are due for revision yet. Check back later!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowLogoutModal(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Confirm Logout</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowLogoutModal(false)}
                onMouseOver={(e) => {
                  e.target.style.color = "#64ffda";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#a8b2d1";
                }}
              >
                ×
              </button>
            </div>
            <div style={styles.logoutModalContent}>
              <p style={styles.logoutModalText}>
                Are you sure you want to logout?
              </p>
              <div style={styles.logoutModalButtons}>
                <button
                  style={styles.cancelButton}
                  onClick={() => setShowLogoutModal(false)}
                  onMouseOver={(e) => {
                    e.target.style.background = "rgba(168, 178, 209, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  style={styles.confirmButton}
                  onClick={confirmLogout}
                  onMouseOver={(e) => {
                    e.target.style.background = "#e05252";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#ff6b6b";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
