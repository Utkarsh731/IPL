from flask import render_template

def home_page_handler(collection):
    data=list(collection.aggregate([{"$group":{"_id":"$winner","wins":{"$sum":1}}},
                           { "$project": { "_id":0,"team": "$_id","wins": 1}},{"$sort":{"wins":-1}}]))
    toss_wins = list(collection.aggregate([{"$group": {"_id": "$toss_winner", "wins": {"$sum": 1}}},
                                 {"$project": {"_id": 0, "team": "$_id", "wins": 1}}, {"$sort": {"wins": -1}}]))
    pom = list(collection.aggregate([{"$group": {"_id": "$player_of_match", "wins": {"$sum": 1}}},
                                 {"$project": {"_id": 0, "Player": "$_id", "wins": 1}}, {"$sort": {"wins": -1}}]))
    print(data)
    return render_template('index.html',data=data,toss_wins=toss_wins, pom=pom[:10])