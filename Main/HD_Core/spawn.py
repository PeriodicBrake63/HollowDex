import os
from math import *
from .Commands.Client import client
import discord
import asyncio
import random
import json

class catch_btn(discord.ui.View):
    def __init__(self, enemy: str, atkfactor: int, hltfactor: int):
        super().__init__(timeout=random.randint(60, 180))
        self.enemy = enemy
        self.atkfactor = atkfactor
        self.hltfactor = hltfactor

    @discord.ui.button(label="Catch!", style=discord.ButtonStyle.primary)
    async def button_callback(self, interaction: discord.Interaction, button: discord.ui.Button):
        a = 0
        async for i in client.PlayerBase[str(interaction.user.id)]["enemies"]:
            atk = ((i["atkfactor"]/100) + 1) * client.EnemyList[i["enemy"]]["attack"]
            a += atk
        a = floor(a)
        if a > client.EnemyList[self.enemy]["health"]:
            await interaction.response.send_message(f"You caught the {self.enemy}!", ephemeral=True)
            client.PlayerBase[str(interaction.user.id)]["enemies"].append({
                "enemy": self.enemy,
                "atkfactor": self.atkfactor,
                "hltfactor": self.hltfactor,
                "timestamp": floor(discord.utils.utcnow().timestamp())
            })
            print("[LOG~~] Player {} caught a {}".format(interaction.user.name, self.enemy))
            button.disabled = True
            button.label = "Caught!"
            button.style = discord.ButtonStyle.secondary
            await interaction.channel.send(f"{interaction.user.mention} caught the {self.enemy}!")
        else:
            await interaction.channel.send(f"You aren't powerful enough!", ephemeral=True)

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    if not message.guild:
        return
    if client.ServerBase[str(message.guild.id)]["disabled"] != True:
        return
    try:
        cfg = client.ServerBase.get(str(message.guild.id))
        if not cfg:
            return
        if random.randint(1, 100) <= 1:
            x = []
            for idx, i in enumerate(client.EnemyList):
                for j in floor(1/i["rarity"]):
                    x.append(idx)
                    
            chosen = random.choice(x)
            img_path = client.EnemyList[chosen]["path"]

            atkfactor = random.randint(-35, 35)
            hltfactor = random.randint(-35, 35)

            view = catch_btn(enemy=enemy_name, atkfactor=atkfactor, hltfactor=hltfactor)
            file = discord.File(img_path, filename="enemy.png")

            if enemy_key:
                msg = f"A wild {client.EnemyList[chosen]["name"]} appears! HP: {client.EnemyList[chosen]["attack"] * (1 + (atkfactor/100))}, ATK: {client.EnemyList[chosen]["health"] * (1 + (hltfactor/100))}"
            else:
                return
            channel = message.guild.get_channel(client.ServerBase[str(message.guild.id)]["spawn_ch"])
            if channel:
                await channel.send(msg, file, view=view)
    except Exception:
        return
