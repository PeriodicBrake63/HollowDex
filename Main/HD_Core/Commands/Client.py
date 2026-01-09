import discord
from discord import app_commands
import asyncio

class MyClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.tree = discord.app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()
        print("Global commands synced!")
        print("Synced commands:")
        for cmd in self.tree.walk_commands():
            qname = getattr(cmd, "qualified_name", None) or getattr(cmd, "name", "<unknown>")
            desc = getattr(cmd, "description", "")
            print(f"- {qname}: {desc}")

client = MyClient()