from app.db import get_cursor

TABLE_NAME = "workspace.default.census_cleaned"

ALLOWED_SORT_COLUMNS = [
    "age",
    "workclass",
    "education_level",
    "occupation",
    "income",
    "`hours-per-week`"
]

def fetch_records(
    page=1,
    limit=20,
    search="",
    workclass="",
    sort="age",
    order="asc"
):

    offset = (page - 1) * limit

    cursor = get_cursor()

    query = f"""
        SELECT *
        FROM {TABLE_NAME}
        WHERE 1=1
    """

    # Search
    if search:

        query += f"""
            AND (
                LOWER(workclass) LIKE LOWER('%{search}%')
                OR LOWER(education_level) LIKE LOWER('%{search}%')
                OR LOWER(occupation) LIKE LOWER('%{search}%')
            )
        """

    # Filter
    if workclass:

        query += f"""
            AND LOWER(workclass) = LOWER('{workclass}')
        """

    # Safe sorting
    if sort not in ALLOWED_SORT_COLUMNS:
        sort = "age"

    if order.lower() not in ["asc", "desc"]:
        order = "asc"

    query += f"""
        ORDER BY {sort} {order.upper()}
        LIMIT {limit}
        OFFSET {offset}
    """

    cursor.execute(query)

    rows = cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]

    result = []

    for row in rows:
        result.append(dict(zip(columns, row)))

    return result