
---

## Prerequisites: Install These First

Download and install all of the following before doing anything else. Version matters so follow exactly.

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.13.x | https://www.python.org/downloads |
| Node.js | LTS (v22.x) | https://nodejs.org |
| Git | Latest | https://git-scm.com/downloads |
| XAMPP | 3.3.0 or later | https://www.apachefriends.org |
| VS Code | Latest | https://code.visualstudio.com |

### Python Installation: Important
During installation check **"Add Python to PATH"** before clicking install. Otherwise Python will not be recognized in the terminal.

On Windows Python runs as `py` not `python`. Verify with:

py --version
py -m pip --version

### Node.js Installation
Install with default settings. Verify with:

node --version
npm --version

### XAMPP Installation
Install with default settings. Only **MySQL** and **Apache** component from XAMPP is needed.

---

## VS Code Extensions Install These

Open VS Code, press `Ctrl + Shift + X` and install all of the following:

- **Python** by Microsoft
- **Pylint** by Microsoft
- **ESLint** by Microsoft
- **Tailwind CSS IntelliSense** by Tailwind Labs
- **Django** by Baptiste Darthenay

---

## Step 1: Clone the Repository

Open a terminal anywhere and run:

cd C:\Users\YourName\Documents // Replace with the path of your project directory
git clone https://github.com/Soumik-Sikder/lok-lagbe.git
cd lok-lagbe

Replace `YourName` with your actual Windows username and the GitHub URL with the actual repo link.

---

## Step 2: Open the Project in VS Code

code .

This opens the entire `lok-lagbe` folder in VS Code. Always open VS Code from the root project folder, never from inside `backend` or `frontend` individually.

---

## Step 3: Start MySQL in XAMPP

1. Open XAMPP Control Panel
2. Click **Start** next to **MySQL** and **Apache**
3. Status turns green: MySQL is running and Apache is running
4. Click **Admin** next to MySQL: this opens phpMyAdmin in your browser at `http://localhost/phpmyadmin`
5. In phpMyAdmin click **New** in the left sidebar
6. Database name: `loklagbe`
7. Collation: `utf8mb4_general_ci`
8. Click **Create**

You must start MySQL and Apache in XAMPP every single time before running the backend.

---

## Step 4: Set Up the Python Virtual Environment

Open a terminal in VS Code (`Ctrl + backtick`) and run:

cd C:\Users\YourName\Documents\lok-lagbe\backend
py -m venv venv

### Activate the virtual environment

venv\Scripts\activate.bat

You must see `(venv)` at the start of your terminal line before running any further backend commands. If you do not see it the venv is not active.

### Set VS Code to always use the venv interpreter

1. Press `Ctrl + Shift + P`
2. Type **Python: Select Interpreter**
3. Select the one that shows:
   ```
   Python 3.13.x ('venv': venv) .\backend\venv\Scripts\python.exe
   ```

If it does not appear in the list click **Enter interpreter path** and paste:
```
C:\Users\YourName\Documents\lok-lagbe\backend\venv\Scripts\python.exe
```

Replace `YourName` with your actual Windows username. After this VS Code will automatically activate the venv every time you open a terminal.

### Fix PowerShell execution policy if activation fails

If you get an error about the module not being loaded run this in PowerShell as administrator:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Then try `venv\Scripts\activate.bat` again.

---

## Step 5: Install Python Packages

Make sure you are in the `backend` folder with `(venv)` active, then run:

cd C:\Users\YourName\Documents\lok-lagbe\backend
py -m pip install -r requirements.txt

This installs every package in one shot. The packages and their versions are:

| Package | Version | Purpose |
|---------|---------|---------|
| Django | 4.2.x | Backend web framework |
| djangorestframework | Latest | REST API toolkit |
| djangorestframework-simplejwt | Latest | JWT authentication |
| django-cors-headers | Latest | Allow React to talk to Django |
| mysqlclient | Latest | MySQL database driver |
| python-dotenv | Latest | Load .env variables |
| sphinx | Latest | Documentation generation |
| pylint | Latest | Python linter |

---

## Step 6: Create the .env File

Stay in the `backend` folder. Copy the example env file and fill in your values:

cd C:\Users\YourName\Documents\lok-lagbe\backend
copy .env.example .env

Open `.env` and fill in:

```env
DEBUG=True
SECRET_KEY=paste-your-own-random-secret-key-here
DB_NAME=loklagbe
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

To generate your own secret key run this with venv active:

py -c "import secrets; print(secrets.token_urlsafe(50))"


Copy the output and paste it as your `SECRET_KEY`. Every developer has their own unique secret key. Do not share it and do not commit the `.env` file to GitHub.

---

## Step 7: Run Django Migrations

Make sure you are in the `backend` folder with `(venv)` active:

cd C:\Users\YourName\Documents\lok-lagbe\backend
py manage.py migrate

You should see a list of migrations being applied. Then create a superuser for the Django admin panel:

py manage.py createsuperuser

Enter a username, email and password when prompted. This is your admin login.

---

## Step 8: Start the Django Backend

Still in the `backend` folder with `(venv)` active:

cd C:\Users\YourName\Documents\lok-lagbe\backend
py manage.py runserver

Open your browser and go to `http://localhost:8000` — you should see the Django welcome page.
Go to `http://localhost:8000/admin` — you should see the Django admin login.

---

## Step 9: Set Up the React Frontend

Open a **new terminal** in VS Code and run:

cd C:\Users\YourName\Documents\lok-lagbe\frontend
npm install

This installs all frontend packages from `package.json` automatically including:

| Package | Purpose |
|---------|---------|
| React 18.x | Frontend framework |
| Vite 5.x | Development server and build tool |
| Tailwind CSS 3.x | Utility-first CSS framework |
| axios | API calls to Django backend |
| react-router-dom | Page routing |

---

## Step 10: Start the React Frontend

Still in the `frontend` folder:

cd C:\Users\YourName\Documents\lok-lagbe\frontend
npm run dev

Open your browser and go to `http://localhost:5173` — you should see the Vite + React welcome page.

---

## Step 11 — Update CORS in settings.py

Open `backend/loklagbe/settings.py` and make sure this is set:

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

Vite runs on port 5173 not 3000. If this is wrong the React frontend cannot talk to the Django backend.

---

## Daily Workflow

Every time you sit down to work do this in order:

**1. Start MySQL and Apache in XAMPP Control Panel**

**2. Terminal 1: Start Django backend:**

cd C:\Users\YourName\Documents\lok-lagbe\backend
venv\Scripts\activate.bat
py manage.py runserver


**3. Terminal 2: Start React frontend:**

cd C:\Users\YourName\Documents\lok-lagbe\frontend
npm run dev

---

## Quick Reference

| Service | Command | URL |
|---------|---------|-----|
| Django backend | `py manage.py runserver` | http://localhost:8000 |
| React frontend | `npm run dev` | http://localhost:5173 |
| Django admin | — | http://localhost:8000/admin |
| phpMyAdmin | — | http://localhost/phpmyadmin |
| MySQL | Start via XAMPP | localhost:3306 |

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `py` not recognized | Reinstall Python and check "Add to PATH" |
| `venv\Scripts\activate` fails | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` then use `activate.bat` |
| Django says MariaDB version too old | You have an old XAMPP. Download XAMPP 3.3.0 or later |
| `pip` not recognized | Use `py -m pip` instead of `pip` |
| Port 5173 not working | Make sure you ran `npm run dev` from inside the `frontend` folder |
| CORS error in browser | Check `CORS_ALLOWED_ORIGINS` in settings.py includes `http://localhost:5173` |