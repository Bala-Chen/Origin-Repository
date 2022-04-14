from flask import session,request
from modules.db import Pool

p = Pool()

class Member_page:
    def get_member_order():
        if "email" in session:
            request_json = request.get_json()
            email = request_json["email"]
            sql = "SELECT order_number,payment_status,attraction_name,`date` FROM paydata WHERE contact_email=%s ORDER BY order_id DESC LIMIT 12"
            val = (email,)
            sel_result = p.sql_fetchall(sql,val)
            if sel_result == []:
                none_result = {
                    "data":None
                }
                return none_result
            else:    
                result_list = []
                for i in range(len(sel_result)):
                    one_result = {
                        "order_number":sel_result[i][0],
                        "payment_status":sel_result[i][1],
                        "attraction_name":sel_result[i][2],
                        "travel_date":sel_result[i][3]
                    }
                    result_list.append(one_result)
                all_result = {
                    "data":result_list
                }
                return all_result
        else:
            error_message = {
                "error":True,
                "message":"未登入網站"
            }
            return error_message
        