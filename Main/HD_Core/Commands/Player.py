import discord
import asyncio
from .Client import client
from discord import app_commands
import random
from math import *

player = app_commands.Group(name="player", description="Player commands")

@player.command(
    name="init",
    description="Initializes a player as a collector"
)
async def player_init(interaction: discord.Interaction):
    if str(interaction.user.id) in client.PlayerBase:
        await interaction.response.send_message("Your account was already initialized! *(if for some reason you want to delete it, do /config and press the delete button)*", ephemeral=True)
    else:
        client.PlayerBase[str(interaction.user.id)] = {
            "init_timestamp": floor(discord.utils.utcnow().timestamp()),
            "money": 250,
            "enemies": [
                {
                    "enemy": "crawlid",
                    "atkfactor": random.randint(-35, 35),
                    "hltfactor": random.randint(-35, 35),
                    "timestamp": floor(discord.utils.utcnow().timestamp())
                },
                {
                    "enemy": "crawlid",
                    "atkfactor": random.randint(-35, 35),
                    "hltfactor": random.randint(-35, 35),
                    "timestamp": floor(discord.utils.utcnow().timestamp())
                },
                {
                    "enemy": "crawlid",
                    "atkfactor": random.randint(-35, 35),
                    "hltfactor": random.randint(-35, 35),
                    "timestamp": floor(discord.utils.utcnow().timestamp())
                }
            ]
        }
        await interaction.response.send_message(f"your account is initialized from today, <t:{floor(discord.utils.utcnow().timestamp())}>", ephemeral=True)

@player.command(
    name="config",
    description="opens the config panel"
)
async def player_config(interaction: discord.Interaction):
    await interaction.response.send_message(f"*to be implemented...*", ephemeral=True)

@player.command(
    name="info",
    description="get infos about a specific user"
)
@app_commands.describe(
    usr="the user you want to look up"
)
async def player_info(interaction: discord.Interaction, usr: discord.User):
    user_data = client.PlayerBase[str(usr.id)]
    if str(usr.id) == "993196090654457898":
        await interaction.response.send_message(f"""
        **{usr.name}**:
        - Money: as much as he wants
        - Enemies: all + the one and only knight
        - Denominations: The creator, Pale king
        """)
    await interaction.response.send_message(f"", ephemeral=False)

client.tree.add_command(player)