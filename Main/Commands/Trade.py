import discord
from discord.ext import commands
import asyncio
import json
from .Client import client
import autocompletion as ac

@client.tree.command(
    name="trade begin",
    description="Starts a trade with another user"
)
@discord.app_commands.describe(
    usr="user you want to trade with"
)
async def trade_begin(interaction: discord.Interaction, usr: discord.user):
    await interaction.response.send_message(f"trade started with {usr.name}")

@client.tree.command(
    name="trade add",
    description="Adds an enemy to the current trade"
)
@discord.app_commands.describe(
    enemy="enemy you want to add to the ongoing trade"
)
@discord.app_commands.autocomplete(
    enemy=ac.enemy_autocomplete()
)
async def trade_add(interaction: discord.Interaction, enemy: str):
    await interaction.response.send_message(f"enemy '{enemy}' added to the ongoing trade")
