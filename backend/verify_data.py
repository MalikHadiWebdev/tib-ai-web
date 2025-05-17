import sqlite3

DB_PATH = "tib_ai.db"


def print_table_count(table_name):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"Table {table_name} has {count} rows")
    conn.close()
    return count


def print_table_sample(table_name, limit=5):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name} LIMIT {limit}")
    rows = cursor.fetchall()
    print(f"\nSample data from {table_name}:")
    for row in rows:
        print(dict(row))
    conn.close()


def main():
    print("Verifying data in SQLite database...")

    # Check all tables
    tables = ["Disease", "Severity", "Patient", "Resultant"]
    for table in tables:
        count = print_table_count(table)
        if count > 0:
            print_table_sample(table)

    # Check some joins for Resultant data
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    print("\nVerifying join between Patient, Disease, Severity, and Resultant:")
    cursor.execute(
        """
    SELECT p.name as patient_name, d.name as disease_name, s.name as severity_name, 
           r.confidence_score
    FROM Resultant r
    JOIN Patient p ON r.patient_id = p.id
    JOIN Disease d ON r.disease_id = d.id
    JOIN Severity s ON r.severity_id = s.id
    LIMIT 5
    """
    )

    rows = cursor.fetchall()
    for row in rows:
        print(dict(row))

    conn.close()
    print("\nVerification complete!")


if __name__ == "__main__":
    main()
