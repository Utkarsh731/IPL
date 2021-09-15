from flask import Flask, render_template
import os, pymongo, urllib, csv
from src import *

app = Flask(__name__)

try:
    username = urllib.parse.quote_plus(os.environ['username'])
    password = urllib.parse.quote_plus(os.environ['password'])
    uri = os.environ['mongo'].format(username, password)
    client = pymongo.MongoClient(uri)
    db = client[os.environ['database']]
except Exception as e:
    print(e)
    print("no connection")


@app.route('/template')
def template_page():
    return render_template('index.html')


@app.route('/')
def home_page():
    collection = db[os.environ['collection1']]
    return home_page_handler(collection)


if __name__ == "__main__":
    app.run(debug=True)