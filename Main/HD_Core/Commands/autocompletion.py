import discord
from discord import app_commands
from .Client import client


async def enemy_autocomplete(interaction: discord.Interaction, current: str):
    CUserID = str(interaction.user.id)
    choices = []
    entries = client.PlayerBase.get(CUserID, {}).get("enemies", [])
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
