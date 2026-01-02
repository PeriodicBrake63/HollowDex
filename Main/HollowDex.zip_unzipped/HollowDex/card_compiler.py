from PIL import Image, ImageDraw, ImageFont

def compile_card(specs, output_path):
    base_path = "assets/background/" + specs["category"] + ".png"
    enemy_path = "assets/enemies/" + specs["category"] + "/" + specs["name"] + ".png"   
    overlay = Image.open(enemy_path).convert("RGBA")
    name = specs["name"]
    health = str(specs["health"])
    attack = str(specs["attack"])
    base = Image.open(base_path).convert("RGBA")
    Mask_icon = Image.open("assets/icons/mask.png")
    Nail_icon = Image.open("assets/icons/nail.png")
    global abilitytext
    if specs["ability"] == 0:
        abilitytext = "Does not have an ability"
    elif specs["ability"]["type"] == "summon":
        abilitytext = f"Can summon a {specs["ability"]["summons"]}\n{specs["ability"]["count"]} times during combat."

    overlay = overlay.resize((640, 360))   # taille de la petite image
    base.paste(overlay, (55, 65), overlay)  # (x, y)
    Mask_icon = Mask_icon.resize((100, 100))
    base.paste(Mask_icon, (65, 910), Mask_icon)
    Nail_icon = Nail_icon.resize((100, 100))
    base.paste(Nail_icon, (579, 910), Nail_icon)
    
    draw = ImageDraw.Draw(base)
    font = ImageFont.truetype("assets/fonts/font.ttf", 40)
    pfont = ImageFont.truetype("assets/fonts/font.ttf", 30)

    draw.text((65, 12.5), name, font=font, fill=(255, 255, 255, 255))
    draw.text((65, 435), "Ability:", font=font, fill=(255, 255, 255, 255))
    draw.text((75, 485), abilitytext, font=pfont, fill=(255, 255, 255, 255))
    draw.text((165, 960), health, font=font, fill=(255, 255, 255, 255), anchor="lm")
    draw.text((579, 960), attack, font=font, fill=(255, 255, 255, 255), anchor="rm")

    base.save(output_path)