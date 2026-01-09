import os
import discord
from discord import app_commands
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DB_DIR = os.path.join(BASE_DIR, "DATABASE")

def _load_json(fname):
    try:
        with open(os.path.join(DB_DIR, fname), "r") as f:
            return json.load(f)
    except Exception:
        return {}

PlayerBase = _load_json("PlayerBase.json")

async def enemy_autocomplete(interaction: discord.Interaction, current: str):
    cuserid = str(interaction.user.id)
    choices = []
    entries = PlayerBase.get(cuserid, {}).get("enemies", [])
    for idx, PlayerEnemy in enumerate(entries):
        name = PlayerEnemy.get("enemy_name", PlayerEnemy.get("enemyName", "unknown"))
        atk = PlayerEnemy.get("atkMod", PlayerEnemy.get("atk", 0))
        df = PlayerEnemy.get("defMod", PlayerEnemy.get("def", 0))
        choices.append(f'{name}, ATK: {atk}%, DEF: {df}% #{idx:06X}')
    return [
        app_commands.Choice(name=c, value=c)
        for c in choices
        if current.lower() in c.lower()
    ]
