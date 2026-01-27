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
    client.ServerBase[str(interaction.guild.id)]["spawn_ch"] = channel.id
    client.ServerBase[str(interaction.guild.id)]["disabled"] = False
    await interaction.response.send_message(f"Spawn channel set to {channel.mention} and disabled mode turned off.", ephemeral=True)
client.tree.add_command(server)