import os
import json
import variables as ENV_V
from Commands.Client import client
from Commands.Trade import *
from Commands.Player import *

@client.event
async def on_ready():
    await client.tree.sync()
    print(f'Bot is online as {client.user}')       

client.run(ENV_V.TOKEN)