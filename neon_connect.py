import operator
import os
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv('DATABASE_URL')

connection_pool = pool.SimpleConnectionPool(
    1,
    10,
    connection_string
)

if connection_pool:
    print("Connection pool created successfully")

conn = connection_pool.getconn()
cur = conn.cursor()

cur.execute('SELECT name FROM foreign_agents')
foreign_agents_list = list(map(operator.itemgetter(0), cur.fetchall()))
cur.close()
connection_pool.putconn(conn)
