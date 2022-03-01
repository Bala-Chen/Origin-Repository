from datetime import date
import json
import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

connection = mysql.connector.connect(host = os.getenv("host"),
                                    port = os.getenv("port"),
                                    user = os.getenv("user"),
                                    password = os.getenv("password"),
                                    database = os.getenv("database"))



f = open('/Users/mac/Documents/GitHub/Origin-Repository/data/taipei-attractions.json')
data = json.load(f)

m_data = data["result"]["results"]

all_data_list = []

for i in range(len(m_data)):
    info = m_data[i]["info"]
    stitle = m_data[i]["stitle"]
    xpostdate = m_data[i]["xpostDate"]
    longitude = float(m_data[i]["longitude"])
    ref_wp = int(m_data[i]["REF_WP"])
    av_begin = m_data[i]["avBegin"]
    langinfo = int(m_data[i]["langinfo"])
    mrt = m_data[i]["MRT"]
    serial_no = int(m_data[i]["SERIAL_NO"])
    row_number = int(m_data[i]["RowNumber"])
    cat1 = m_data[i]["CAT1"]
    cat2 = m_data[i]["CAT2"]
    memo_time = m_data[i]["MEMO_TIME"]
    poi = m_data[i]["POI"]
    src_list = []
    src = m_data[i]["file"].split("https://")[1:]
    for n in range(0,len(src)):
        img_H = "https://" + src[n]
        if img_H[-4:] == ".jpg" or img_H[-4:] == ".JPG" or img_H[-4:] == ".png" or img_H[-4:] == ".PNG":
            src_list.append(img_H)
        else:
            continue
    img = src_list
    img_go_db = ",".join(img)
    idpt = m_data[i]["idpt"]
    latitude = float(m_data[i]["latitude"])
    xbody = m_data[i]["xbody"]
    avend = m_data[i]["avEnd"]
    address = m_data[i]["address"]

    cursor = connection.cursor()
    go_database = (info,stitle,xpostdate,longitude,ref_wp,av_begin,langinfo,mrt,serial_no,row_number,cat1,cat2,memo_time,poi,idpt,latitude,xbody,avend,address,img_go_db)
    cursor.execute("INSERT INTO alldata(info,stitle,xpostDate,longitude,REF_WP,avBegin,langinfo,MRT,SERIAL_NO,RowNumber,CAT1,CAT2,MEMO_TIME,POI,idpt,latitude,xbody,avEnd,address,IMG_SRC) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",go_database)
    connection.commit()

cursor.close()
connection.close()


    
    