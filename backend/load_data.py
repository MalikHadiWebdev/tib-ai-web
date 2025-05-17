import sqlite3
import csv
import os
import traceback

# Define the database path directly
DB_PATH = "tib_ai.db"


def load_disease_data():
    try:
        print("Loading disease data...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        with open("data/diesease data.csv", "r", encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                print(f"Inserting disease: {row}")
                cursor.execute(
                    "INSERT OR IGNORE INTO Disease (id, name) VALUES (?, ?)",
                    (row["Disease_id"], row["Disease name"]),
                )

        conn.commit()
        print("Disease data loaded successfully")
        conn.close()
    except Exception as e:
        print(f"Error loading disease data: {e}")
        traceback.print_exc()


def load_severity_data():
    try:
        print("Loading severity data...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        with open("data/severity data.csv", "r", encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                print(f"Inserting severity: {row}")
                cursor.execute(
                    "INSERT OR IGNORE INTO Severity (id, level, name) VALUES (?, ?, ?)",
                    (row["Severity_id"], row["Severity_id"], row["severity_title"]),
                )

        conn.commit()
        print("Severity data loaded successfully")
        conn.close()
    except Exception as e:
        print(f"Error loading severity data: {e}")
        traceback.print_exc()


def load_patient_data():
    try:
        print("Loading patient data...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)

        with open("data/patient data.csv", "r", encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)
            count = 0
            for row in csv_reader:
                count += 1
                if count % 10 == 0:
                    print(f"Processing patient {count}...")

                # Extract patient ID from the original ID (remove the 25x prefix)
                patient_id = row["patient_id"]
                if patient_id.startswith("25x"):
                    patient_id = patient_id[3:]  # Remove prefix

                # Handle the image path
                image_path = None
                if row["image"] and row["image"] != "None" and row["image"] != "":
                    image_path = os.path.join("uploads", row["image"])

                # Extract pregnant status (Yes/No to yes/no)
                pregnancy_status = (
                    row["pregnancy status"].lower() if row["pregnancy status"] else "no"
                )

                cursor.execute(
                    """
                    INSERT OR IGNORE INTO Patient (
                        id, name, age, gender, location, temperature_f, 
                        pregnancy_status, blood_pressure, blood_glucose, 
                        image_path, symptoms, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    """,
                    (
                        patient_id,
                        row["patient name"],
                        row["age"],
                        row["gender"],
                        row["location"],
                        row["temprature_F"],
                        pregnancy_status,
                        row["blood pressure"],
                        row["blood Glucose levels"],
                        image_path,
                        row["Symptoms"],
                    ),
                )

        conn.commit()
        print("Patient data loaded successfully")
        conn.close()
    except Exception as e:
        print(f"Error loading patient data: {e}")
        traceback.print_exc()


def load_resultant_data():
    try:
        print("Loading resultant data...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        with open("data/resultant data.csv", "r", encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)
            count = 0
            for row in csv_reader:
                count += 1
                if count % 10 == 0:
                    print(f"Processing resultant {count}...")

                # Extract patient ID from the original ID (remove the 25x prefix)
                patient_id = row["Patient_id"]
                if patient_id.startswith("25x"):
                    patient_id = patient_id[3:]  # Remove prefix

                cursor.execute(
                    """
                    INSERT OR IGNORE INTO Resultant (
                        patient_id, severity_id, disease_id, confidence_score, comment
                    ) VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        patient_id,
                        row["Severity_id"],
                        row["Disease_id"],
                        row["confidence score"],
                        f"AI detected disease with {float(row['confidence score'])*100:.1f}% confidence",
                    ),
                )

        conn.commit()
        print("Resultant data loaded successfully")
        conn.close()
    except Exception as e:
        print(f"Error loading resultant data: {e}")
        traceback.print_exc()


def initialize_db():
    try:
        print("Initializing database...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Create Patient table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Patient (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                gender TEXT NOT NULL,
                location TEXT NOT NULL,
                temperature_f REAL,
                pregnancy_status TEXT,
                blood_pressure TEXT,
                blood_glucose REAL,
                image_path TEXT,
                symptoms TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        # Create Severity table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Severity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level INTEGER NOT NULL,
                name TEXT NOT NULL
            )
            """
        )

        # Create Disease table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Disease (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
            """
        )

        # Create Resultant table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Resultant (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                severity_id INTEGER NOT NULL,
                disease_id INTEGER NOT NULL,
                confidence_score REAL NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patient (id),
                FOREIGN KEY (severity_id) REFERENCES Severity (id),
                FOREIGN KEY (disease_id) REFERENCES Disease (id)
            )
            """
        )

        conn.commit()
        print("Database initialized successfully")
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
        traceback.print_exc()


def main():
    try:
        print("Starting data import...")
        initialize_db()
        load_disease_data()
        load_severity_data()
        load_patient_data()
        load_resultant_data()
        print("All data imported successfully!")
    except Exception as e:
        print(f"Error in main: {e}")
        traceback.print_exc()


if __name__ == "__main__":
    main()
