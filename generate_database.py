import sqlite3
import sys


if(len(sys.argv) != 2): sys.exit(1)
arg = sys.argv[1].lower()

if arg == 'help':
    print('USAGE: python3 generate_database.py [production/developement/help]')
    sys.exit(0)
elif arg == 'production':
    prod=True
elif arg == 'development':
    prod=False
else:
    print("command not recognized")
    print('USAGE: python3 generate_database.py [production/developement/help]')
    sys.exit(1)


commands = '''
CREATE TABLE IF NOT EXISTS murdle_messages(
   message_id INTEGER PRIMARY KEY,
   email TEXT NOT NULL,
   message TEXT NOT NULL
);'''

# Connecting to sqlite
db_name = 'api/murdle.db' if prod else 'api/test.db'
conn = sqlite3.connect(db_name) 
conn = sqlite3.connect('api/murdle.db')
cursor = conn.cursor()
cursor.execute(commands)        
conn.commit()
conn.close()

    