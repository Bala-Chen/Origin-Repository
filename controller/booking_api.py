import re
from modules.db import Pool
from flask import request,session


p = Pool()

class Booking():
    def get_a_booking():
        booking_json = request.get_json()
        attractionid = booking_json["attractionId"]
        date = booking_json["date"]
        time = booking_json["time"]
        price = booking_json["price"]
        date_regex = re.compile(r'^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$')
        date_check = date_regex.search(date)
        if date_check == None:
            error_message = {
                "error":True,
                "message":"日期格式錯誤 yyyy-mm-dd"
            }
            return error_message
        if "email" in session:
            user_id = session["uid"]
            select_sql = "SELECT userID FROM booking WHERE userID = %s;"
            select_val = (user_id,)
            select_result = p.sql_fetchone(select_sql,select_val)
            if select_result == None:
                insert_sql = "INSERT INTO booking(userID,attractionId,bookingDate,bookingTime,BookingPrice) VALUES (%s,%s,%s,%s,%s);"
                insert_val = (user_id,attractionid,date,time,price)
                p.sql_commit(insert_sql,insert_val)
            else:
                update_sql = "UPDATE booking SET attractionId = %s,bookingDate = %s,bookingTime = %s,BookingPrice = %s WHERE userID = %s;"
                update_val = (attractionid,date,time,price,user_id)
                p.sql_commit(update_sql,update_val)

            booking_ok = {
                "ok":True
            }
            return booking_ok
        else:
            error_message = {
                "error":True,
                "message":"未登入系統，拒絕存取"
            }
            return error_message

    def booking_page():
        if "email" in session:
            user_id = session["uid"]
            booking_sql = "SELECT attractionId,bookingDate,bookingTime,BookingPrice FROM booking WHERE userID = %s;"
            booking_val = (user_id,)
            booking_info = p.sql_fetchone(booking_sql,booking_val)
            if booking_info == None:
                booking_None = {
                    "data":None
                }
                return booking_None
            else:
                attractionID = booking_info[0]
                attraction_sql = "SELECT stitle,address,IMG_SRC FROM alldata WHERE id = %s"
                attraction_val = (attractionID,)
                attraction_info = p.sql_fetchone(attraction_sql,attraction_val)
                images_list = attraction_info[2].split(",")
                booking_data = {
                    "data":{
                        "attraction":{
                            "id":booking_info[0],
                            "name":attraction_info[0],
                            "address":attraction_info[1],
                            "image":images_list[0],
                        },
                        "date":booking_info[1],
                        "time":booking_info[2],
                        "price":booking_info[3]
                    }
                }
                return booking_data
        else:
            error_message = {
                "error":True,
                "message":"未登入網站"
            }
            return error_message
    
    def delete_booking():
        if "email" in session:
            user_id = session["uid"]
            delete_sql = "DELETE FROM booking WHERE userID = %s"
            delete_val = (user_id,)
            p.sql_commit(delete_sql,delete_val)
            ok_message = {
                "ok":True
            }
            return ok_message
        else:
            error_message = {
                "error":True,
                "message":"未登入網站"
            }
            return error_message