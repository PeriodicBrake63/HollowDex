import discord
from discord import app_commands
import asyncio
import variables as ENV_V

class MyClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.tree = discord.app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()
        print("Global commands synced!")

client = MyClient()