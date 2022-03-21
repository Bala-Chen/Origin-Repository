from flask import *
import json

from controller.attraction_api import attraction
from controller.member_api import Member

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
