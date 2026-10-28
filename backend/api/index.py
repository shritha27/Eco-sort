import sys
import os

# Add parent directory to path so imports from main and app work smoothly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
