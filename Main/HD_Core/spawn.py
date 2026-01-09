import os
print(os.getcwd())

from .Commands.Client import client
import discord
import asyncio
import random
import json

with open("/home/container/Main/DATABASE/ServerBase.json", "r") as f:
    server_base = json.load(f)

with open("/home/container/Main/DATABASE/Enemylist.json", "r") as f:
    enemy_list = json.load(f)

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    else:
        if random.randint(1, 100) <= 5:
            items = list(enemy_list.values())
            weights = [1 / item["rarity"] for item in items]

            chosen = random.choices(items, weights=weights, k=1)[0]
            path = chosen["path"]
            await message.guild.get_channel(server_base[str(message.guild.id)]["spawn_channel_id"]).send(
                embed=discord.Embed().set_image(url="https://i.imgur.com/3ZQ3Z6L.png")
            )