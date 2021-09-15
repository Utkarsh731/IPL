from flask import render_template
import json

def home_page_handler(collection):
    data=collection.aggregate([{"$group":{"_id":"$winner","wins":{"$sum":1}}},
                           { "$project": { "_id":0,"team": "$_id","wins": 1}},{"$sort":{"wins":-1}}])
    data=list(data)
    return render_template('index.html',data=data)