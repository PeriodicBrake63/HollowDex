import os
print(os.getcwd())

from .Commands.Client import client
import discord
import asyncio
import random
import json

with open("/home/container/Main/DATABASE/ServerBase.json", "r") as f:
    server_base = json.load(f)

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    else:
        if random.randint(1, 100) <= 5:
            await message.guild.get_channel(server_base[str(message.guild.id)]["spawn_channel_id"]).send("You feel a sudden chill run down your spine...")