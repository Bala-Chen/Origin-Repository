import json
import mysql.connector
from mysql.connector import pooling

with open("config/env_setting.json") as f:
    data = json.load(f)

class Pool():
    def __init__(self):
        self.__dbconfig = data
        self.cnxpool = None

    def connection(self):
        self.cnxpool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="taipei_pool",
            pool_reset_session=True,
            **self.__dbconfig
        )
        return self.cnxpool
    
    def db_close(self,conn,cursor):
        cursor.close()
        conn.close()

    def sql_fetchall(self,sql,val):
        conn = self.connection().get_connection()
        cursor = conn.cursor()
        cursor.execute(sql,val)
        d = cursor.fetchall()
        self.db_close(conn,cursor)
        return d

    def sql_fetchone(self,sql,val):
        conn = self.connection().get_connection()
        cursor = conn.cursor()
        cursor.execute(sql,val)
        d = cursor.fetchone()
        self.db_close(conn,cursor)
        return d

    def sql_commit(self,sql,val):
        conn = self.connection().get_connection()
        cursor = conn.cursor()
        cursor.execute(sql,val)
        conn.commit()
        self.db_close(conn,cursor)