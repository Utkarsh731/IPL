from flask import Flask
from src import *

app = Flask(__name__)

@app.route('/')
def home_page():
    return home_page_handler()

if __name__ == "__main__":
    app.run(debug=True)