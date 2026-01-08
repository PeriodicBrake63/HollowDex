import discord
import asyncio
from .Client import client
from discord import app_commands
from .autocompletion import user_autocomplete, enemy_autocomplete

trade = app_commands.Group(name="trade", description="Trade commands")

@client.tree.command(
    name="begin",
    description="Starts a trade with another user"
)
@discord.app_commands.describe(
    usr="user you want to trade with"
)
@discord.app_commands.autocomplete(
    usr=user_autocomplete
)
async def begin(interaction: discord.Interaction, usr: discord.User):
    await interaction.response.send_message(f"trade started with {usr.name}")

client.tree.add_command(trade)

@client.tree.command(
    name="add",
    description="Adds an enemy to the current trade"
)
@discord.app_commands.describe(
    enemy="enemy you want to add to the ongoing trade"
)
@discord.app_commands.autocomplete(
    enemy=enemy_autocomplete
)
async def add(interaction: discord.Interaction, enemy: str):
    await interaction.response.send_message(f"enemy '{enemy}' added to the ongoing trade")

client.tree.add_command(trade)