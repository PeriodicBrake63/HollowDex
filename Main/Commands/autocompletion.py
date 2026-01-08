import discord
from discord.ext import app_commands
import json

with open("../DATABASE/PlayerBase.json", "r") as f:
    PlayerBase = json.load(f)

async def user_autocomplete(interaction: discord.Interaction, current: str):
    return [
        app_commands.Choice(name=m.name, value=str(m.id))
        for m in interaction.guild.members
        if current.lower() in m.name.lower()
    ][:25]


async def enemy_autocomplete(interaction: discord.Interaction, current: str, cuserid):
    choices = []
    for idx, PlayerEnemy in enumerate(PlayerBase[cuserid]["enemies"]):
        choices.append(f'{PlayerEnemy["enemyName"]}, ATK: {PlayerEnemy["atkMod"]}%, DEF: {PlayerEnemy["defMod"]}% #{idx:06X}')
    return [
        app_commands.Choice(name=c, value=c)
        for c in choices
        if current.lower() in c.lower()
    ]
