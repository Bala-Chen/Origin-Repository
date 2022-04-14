from flask import request,session
from random import randint
from modules.db import Pool
from controller.booking_api import Booking
import requests
import json
import re

p = Pool()

with open("config/tappay_key.json") as f:
    key = json.load(f)

class Order:
    def get_order():
        if "email" in session:
            request_json = request.get_json()
            r_trip = request_json["order"]["trip"]
            r_attr = request_json["order"]["trip"]["attraction"]
            r_contact = request_json["order"]["contact"]
            email_regex = re.compile(r'[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+')
            email_msg = email_regex.search(request_json["order"]["contact"]["email"])
            phone_regex = re.compile(r'^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[1-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$')
            phone_msg = phone_regex.search(request_json["order"]["contact"]["phone"])
            if request_json["order"]["contact"]["phone"] == "" or request_json["order"]["contact"]["email"]=="" or request_json["order"]["contact"]["name"]=="":
                error_message = {
                    "error": True,
                    "message": "客戶資料不得為白"
                }
                return error_message
            elif email_msg == None or phone_msg == None:
                error_message = {
                    "error": True,
                    "message": "手機或Email格式有誤"
                }
                return error_message
            random_num = randint(10000000000000,99999999999999)
            sel_sql = "SELECT order_id FROM paydata WHERE order_number = %s"
            sel_val = (random_num,)
            sel_result = p.sql_fetchone(sel_sql,sel_val)
            if sel_result != None:
                error_message = {
                    "error": True,
                    "message": "產生訂單編號重複，請重新再試"
                }
                return error_message
            else:
                add_sql = "INSERT INTO paydata(order_number,price,attraction_id,attraction_name,attraction_address,attraction_image,date,time,contact_name,contact_email,contact_phone) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                add_val = (random_num,request_json["order"]["price"],r_attr["id"],r_attr["name"],r_attr["address"],r_attr["image"],r_trip["date"],r_trip["time"],r_contact["name"],r_contact["email"],r_contact["phone"])
                p.sql_commit(add_sql,add_val)
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {"Content-Type": "application/json","x-api-key": key['partner_key']}
                post_data = {
                    "prime": request_json["prime"],
                    "partner_key":key['partner_key'],
                    "merchant_id": "guava422448_CTBC",
                    "order_number":str(random_num),
                    "details":"taipei trip attraction",
                    "amount": 1,
                    "cardholder": {
                        "phone_number": request_json["order"]["contact"]["phone"],
                        "name": request_json["order"]["contact"]["name"],
                        "email": request_json["order"]["contact"]["email"]
                    }
                }
                r = requests.post(url,json.dumps(post_data),headers=headers)
                r_json = r.json()
                if r_json["status"]==0 and r_json["msg"]=="Success":
                    upd_sql = "UPDATE paydata SET payment_status='已付款' WHERE order_number=%s"
                    upd_val = (r_json["order_number"],)
                    p.sql_commit(upd_sql,upd_val)
                    Booking.delete_booking()
                    pay_ok = {
                        "data":{
                            "number":r_json["order_number"],
                            "payment":{
                                "status":r_json["status"],
                                "message":"付款成功"
                            }
                        }
                    }
                    return pay_ok
                elif r_json["status"]==1:
                    pay_fail = {
                        "data":{
                            "number":r_json["order_number"],
                            "payment":{
                                "status":r_json["status"],
                                "message":"付款失敗"
                            }
                        }
                    }
                    return pay_fail
                else:
                    error_message ={
                        "error": True,
                        "message": "error"
                    }
                    return error_message
        else:
            error_message = {
                "error":True,
                "message":"未登入網站"
            }
            return error_message
    
    def thanks(orderNumber):
        if "email" in session:
            sel_sql = "select order_number,price,attraction_id,attraction_name,attraction_address,attraction_image,date,time,contact_name,contact_email,contact_phone,payment_status from paydata where order_number = %s"
            sel_val = (orderNumber,)
            sel_result = p.sql_fetchone(sel_sql,sel_val)
            if sel_result == None:
                order_none_data ={
                    "data":None
                }
                return order_none_data
            else:
                if sel_result[11] == "已付款":
                    status = 0
                else:
                    status = 1
                order_data = {
                    "data":{
                        "number":sel_result[0],
                        "price":sel_result[1],
                        "trip":{
                            "attraction":{
                                "id":sel_result[2],
                                "name":sel_result[3],
                                "address":sel_result[4],
                                "image":sel_result[5]
                            },
                            "date":sel_result[6],
                            "time":sel_result[7],
                        },
                        "contact":{
                            "name":sel_result[8],
                            "email":sel_result[9],
                            "phone":sel_result[10]
                        },
                        "status":status
                    }
                }
                return order_data
        else:
            error_message = {
                "error":True,
                "message":"未登入網站"
            }
            return error_message    