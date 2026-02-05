import os
from math import *
from .Commands.Client import client
import discord
import asyncio
import random
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AS_DIR = os.path.join(BASE_DIR, "assets")
EN_DIR = os.path.join(AS_DIR, "enemies")
DB_DIR = os.path.join(BASE_DIR, "DATABASE")

def _load_json(fname):
    try:
        with open(os.path.join(DB_DIR, fname), "r") as f:
            return json.load(f)
    except Exception:
        return {}

server_base = _load_json("ServerBase.json")
player_base = _load_json("PlayerBase.json")
enemy_list = _load_json("Enemylist.json")

class catch_btn(discord.ui.View):
    def __init__(self, enemy: str, atkfactor: str, hltfactor: str):
        super().__init__()
        self.enemy = enemy
        self.atkfactor = atkfactor
        self.hltfactor = hltfactor
        self.timeoutUNIX = floor(discord.utils.utcnow().timestamp()) + random.randint(60, 180)

    @discord.ui.button(label="Catch!", style=discord.ButtonStyle.primary)
    async def button_callback(self, interaction: discord.Interaction, button: discord.ui.Button):
        a = 0
        async for i in player_base[str(interaction.user.id)]["enemies"]:
            atk = ((i[atkfactor]/100) + 1) * enemy_list[i["enemy"]]["attack"]
            a += atk
        a = floor(a)
        if a > enemy_list[self.enemy]["health"]:
            await interaction.response.send_message(f"You caught the {self.enemy}!", ephemeral=True)
            player_base[str(interaction.user.id)]["enemies"].append({
                "enemy": self.enemy,
                "atkfactor": self.atkfactor,
                "hltfactor": self.hltfactor,
                "timestamp": floor(discord.utils.utcnow().timestamp())
            })
        else:
            await interaction.response.send_message(f"The {self.enemy} broke free!", ephemeral=True)

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    if not message.guild:
        return
    if server_base[str(message.guild.id)]["disabled"] != True:
        return
    try:
        cfg = server_base.get(str(message.guild.id))
        if not cfg:
            return
        if random.randint(1, 100) <= 1:
            items = list(enemy_list.values())
            weights = [1 / item["rarity"] for item in items]
            chosen = random.choices(items, weights=weights, k=1)[0]
            img_path = os.path.join(EN_DIR, chosen["category"], f"{chosen['name']}.png")
            enemy_key = random.choice(list(enemy_list.keys())) if enemy_list else None
            if enemy_key:
                spec = enemy_list[enemy_key]
                msg = f"A wild {spec.get('name', enemy_key)} appears! HP: {spec.get('health', '?')}, ATK: {spec.get('attack', '?')}"
            else:
                msg = "You feel a sudden chill run down your spine..."
            channel = message.guild.get_channel(cfg.get("spawn_channel_id"))
            if channel:
                await channel.send(msg, discord.File(img_path), view=catch_btn(enemy_key, "atkfactor", "hltfactor"))
    except Exception:
        return
