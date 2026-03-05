import os
import discord
from discord import app_commands
from .Client import client
import json

enemy = app_commands.Group(name="enemy", description="Enemy-related commands")

@enemy.command(
    name="inspect",
    description="Inspect an enemy by ID"
)
@app_commands.describe(
    query="enemy ID (use autocompletion)"
)
async def enemy_inspect(interaction: discord.Interaction, query: str):
    if "#" in query:
        await interaction.response.send_message(f"Enemy '{query}' not found.")
        return
    key, spec = found
    name = spec.get("name", key)
    hp = spec.get("health", "?")
    atk = spec.get("attack", "?")
    ability = spec.get("ability", None)
    desc_parts = [f"HP: {hp}", f"ATK: {atk}"]
    if ability:
        desc_parts.append(f"Ability: {ability}")
    img_file = None
    try:
        import card_compiler
        tmp_dir = os.path.join(BASE_DIR, "temp")
        os.makedirs(tmp_dir, exist_ok=True)
        out_name = f"{key.replace(' ', '_')}_card.png"
        out_path = os.path.join(tmp_dir, out_name)
        try:
            card_compiler.compile_card(spec, out_path)
            if os.path.isfile(out_path):
                img_file = out_path
        except Exception as e:
            img_file = None
            print(e)
    except Exception as e:
        img_file = None
        print(e)
    embed = discord.Embed(title=name, description=" | ".join(desc_parts))
    if img_file and os.path.isfile(img_file):
        try:
            file = discord.File(img_file, filename=os.path.basename(img_file))
            embed.set_image(url=f"attachment://{os.path.basename(img_file)}")
            await interaction.response.send_message(embed=embed, file=file)
            return
        except Exception:
            pass
    await interaction.response.send_message(embed=embed)

client.tree.add_command(enemy)
