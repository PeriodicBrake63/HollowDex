import discord
from discord import app_commands
import json

with open("/home/container/Main/DATABASE/PlayerBase.json", "r") as f:
    PlayerBase = json.load(f)

async def enemy_autocomplete(interaction: discord.Interaction, current: str):
    cuserid = interaction.user.id
    choices = []
    for idx, PlayerEnemy in enumerate(PlayerBase[cuserid]["enemies"]):
        choices.append(f'{PlayerEnemy["enemyName"]}, ATK: {PlayerEnemy["atkMod"]}%, DEF: {PlayerEnemy["defMod"]}% #{idx:06X}')
    return [
        app_commands.Choice(name=c, value=c)
        for c in choices
        if current.lower() in c.lower()
    ]
