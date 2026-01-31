import discord
from .Client import client
from discord import app_commands

server = app_commands.Group(name="server", description="Server commands")

@server.command(
    name="spawnch",
    description="Sets the spawn channel for the server (automatically turns off disabled mode)"
)
@app_commands.describe(channel="The channel to set as spawn channel")
async def spawnch(interaction: discord.Interaction, channel: discord.TextChannel):
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("You need to be an administrator to use this command.", ephemeral=True)
        print(f"[WARN~] User @{interaction.user.display_name} tried to set spawn channel without permissions.")
        return
    try:
        client.ServerBase[str(interaction.guild.id)]["spawn_ch"] = channel.id
        client.ServerBase[str(interaction.guild.id)]["disabled"] = False
        await interaction.response.send_message(f"Spawn channel set to {channel.mention} and disabled mode turned off.", ephemeral=True)
        print(f"[LOG~~] Spawn channel for guild {interaction.guild.name} set to #{channel.name} by user @{interaction.user.display_name}.")
    except KeyError:
        print(f"[ERROR] Failed to set spawn channel for guild {interaction.guild.name} - {KeyError}")
        await interaction.response.send_message("An error occurred while setting the spawn channel.", ephemeral=True)

@server.command(
    name="disable",
    description="turns on disabled mode for the server"
)
async def spawnch(interaction: discord.Interaction):
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("You need to be an administrator to use this command.", ephemeral=True)
        print(f"[WARN~] User @{interaction.user.display_name} tried to set disabled mode without permissions.")
        return
    try:
        client.ServerBase[str(interaction.guild.id)]["disabled"] = False
        await interaction.response.send_message(f"Disabled mode turned on for {interaction.guild.name}", ephemeral=True)
        print(f"[LOG~~] Disabled mode for guild {interaction.guild.name} turned on by user @{interaction.user.display_name}.")
    except KeyError:
        print(f"[ERROR] Failed to set disabled mode for guild {interaction.guild.id} - {KeyError}")
        await interaction.response.send_message("An error occurred while setting the disabled mode", ephemeral=True)    

client.tree.add_command(server)