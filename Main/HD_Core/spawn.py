import os

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
enemy_list = _load_json("Enemylist.json")

class catch_btn(discord.ui.View):
    @discord.ui.button(label="Click me", style=discord.ButtonStyle.primary)
    async def button_callback(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("Bouton cliqué 😏", ephemeral=True)

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
                await channel.send(msg, discord.File(img_path))
    except Exception:
        return
