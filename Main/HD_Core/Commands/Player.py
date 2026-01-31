import discord
import asyncio
from .Client import client
from discord import app_commands

player = app_commands.Group(name="player", description="Player commands")

@player.command(
    name="init",
    description="Initializes a player as a collector"
)
async def player_init(interaction: discord.Interaction, usr: discord.User):
    await interaction.response.send_message(f"*act like your account in initialized while it's really not in database*", ephemeral=True)

@player.command(
    name="config",
    description="opens the config panel"
)
async def player_config(interaction: discord.Interaction, enemy: str):
    await interaction.response.send_message(f"*act like this opened the config panel*", ephemeral=True)

client.tree.add_command(player)