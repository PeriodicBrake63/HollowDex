import os
from math import *
from .Commands.Client import client
import discord
import asyncio
import random

class CatchBtn(discord.ui.View):
    def __init__(self, enemy: str, atkfactor: int, hltfactor: int):
        super().__init__(timeout=random.randint(60, 180))
        self.enemy = enemy
        self.atkfactor = atkfactor
        self.hltfactor = hltfactor
        self.attempts = 0
        self.tried = []
        # We will store the message here to edit it later
        self.message = None 
        
    async def on_timeout(self):
        """Grays out the button when the timer ends or the enemy is gone."""
        for item in self.children:
            item.disabled = True
        
        if self.message:
            try:
                await self.message.edit(view=self)
            except discord.NotFound:
                pass # Message was deleted
        self.stop()

    @discord.ui.button(label="Catch!", style=discord.ButtonStyle.primary)
    async def button_callback(self, interaction: discord.Interaction, button: discord.ui.Button):
        user_id = str(interaction.user.id)
        
        # 1. Validation
        if interaction.user.id in self.tried:
            return await interaction.response.send_message("You've already made your attempt!", ephemeral=True)

        # 2. Attack Calculation
        player_data = client.PlayerBase.get(user_id, {"enemies": []})
        total_atk = 0
        for i in player_data["enemies"]:
            base_enemy_stats = client.EnemyList.get(i["enemy"], {"attack": 0})
            atk_value = ((i["atkfactor"] / 100) + 1) * base_enemy_stats["attack"]
            total_atk += atk_value
            
        total_atk = floor(total_atk)
        target_health = client.EnemyList[self.enemy]["health"]

        # 3. Decision Logic
        if total_atk > target_health:
            # Add to DB
            client.PlayerBase[user_id]["enemies"].append({
                "enemy": self.enemy, "atkfactor": self.atkfactor,
                "hltfactor": self.hltfactor, "timestamp": floor(discord.utils.utcnow().timestamp())
            })
            
            # --- THE KEY CHANGE ---
            # Disable the button immediately
            for item in self.children:
                item.disabled = True
            
            # Update the message with the disabled button AND send the success text
            await interaction.response.edit_message(view=self)
            await interaction.followup.send(f"🎉 {interaction.user.mention} caught the **{self.enemy}**!")
            self.stop()

        else:
            self.attempts += 1
            self.tried.append(interaction.user.id)
            
            if self.attempts >= 3:
                for item in self.children:
                    item.disabled = True
                await interaction.response.edit_message(view=self)
                await interaction.followup.send(f"The {self.enemy} has fled after too many attempts!")
                self.stop()
            else:
                # Use response.send_message for ephemeral alerts so the button stays active
                await interaction.response.send_message(f"You aren't powerful enough! (Power: {total_atk}/{target_health})", ephemeral=True)
                await interaction.channel.send(f"{interaction.user.mention} tried to catch the {self.enemy} but failed!")

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    if not message.guild:
        return
    if client.ServerBase[str(message.guild.id)]["disabled"]:
        return
    try:
        if random.randint(1, 100) <= 1:
            x = []
            for idx, I in enumerate(client.EnemyList):
                i = client.EnemyList[I]
                if not I == "knight":
                    try:
                        for j in range(floor(1/i["rarity"])):
                            x.append(I)
                    except:
                        print("")
                    
            chosen = random.choice(x)
            img_path = client.EnemyList[chosen]["path"]
            img_path = os.path.join(client.BASE_DIR, img_path)

            atkfactor = random.randint(-35, 35)
            hltfactor = random.randint(-35, 35)

            view = CatchBtn(enemy=chosen, atkfactor=atkfactor, hltfactor=hltfactor)
            file = discord.File(img_path, filename="enemy.png")

            if chosen:
                msg = f"A wild {client.EnemyList[chosen]["name"]} appears! HP: {floor(client.EnemyList[chosen]["attack"] * (1 + (atkfactor/100)))}, ATK: {floor(client.EnemyList[chosen]["health"] * (1 + (hltfactor/100)))}"
            else:
                return
            channel = message.guild.get_channel(client.ServerBase[str(message.guild.id)]["spawn_ch"])
            if channel:
                await channel.send(msg, file=file, view=view)
    except KeyError:
       print("[ERROR~~] An error occurred while trying to spawn an enemy in guild {}: {}".format(message.guild.name, str(KeyError)))