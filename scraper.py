from bs4 import BeautifulSoup
import requests

# only letters are valid 
def is_valid(s):
    x = ord(s) #ascii value of s
    if x >= 65 and x <= 90: return True # capital 
    if x >= 97 and x <= 122: return True # lowercase
    return False


# make soup
url = 'https://en.wikipedia.org/wiki/List_of_serial_killers_by_number_of_victims'
website = requests.get(url)
soup = BeautifulSoup(website.content, 'html.parser')

# find all relevant tables
tables = soup.find_all('table')
tables = [tables[3],tables[4],tables[5],tables[6]]

# iterate through each table and record the names of the individuals by section
sections = []
for table in tables:
    section_data = []
    table_rows = table.tbody.find_all('tr')
    for row in table_rows:
        temp = row.find('td')
        # skip table header
        if temp is None: 
            continue 
        # skip case where individuals article is not hyperlinked
        if temp.a is None:
            #contents = temp.contents 
            continue
        else: # case where individuals article is hyperlinked
            contents = temp.a.contents 

        # sanitize
        clean_string = [s for s in contents[0].lower() if is_valid(s) or s==' ']
        clean_string = "".join(clean_string)
        clean_string.strip()
        # skip unidentified
        if 'killer' in clean_string: continue    
        # skip empty
        if clean_string == "": continue

        section_data.append(clean_string)
    sections.append(section_data)

# organize data
data_out = {'sk_highest_known' : sections[0],
            'sk_fifteen_to_thirty': sections[1],
            'sk_five_to_fourteen': sections[2],
            'sk_under_five': sections[3],
            'sk_combined': sections[0] + sections[1] + sections[2] + sections[3]}

# write out files as js
for filename in data_out:
    file = open(f"data/{filename}.py",'w')
    outstr = "data = " + "[\n"
    out = [f"\t\"{x}\",\n" for x in data_out[filename]]
    outstr += "".join(out) + "]"
    outstr = outstr[0:outstr.rindex(',')] + outstr[outstr.rindex(',')+2:]
    file.write(outstr)
    file.close()