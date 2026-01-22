from .Client import client
from discord import app_commands

server = app_commands.Group(name="server", description="Server commands")

@server.command(
    name="SpawnCh",
    description="Sets the spawn channel for the server (automatically turns off disabled mode)"
)
@app_commands.describe(channel="The channel to set as spawn channel")
async def SpawnCh(interaction: discord.Interaction, channel: discord.TextChannel):
    await interaction.response.send_message(f"*act like the spawn channel for this server is now set to {channel.mention}*", ephemeral=True)