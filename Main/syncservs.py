import json
import os
from HD_Core.Commands.Client import client
import asyncio

async def resyncServs():
    print("*pretend i synced your DBs*")

async def backup_loop():
    while True:
        await asyncio.gather(
            resyncServs(),  # tu peux en mettre plusieurs si besoin
        )
        await asyncio.sleep(120)

