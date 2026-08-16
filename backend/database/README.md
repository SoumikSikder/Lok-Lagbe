# SQLite database

Lok Lagbe uses SQLite through Django's built-in database backend. No external
database server, administration panel, database account, password, port, or
SQL bootstrap script is required.

The runtime database file is created at the project root as `db.sqlite3` when
you run:

```powershell
.\.venv\Scripts\python.exe manage.py migrate
```

Migrations create Django's authentication/content-type tables and the labor,
review, and booking tables. This unauthenticated demonstration copy does not
install Django's sessions application, so it does not create a
`django_session` table.

## Imported XAMPP dummy data

The current `db.sqlite3` was populated with the exact dummy rows that were in
the former XAMPP database named `lok_lagbe`. A reusable Django fixture is kept
at `database/xampp_dummy_data.json`, so XAMPP is not needed to restore those
rows again.

After running migrations on a new SQLite file, load the imported snapshot with:

```powershell
.\.venv\Scripts\python.exe manage.py loaddata database\xampp_dummy_data.json
```

The fixture contains 36 database objects:

- 4 Django users used only by review and booking foreign keys.
- 12 labor profiles.
- 14 reviews.
- 6 bookings.

The four imported users have unusable passwords. This copy intentionally has
no registration, login, logout, token, or browser-session endpoint, so those
rows cannot be used to sign in from React. Public labor listing/detail requests
work normally. Booking and review endpoints remain protected by DRF's
`IsAuthenticated` permission and are exercised in backend tests with direct
test authentication; a browser login module must be added before those writes
can be demonstrated from the web interface.

The fixture preserves the original primary keys, timestamps, booking dates,
statuses, and relationships from XAMPP. Labor image files are not embedded in
a Django JSON fixture; the corresponding files remain under
`media/labor_photos`.

For a newly generated demonstration dataset instead of the exact imported
snapshot, run:

```powershell
.\.venv\Scripts\python.exe manage.py seed_dummy_data
```

The seed command recreates the same kind and quantity of demo content but can
calculate relative booking dates when it runs. Use `loaddata` when the exact
imported values matter.

`db.sqlite3` is ignored by Git because it is local runtime data. Django's
migration files remain the source-controlled description of the schema.

To reset only a disposable local development database, stop Django, make a
backup if the data matters, remove `db.sqlite3`, rerun `migrate`, and load
`database/xampp_dummy_data.json`. Never remove a database that contains work
you have not backed up.
