# Lok Lagbe Backend: Without Demo User Version

This folder contains the Django backend for the no-browser-login Lok Lagbe copy.

Important files and folders:

- `manage.py` - Django command runner.
- `loklagbe/` - project settings and root URL configuration.
- `labor/` - labor listing and review API.
- `booking/` - hire labor and booking API.
- `database/` - SQLite fixture and database notes.
- `media/` - local labor photos used during development.
- `db.sqlite3` - local SQLite database file.

Run backend commands from this folder:

```powershell
cd "C:\Users\adnan\Downloads\Samia project\versions\without-demo-user\backend"
..\.venv\Scripts\python.exe manage.py check
..\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

The React frontend is still in this version's top-level `frontend` folder.
