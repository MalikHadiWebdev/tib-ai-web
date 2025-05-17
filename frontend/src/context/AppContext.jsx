import React, { createContext, useContext, useReducer, useEffect } from "react";

// Define initial state
const initialState = {
  patientData: [],
  currentPatient: null,
  loading: false,
  diagnosis: null,
  adminStats: {
    totalPatients: 0,
    totalDiseasesDetected: 0,
    accuracy: "0%",
    diseases: [],
    histogramData: {
      labels: [],
      datasets: [],
    },
  },
};

// Define reducer
function appReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PATIENT_DATA":
      return {
        ...state,
        currentPatient: action.payload,
        patientData: [...state.patientData, action.payload],
      };
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload, loading: false };
    case "SET_ADMIN_STATS":
      return { ...state, adminStats: action.payload };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Create provider component
export function AppProvider({ children }) {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  // Fetch admin stats on initial load
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stats");
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_ADMIN_STATS", payload: data });
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  return useContext(AppContext);
}
