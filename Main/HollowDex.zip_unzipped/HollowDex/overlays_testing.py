import card_compiler
import json

with open("assets/enemylist.json", "r") as f:
    enemylist = json.load(f)

output = "temp/output.png"

specs = enemylist["tiktik"]

card_compiler.compile_card(specs, output)