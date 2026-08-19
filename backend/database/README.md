# SQLite database

Lok Lagbe uses SQLite through Django's built-in database backend. It does not
require an external database server, database account, password, port, or SQL
bootstrap script.

Run database commands from the `backend/` directory. Django creates the local
runtime database at `backend/db.sqlite3` when migrations are applied:

```powershell
.\venv\Scripts\python.exe manage.py migrate
```

The migrations create Django's authentication and content-type tables along
with the labor, review, and booking tables. This project does not install
Django's sessions application, so it does not create a `django_session` table.

## Demonstration data

The fixture at `database/xampp_dummy_data.json` preserves the demonstration
rows imported from the former XAMPP database named `lok_lagbe`. XAMPP is not
needed to restore them.

After applying migrations to a new SQLite database, load the fixture with:

```powershell
.\venv\Scripts\python.exe manage.py loaddata database\xampp_dummy_data.json
```

The fixture contains 36 objects:

- 4 Django users referenced by reviews and bookings.
- 12 labor profiles.
- 14 reviews.
- 6 bookings.

The imported users have unusable passwords. The API has no registration,
login, logout, token, or browser-session endpoint. Public labor list and detail
requests work without authentication. Booking and review writes use DRF's
`IsAuthenticated` permission and are tested with direct test authentication;
the backend needs an authentication feature before the browser can perform
those operations.

The fixture preserves the original primary keys, timestamps, booking dates,
statuses, and relationships. Django JSON fixtures do not embed image files;
the corresponding labor photos are stored in `media/labor_photos/`.

To create a fresh demonstration dataset instead of restoring the imported
snapshot, run:

```powershell
.\venv\Scripts\python.exe manage.py seed_dummy_data
```

The seed command creates the same types and quantities of demonstration
content and calculates booking dates relative to the day it runs. Use
`loaddata` when the imported values and dates must be preserved exactly.

## Local database safety

`db.sqlite3` is ignored by Git because it contains local runtime data. The
migration files under `apps/labor/migrations/` and
`apps/booking/migrations/` are the source-controlled schema history.

To reset a disposable local database, stop the Django server, back up any data
that matters, remove only `backend/db.sqlite3`, rerun `migrate`, and optionally
load `database/xampp_dummy_data.json`. Do not remove a database that contains
work you have not backed up.
