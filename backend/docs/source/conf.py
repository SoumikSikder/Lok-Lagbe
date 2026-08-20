import os
import sys
import django

# Add the backend folder to the Python path so Sphinx can find Django apps
sys.path.insert(0, os.path.abspath('../..'))

# Tell Django which settings to use
os.environ['DJANGO_SETTINGS_MODULE'] = 'loklagbe.settings'

django.setup()

# Project info
project = 'Lok Lagbe'
copyright = '2025, Group 2'
author = 'Group 2'
release = '1.0'

# Sphinx extensions
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
]

# Theme
html_theme = 'sphinx_rtd_theme'

templates_path = ['_templates']
exclude_patterns = []
html_static_path = ['_static']