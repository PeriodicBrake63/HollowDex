import subprocess
from HD_Core.Commands.Client import client
import asyncio
import os

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

async def resyncServs():
    for i in client.guilds:
        if not str(i.id) in client.ServerBase:
            client.ServerBase[str(i.id)] = {
                "spawn_ch":None,
                "disabled":True
            }
    subprocess.run(["git", "add", "."], cwd=REPO_DIR)

async def backup_loop():
    while True:
        await asyncio.gather(
            resyncServs(),  # tu peux en mettre plusieurs si besoin
        )
        await asyncio.sleep(120)

