import discord
from discord.ext import app_commands

async def user_autocomplete(interaction: discord.Interaction, current: str):
    return [
        app_commands.Choice(name=m.name, value=str(m.id))
        for m in interaction.guild.members
        if current.lower() in m.name.lower()
    ][:25]

async def _autocomplete(interaction: discord.Interaction, current: str):
    choices = ["apple", "banana", "carrot", "dragonfruit"]
    return [
        app_commands.Choice(name=c, value=c)
        for c in choices
        if current.lower() in c.lower()
    ]