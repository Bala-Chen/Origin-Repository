from flask import *
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling
import json

load_dotenv(os.getenv("envurl"))

dbconfig = {
    "host": os.getenv("host"),
    "port": os.getenv("port"),
    "user": os.getenv("user"),
    "password": os.getenv("password"),
    "database": os.getenv("database")
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="taipei_pool",
    pool_reset_session=True,
    **dbconfig
)

api = Blueprint('api',__name__)
    

@api.route('/api/attractions')
def api_attractions():
    page = request.args.get("page", None)
    keyword = request.args.get("keyword",None)
    conn = cnxpool.get_connection()
    cursor = conn.cursor()
    try:
        json_data = []
        if int(page) == 0:
            first_data = 0
        else:
            first_data = int(page) * 12
        if keyword == None:
            sql = "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata LIMIT %s,12 "
            val = (first_data,)
            cursor.execute(sql,val)
            data = cursor.fetchall()
        elif keyword != None:
            sql =  "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata WHERE locate(%s,stitle) LIMIT %s,12 "
            val = (keyword,first_data)
            cursor.execute(sql,val)
            data = cursor.fetchall()
        for i in range(0,12):
            try:
                dictionary = {
                    "id" : data[i][0],
                    "name" : data[i][1],
                    "category" : data[i][2],
                    "description": data[i][3],
                    "address": data[i][4],
                    "transport": data[i][5],
                    "mrt": data[i][6],
                    "latitude": data[i][7],
                    "longitude": data[i][8],
                    "images":data[i][9].split(",") 
                    }
                json_data.append(dictionary)
            except IndexError:
                break
        if json_data == []:
            api_json = {
                "nextPage": None,
                "data": json_data
            }
            return json.dumps(api_json)
        else:
            api_json = {
                "nextPage": int(page)+1,
                "data": json_data
            }
            return json.dumps(api_json,ensure_ascii=False)
    except ValueError:
        return json.dumps({"error":True,"message":"page number error"})
    finally:
        cursor.close()
        conn.close()

@api.route('/api/attraction/<int:attractionId>')
def api_attraction(attractionId):
    try:
        conn = cnxpool.get_connection()
        cursor = conn.cursor()
        sql = "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata WHERE id = %s "
        val = (str(attractionId),)
        cursor.execute(sql,val)
        data = cursor.fetchone()
        if data == None:
            return json.dumps({"error":True,"message":"景點編號不正確"},ensure_ascii=False)
        else:
            dictionary = {
                "data":{
                    "id" : data[0],
                    "name" : data[1],
                    "category" : data[2],
                    "description": data[3],
                    "address": data[4],
                    "transport": data[5],
                    "mrt": data[6],
                    "latitude": data[7],
                    "longitude": data[8],
                    "images":data[9].split(",") 
                }
            }
            return json.dumps(dictionary,ensure_ascii=False)
    finally:
        cursor.close()
        conn.close()

