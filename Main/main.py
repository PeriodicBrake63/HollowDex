import os
import json
import variables as ENV_V
from .Commands.Client import client
from .Commands.Trade import *

client.run(ENV_V.TOKEN)