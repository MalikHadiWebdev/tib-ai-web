# TIB-AI

**TIB-AI** is an AI-powered medical triage system that intelligently assesses patient symptoms, prioritizes cases based on severity, and offers real-time regional health monitoring. It combines artificial intelligence with data visualization and geolocation analysis to empower healthcare professionals with timely, actionable insights.

## 🩺 Key Features

- 🧠 **AI-Powered Symptom Analysis** – Automatically evaluates and matches symptoms against a disease database with severity scoring.
- 🚥 **Medical Triage Prioritization** – Categorizes patients based on urgency: Critical, Urgent, Medium, Low, Minimal.
- 🧑‍⚕️ **Admin Dashboard** – Healthcare providers can track patient stats, view outbreaks, and filter cases by severity or region.
- 📊 **Interactive Data Visualization** – Charts and maps powered by Chart.js and React Leaflet for real-time insights.
- 📍 **Location-Based Monitoring** – Geospatial tracking and disease clustering to detect potential outbreaks.
- 🔐 **Admin Authentication** – Secure access for medical personnel.

## 🧪 Tech Stack

### Frontend

- React 18 + Vite (Lightning-fast development)
- React Router (Routing)
- Styled Components (Modular styling)
- Chart.js (Data visualization)
- React Leaflet (Geographical maps)

### Backend

- Flask (REST API)
- SQLite (Relational database)
- Flask-CORS (Cross-origin requests)
- RESTful endpoints for patient records, triage stats, and regional data

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/MalikHadiWebdev/tib-ai.git
   cd tib-ai
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000)

> 🔧 **Note:** Backend must be started separately using Flask. Refer to `/backend/README.md` or your Flask setup instructions.

## 📁 Project Structure

```text
/frontend
├── /src
│   ├── /components     # Reusable UI components (buttons, charts, maps)
│   ├── /pages          # PatientPage and AdminPage views
│   ├── /context        # Global state (user, patient data, etc.)
│   ├── /layouts        # Page layout templates
│   └── /styles         # Global styling
/backend
├── app.py              # Flask API routes
├── models.py           # Database schema (Patient, Disease, Severity, Resultant)
└── database.db         # SQLite database (can scale to PostgreSQL)
```

## 🔮 Future Enhancements

- Improve AI model for higher diagnostic accuracy
- Develop a mobile version for field healthcare workers
- Integrate with hospital EHR systems
- Expand disease database
- Predictive analytics for outbreak forecasting

## 📢 Credits

Developed for **CUST Hackathon 2025** – a project focused on delivering innovation, technical depth, and real-world healthcare impact.

---

> 💬 _For questions, contributions, or deployment inquiries, please open an issue or contact the project maintainer._
