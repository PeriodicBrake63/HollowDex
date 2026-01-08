import discord
from discord.ext import commands
import asyncio
import json
from ..Client import client

@client.tree.command(
    name="trade begin",
    description="Starts a trade with another user"
)
@discord.app_commands.describe(
    usr="user you want to trade with"
)
async def trade(interaction: discord.Interaction, usr: discord.user):
    await interaction.response.send_message(f"trade started with {usr.name}")

@client.tree.command(
    name="trade add",
    description="Adds an enemy to the current trade"
)
@discord.app_commands.describe(
    usr="user you want to trade with"
)