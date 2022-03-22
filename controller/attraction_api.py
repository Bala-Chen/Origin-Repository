from modules.db import Pool
from flask import request


p = Pool()

class attraction():
    def dict_attractions():
        page = request.args.get("page", 0)
        keyword = request.args.get("keyword",None)
        try:
            json_data = []
            if int(page) == 0:
                first_data = 0
            else:
                first_data = int(page) * 12
            if keyword == None:
                sql = "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata LIMIT %s,12 "
                val = (first_data,)
                data = p.sql_fetchall(sql,val)
            elif keyword != None:
                sql =  "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata WHERE locate(%s,stitle) LIMIT %s,12 "
                val = (keyword,first_data)
                data = p.sql_fetchall(sql,val)
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
                lastpage_json = {
                    "nextPage": None,
                    "data": json_data
                }
                return lastpage_json
            else:
                page_json = {
                    "nextPage": int(page)+1,
                    "data": json_data
                }
                return page_json
        except ValueError:
            err_json = {
                "error":True,
                "message":"page number error"
            }
            return err_json

    def dict_attraction(attractionId):
        sql = "SELECT id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,IMG_SRC FROM alldata WHERE id = %s "
        val = (str(attractionId),)
        data = p.sql_fetchone(sql,val)
        if data == None:
            id_err_dict = {
                "error":True,
                "message":"景點編號不正確"
                }
            return id_err_dict
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
            return dictionary
