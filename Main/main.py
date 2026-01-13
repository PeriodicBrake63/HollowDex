import os
import json
import variables as ENV_V
from HD_Core.Commands.Client import client
from HD_Core.Commands.Trade import *
from HD_Core.Commands.Player import *
from HD_Core.Commands.Enemy import *
from HD_Core.spawn import on_message
from syncservs import *

@client.event
async def on_ready():
    await client.tree.sync()
    await resyncServs()
    client.loop.create_task(backup_loop())
    print(f'Bot is online as {client.user}')

client.run(ENV_V.TOKEN)