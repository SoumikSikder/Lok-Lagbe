import os
import sys

# Insert backend path for Sphinx autodoc imports
sys.path.insert(0, os.path.abspath("../backend"))

# Set Django Settings module for autodoc
os.environ["DJANGO_SETTINGS_MODULE"] = "loklagbe.settings"

import django
django.setup()

project = "Lok-Lagbe"
copyright = "2026, Lok-Lagbe Team"
author = "Tanzim Ahamad & Team"
release = "1.0.0"

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_theme = "alabaster"
html_static_path = ["_static"]
