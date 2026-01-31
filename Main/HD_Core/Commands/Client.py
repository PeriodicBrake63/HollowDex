import discord
from discord import app_commands
import asyncio
import json
import os

class MyClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.tree = discord.app_commands.CommandTree(self)
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        DB_DIR = os.path.join(BASE_DIR, "DATABASE")

        self.ServerBase = {}
        self.PlayerBase = {}

        with open(os.path.join(DB_DIR, "ServerBase.json"), "r") as f:
            self.ServerBase = json.load(f)
        with open(os.path.join(DB_DIR, "PlayerBase.json"), "r") as f:
            self.PlayerBase = json.load(f)

    async def setup_hook(self):
        await self.tree.sync()
        print("Global commands synced!")
        print("Synced commands:")
        for cmd in self.tree.walk_commands():
            qname = getattr(cmd, "qualified_name", None) or getattr(cmd, "name", "<unknown>")
            desc = getattr(cmd, "description", "")
            print(f"- {qname}: {desc}")

client = MyClient()