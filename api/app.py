from flask import (Flask, 
    render_template, 
    make_response, 
    request, 
    redirect, 
    url_for, 
    send_from_directory)
import sqlite3
import os
import secrets
import random
from datetime import date

from data import data

if os.environ.get('murdle-visits') is None:
    os.environ['murdle-visits'] = '0'

app = Flask (__name__, static_folder='static')

# init
START_DATE = date.today()
MAX_DAYS = len(data)
random.seed(3708426)
random.shuffle(data)

@app.route('/static/favicon.ico')
def fav():
    return send_from_directory(app.static_folder,'images/favicon.ico')


@app.route('/')
@app.route('/index')
def index():
    # get todays murdle
    todays_murdle = data[int((date.today()-START_DATE).days)].split()[1]
        
    # Increment visit counter
    os.environ['murdle-visits'] = str(int(os.environ['murdle-visits']) + 1)
    
    resp = make_response(render_template('index.html',
            murdle_length=len(todays_murdle),
            visits=os.environ['murdle-visits']),200)

    # set cookie if not exists            
    if not 'visited' in request.cookies:
        resp.set_cookie('visited','visited')
    return resp


@app.route('/evaluate', methods=['GET'])
def evaluate():
    guess=request.args.get("guess")
    murdle = data[int((date.today()-START_DATE).days)].split()[1]
    if (len(guess) != len(murdle)): return make_response(400)
    if guess == murdle: return make_response({'resp' : ['G']*len(guess)},200)

    temp = []
    out = []
    for i in range(len(murdle)):
        (a,b) = list(zip(guess,murdle))[i]
        if a == b:
            out.append('G')
        elif a in temp:
            out.append('Y')
            temp.remove(a)
        elif a in murdle[i:]:
            out.append('Y')
        else:
            temp.append(b)
            out.append('R')
    assert(len(out)==len(guess) and len(guess) == len(murdle))
    return make_response({'resp':out},200)
    


@app.route('/contact',methods=['GET','POST'])
def contact():
    if request.method == 'POST':
        form_email = request.form.get('email')
        form_message = request.form.get('msg')

        # print(form_email,form_message)
        try : # Connecting to sqlite
            db_name = 'murdle.db' 
            conn = sqlite3.connect(db_name) 
            cursor = conn.cursor()
            cursor.execute('INSERT INTO murdle_messages (email,message) VALUES (?, ?)',(form_email,form_message))        
            conn.commit()
            conn.close()
        except sqlite3.Error as e:
            print(e)
        return redirect(url_for('contact'),302)
    return make_response(render_template('contact.html'),200)


@app.route('/administrator')
def sike():
    return redirect("https://www.tomorrowtides.com/google361.html",302)