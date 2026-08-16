#!/usr/bin/env python
"""Run Django management commands for Lok Lagbe."""

import os
import sys


def main():
    """Configure Django settings and execute a management command."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "loklagbe.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exception:
        raise ImportError(
            "Django is unavailable. Activate .venv and install requirements."
        ) from exception

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
