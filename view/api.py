from flask import *
import json

from controller.attraction_api import attraction
from controller.member_api import Member
from controller.booking_api import Booking
from controller.order_api import Order
from controller.member_page_api import Member_page

api = Blueprint('api',__name__)

@api.route('/api/attractions')
def api_attractions():
    return json.dumps(attraction.dict_attractions(),ensure_ascii=False)

@api.route('/api/attraction/<int:attractionId>')
def api_attraction(attractionId):
    return json.dumps(attraction.dict_attraction(attractionId),ensure_ascii=False)

@api.route('/api/user', methods=["GET","POST","PATCH","DELETE"])
def user():
    if request.method == "POST":
        return json.dumps(Member.register())
    elif request.method == "PATCH":   
        return json.dumps(Member.login())
    elif request.method == "DELETE":
        return json.dumps(Member.logout())
    else:
        return json.dumps(Member.get_account())

@api.route('/api/booking', methods=["GET","POST","DELETE"])
def booking():
    if request.method == "GET":
        return json.dumps(Booking.booking_page())
    elif request.method == "POST":
        return json.dumps(Booking.get_a_booking())
    elif request.method == "DELETE":
        return json.dumps(Booking.delete_booking())

@api.route('/api/orders', methods=["POST"])
def orders():
    return json.dumps(Order.get_order())

@api.route('/api/order/<string:orderNumber>')
def order(orderNumber):
    return json.dumps(Order.thanks(orderNumber))

@api.route('/api/memberorder',methods=["POST"])
def memberorder():
    return json.dumps(Member_page.get_member_order())