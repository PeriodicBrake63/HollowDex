import subprocess
from HD_Core.Commands.Client import client
import asyncio
import os

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

async def git_sync():
    add = await asyncio.create_subprocess_exec("git", "add", ".", cwd=REPO_DIR)
    await add.wait()
    commit = await asyncio.create_subprocess_exec("git", "commit", "-m", "HollowDex runtime DB sync", cwd=REPO_DIR)
    await commit.wait()
    pull = await asyncio.create_subprocess_exec("git", "pull", cwd=REPO_DIR)
    await pull.wait()
    push = await asyncio.create_subprocess_exec("git", "push", cwd=REPO_DIR)
    await push.wait()

async def resyncServs():
    for i in client.guilds:
        if not str(i.id) in client.ServerBase:
            client.ServerBase[str(i.id)] = {
                "spawn_ch":None,
                "disabled":True
            }
    await git_sync()

async def backup_loop():
    while True:
        await asyncio.gather(
            resyncServs(),  # tu peux en mettre plusieurs si besoin
        )
        await asyncio.sleep(120)

