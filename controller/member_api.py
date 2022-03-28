from flask import session,request
from modules.db import Pool
import re


p = Pool()

class Member:
    def register():
        request_json = request.get_json()
        name = request_json["name"]
        email = request_json["email"]
        password = request_json["password"]
        email_regex = re.compile(r'[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+')
        email_check = email_regex.search(email)
        password_regex = re.compile(r'^[a-zA-Z0-9_-]{3,15}$')
        password_check = password_regex.search(password)
        if email_check == None:
            email_err = {
                "error":True,
                "message":"信箱格式錯誤"
            } 
            return email_err
        elif password_check == None:
            password_err = {
                "error":True,
                "message":"密碼格式錯誤"
            } 
            return password_err
        elif name == "" or email == "" or password == "":
            register_err = {
                "error":True,
                "message":"姓名信箱密碼不得為空"
            } 
            return register_err
        else:
            check_email_sql = "SELECT email FROM members WHERE email = %s;"
            check_email_val = (email,)
            check_data = p.sql_fetchall(check_email_sql,check_email_val)
            if check_data == []:
                insert_sql = "INSERT INTO members(name,email,password) VALUES (%s,%s,%s);"
                insert_val = (name,email,password)
                p.sql_commit(insert_sql,insert_val)
                register_ok = {
                    "ok":True
                }
                return register_ok
            else:
                register_fail = {
                    "error":True,
                    "message":"此E-mail已被註冊"
                }
                return register_fail

    def login():
        request_json = request.get_json()
        email = request_json["email"]
        password = request_json["password"]
        if email == "" or password == "":
            register_err = {
                "error":True,
                "message":"姓名信箱密碼不得為空"
            } 
            return register_err
        login_sql = "SELECT uid,email FROM members WHERE email = %s AND password = %s"
        login_val = (email,password)
        exist_account = p.sql_fetchone(login_sql,login_val)
        if exist_account != None:
            session["uid"] = exist_account[0]
            session["email"] = exist_account[1]
            loginok_message = {
                "ok":True
            }
            return loginok_message
        else:
            err_message = {
            "error":True,
            "message":"帳號密碼輸入有誤"
            }  
            return err_message

    def get_account():
        if "email" in session:
            email = session["email"]
            account_sql = "SELECT members.uid,name,email FROM members WHERE email = %s"
            account_val = (email,)
            get_account = p.sql_fetchone(account_sql,account_val)
            account_data = {
                "data":{
                    "id":get_account[0],
                    "name":get_account[1],
                    "email":get_account[2]
                }
            }
            return account_data
        else:
            account_null = {
                "data":None
            }
            return account_null
    
    def logout():
        del session["email"]
        loginout_message = {
            "ok":True
        }
        return loginout_message
