import discord
from discord.ext import commands
import asyncio
import variables as ENV_V
import card_compiler
import json

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
        await self.tree.sync()
        print("Guild commands synced!")

client = MyClient()

@client.event
async def on_ready():
    for cmd in client.tree.get_commands():
        await client.tree.delete_command(cmd.id)
        print(f"Deleted global command {cmd.name}")

client.run(ENV_V.TOKEN)