from HD_Core.Commands.Client import client
import asyncio
import os
import json

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

async def resyncServs():
    for i in client.guilds:
        if not str(i.id) in client.ServerBase:
            client.ServerBase[str(i.id)] = {
                "spawn_ch":None,
                "disabled":True
            }
    with open(os.path.join(REPO_DIR, "Main/DATABASE/ServerBase.json"), "w") as f:
        json.dump(client.ServerBase, f, indent=2)
    with open(os.path.join(REPO_DIR, "Main/DATABASE/PlayerBase.json"), "w") as f:
        json.dump(client.PlayerBase, f, indent=2)

async def backup_loop():
    while True:
        await asyncio.gather(
            resyncServs()  # tu peux en mettre plusieurs si besoin
        )
        await asyncio.sleep(60)