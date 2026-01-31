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
DISCORD_BOT_TOKEN = "MTQ1NTU2NTk3MDc4NDUxODI3OA.GZ1epI.qwyQJUYtR_XiuUP_-cuhOG4RRGtP4-epsed3E4"


# =======================
# BOT FACTORY
# =======================
def create_bot():
    intents = discord.Intents.all()
    return commands.Bot(command_prefix="!", intents=intents)


bot = create_bot()
bot_loop = None


def start_bot():
    global bot_loop
    bot_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(bot_loop)
    bot_loop.run_until_complete(bot.start(DISCORD_BOT_TOKEN))


def stop_bot():
    global bot_loop, bot
    if bot_loop and bot.is_running():
        asyncio.run_coroutine_threadsafe(bot.close(), bot_loop)
        print("Bot stopped.")

    bot = create_bot()
    bot_loop = None


# =======================
# PYQT6 GUI
# =======================
class ExecApp(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Discord Bot Python Runner")
        self.setFixedSize(600, 450)

        layout = QVBoxLayout()

        self.label = QLabel("Write Python code (bot is already defined):")
        self.editor = QTextEdit()

        self.editor.setPlaceholderText(
            "# Available variables:\n"
            "# bot, discord, commands, asyncio\n\n"
            "@bot.event\n"
            "async def on_ready():\n"
            "    print('Bot is ready!')\n"
        )

        self.run_button = QPushButton("Run Script")
        self.reset_button = QPushButton("Reset Execution")

        self.run_button.clicked.connect(self.run_script)
        self.reset_button.clicked.connect(self.reset_execution)

        layout.addWidget(self.label)
        layout.addWidget(self.editor)
        layout.addWidget(self.run_button)
        layout.addWidget(self.reset_button)

        self.setLayout(layout)

        self.bot_started = False

    def run_script(self):
        global bot

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

    def reset_execution(self):
        global bot

        if self.bot_started:
            stop_bot()

        self.bot_started = False
        self.label.setText("Execution reset. Bot is stopped.")
        print("Execution reset complete.")


# =======================
# MAIN
# =======================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ExecApp()
    window.show()
    sys.exit(app.exec())
