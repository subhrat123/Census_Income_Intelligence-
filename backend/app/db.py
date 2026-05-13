from databricks import sql
from dotenv import load_dotenv
import os

load_dotenv()

connection = sql.connect(
    server_hostname=os.getenv("DATABRICKS_HOST"),
    http_path=os.getenv("DATABRICKS_HTTP_PATH"),
    access_token=os.getenv("DATABRICKS_TOKEN")
)

def get_cursor():
    return connection.cursor()