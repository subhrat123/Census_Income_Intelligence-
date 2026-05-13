from app.db import get_cursor

TABLE_NAME = "workspace.default.census_cleaned"

def fetch_metrics():

    cursor = get_cursor()

    metrics = {}

    # Total records
    cursor.execute(f"""
        SELECT COUNT(*) AS total_records
        FROM {TABLE_NAME}
    """)

    metrics["total_records"] = cursor.fetchall()[0][0]

    # Average age
    cursor.execute(f"""
        SELECT AVG(age) AS avg_age
        FROM {TABLE_NAME}
    """)

    metrics["average_age"] = round(cursor.fetchall()[0][0], 2)

    # Average working hours
    cursor.execute(f"""
        SELECT AVG(`hours-per-week`) AS avg_hours
        FROM {TABLE_NAME}
    """)

    metrics["average_hours_per_week"] = round(
        cursor.fetchall()[0][0],
        2
    )

    # Income distribution
    cursor.execute(f"""
        SELECT income, COUNT(*) as count
        FROM {TABLE_NAME}
        GROUP BY income
    """)

    income_rows = cursor.fetchall()

    metrics["income_distribution"] = [
        {
            "income": row[0],
            "count": row[1]
        }
        for row in income_rows
    ]

    # Workclass distribution
    cursor.execute(f"""
        SELECT workclass, COUNT(*) as count
        FROM {TABLE_NAME}
        GROUP BY workclass
        ORDER BY count DESC
        LIMIT 10
    """)

    workclass_rows = cursor.fetchall()

    metrics["workclass_distribution"] = [
        {
            "workclass": row[0],
            "count": row[1]
        }
        for row in workclass_rows
    ]

    return metrics