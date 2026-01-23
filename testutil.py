import sys
import threading
import asyncio

from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout,
    QPushButton, QTextEdit, QLabel
)

import discord
from discord.ext import commands


# =======================
# CONFIG
# =======================
DISCORD_BOT_TOKEN = "PUT_YOUR_TOKEN_HERE"


# =======================
# DISCORD BOT SETUP
# =======================
intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)


def start_bot():
    asyncio.run(bot.start(DISCORD_BOT_TOKEN))


# =======================
# PYQT6 GUI
# =======================
class ExecApp(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Discord Bot Python Runner")
        self.setFixedSize(600, 400)

        layout = QVBoxLayout()

        self.label = QLabel("Write Python code (bot is already defined):")
        self.editor = QTextEdit()
        self.editor.setPlaceholderText(
            "# You already have access to:\n"
            "# bot (discord.ext.commands.Bot)\n"
            "# discord, commands\n\n"
            "@bot.event\n"
            "async def on_ready():\n"
            "    print('Bot is ready!')\n"
        )

        self.run_button = QPushButton("Run Script")
        self.run_button.clicked.connect(self.run_script)

        layout.addWidget(self.label)
        layout.addWidget(self.editor)
        layout.addWidget(self.run_button)

        self.setLayout(layout)

        self.bot_started = False

    def run_script(self):
        code = self.editor.toPlainText()

        exec_globals = {
            "bot": bot,
            "discord": discord,
            "commands": commands,
            "asyncio": asyncio
        }

        try:
            exec(code, exec_globals)
        except Exception as e:
            print("Script error:", e)
            return

        if not self.bot_started:
            self.bot_started = True
            thread = threading.Thread(
                target=start_bot,
                daemon=True
            )
            thread.start()
            print("Bot thread started.")


# =======================
# MAIN
# =======================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ExecApp()
    window.show()
    sys.exit(app.exec())
