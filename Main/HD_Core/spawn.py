import os

from .Commands.Client import client
import discord
import asyncio
import random
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_DIR = os.path.join(BASE_DIR, "DATABASE")

def _load_json(fname):
    try:
        with open(os.path.join(DB_DIR, fname), "r") as f:
            return json.load(f)
    except Exception:
        return {}

server_base = _load_json("ServerBase.json")
enemy_list = _load_json("Enemylist.json")

with open("/home/container/Main/DATABASE/Enemylist.json", "r") as f:
    enemy_list = json.load(f)

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    if not message.guild:
        return
    try:
        cfg = server_base.get(str(message.guild.id))
        if not cfg:
            return
        if random.randint(1, 100) <= 5:
<<<<<<< HEAD
            items = list(enemy_list.values())
            weights = [1 / item["rarity"] for item in items]

            chosen = random.choices(items, weights=weights, k=1)[0]
            path = chosen["path"]
            await message.guild.get_channel(server_base[str(message.guild.id)]["spawn_channel_id"]).send(
                embed=discord.Embed().set_image(url="https://i.imgur.com/3ZQ3Z6L.png")
            )
=======
            enemy_key = random.choice(list(enemy_list.keys())) if enemy_list else None
            if enemy_key:
                spec = enemy_list[enemy_key]
                msg = f"A wild {spec.get('name', enemy_key)} appears! HP: {spec.get('health', '?')}, ATK: {spec.get('attack', '?')}"
            else:
                msg = "You feel a sudden chill run down your spine..."
            channel = message.guild.get_channel(cfg.get("spawn_channel_id"))
            if channel:
                await channel.send(msg)
    except Exception:
        return
>>>>>>> ae9a9fd (enemy inspect command and first enemy spawning)
