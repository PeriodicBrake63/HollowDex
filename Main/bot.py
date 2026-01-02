#-----Imports-----#

import discord
from discord.ext import commands
import asyncio
import variables as ENV_V
import card_compiler
import json
import os

with open("assets/enemylist.json", "r") as f:
    enemylist = json.load(f)

output = "temp/output.png"

class MyClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.tree = discord.app_commands.CommandTree(self)

    async def setup_hook(self):
        guild = discord.Object(id=ENV_V.GUILD_ID)
        self.tree.copy_global_to(guild=guild)
        await self.tree.sync(guild=guild)
        print("Guild commands synced!")

client = MyClient()

@client.tree.command(
    name="ping",
    description="Ping test",
)
async def ping(interaction: discord.Interaction):
    await interaction.response.send_message("🏓 Pong!")

@client.tree.command(
    name="card",
    description="Checks a certain card",
    guild=discord.Object(id=ENV_V.GUILD_ID)
)
@discord.app_commands.describe(
    name="name of the card"
)
async def card(interaction: discord.Interaction, name: str):
    await interaction.response.defer()
    if os.path.exists("assets/enemies/" + enemylist["name"]["category"] + "/" + enemylist["name"]["name"] + ".png"):
        card_compiler.compile_card(enemylist[name], output)
        file = discord.File(output)
        await interaction.followup.send(file=file)
    else:
        await interaction.followup.send(f"Enemy named '{name}' not found in database." + f"\nerror: \n{KeyError}", ephemeral=True)
        return
    
#-----Main loop-----#

client.run(ENV_V.TOKEN)