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
        print(f"initializing account for {interaction.user.name} ({interaction.user.id})")
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
    
    if str(usr.id) == "993196090654457898":
        user_data = client.PlayerBase[str(usr.id)]
        user_init_timestamp = user_data["init_timestamp"]
        await interaction.response.send_message(f"""
##**{usr.name}**:
> Account created: <t:{user_init_timestamp}>
> Money: as much as he wants
> Enemies: all + the one and only knight
> Denominations: The creator, Pale king
        """)
        return
    if not str(usr.id)in client.PlayerBase:
        await interaction.response.send_message(f"{usr.name} doesn't have an account yet!", ephemeral=True)
        return
    user_data = client.PlayerBase[str(usr.id)]
    user_init_timestamp = user_data["init_timestamp"]
    money = user_data["money"]
    # TODO: Fix percentage by making it the actual progression
    percentage = len(user_data['enemies']) / (len(client.EnemyList) - 1) * 100
    await interaction.response.send_message(f"""
##**{usr.name}**:
> Account created: <t:{user_init_timestamp}>
> Money: {money}
> Enemies: {len(user_data['enemies'])}
> Denominations: {((percentage<=25)*"Beginner collector")+((percentage>25 and percentage<=50)*"Intermediate collector")+((percentage>50 and percentage<100)*"Advanced collector")+((percentage>=100)*"Master collector")}
""", ephemeral=False)

client.tree.add_command(player)