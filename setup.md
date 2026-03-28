# Instructions on how to deploy the site

## Part 1: New Postgres on Render.com

Create a new Postgres on Render.com

Name the postgres and database

Choose the Free plan and press Create Database

Copy the Internal Database URL to your clipboard (you'll need it shortly)

<br>

## Part 2: New Web Service on Render.com

Create a new Web Service on Render.com

Select the Git repository where you committed your files.

Give your web service a name


### Additional settings:

Root Directory:

backend/  (Note: This depends on what folder you upload to Github and may not be necessary)

Build Command:

uv sync ; uv run manage.py migrate ; uv run manage.py collectstatic ; uv run manage.py ensure_adminuser

Start Command:

gunicorn backend.wsgi:application

## Part 3: Environment variables

Create the following environment variables.

ASSEMBLYAI_API_KEY - Get this from https://www.assemblyai.com/ (see Part 4 below)

DATABASE_URL - Paste in the Internal Database URL from the Postgres

DEBUG - FALSE

DJANGO_SUPERUSER_EMAIL - Add your email here

DJANGO_SUPERUSER_PASSWORD - Add/generate a password here

DJANGO_SUPERUSER_USERNAME - Choose a username

SECRET_KEY - Generate a secret key

VITE_API_URL - Set to /api

VITE_CLOUDINARY_CLOUD_NAME - Get this from https://cloudinary.com/ (see Part 5 below)

VITE_CLOUDINARY_UPLOAD_PRESET - Same as above

## Part 4: Get an API key from Assembly AI

To set up the Transcribing service on the Audio Detail page, first create an account on https://www.assemblyai.com/

Go to 'API keys' and create a new one

Copy and paste the key into the Environment variable in Render.

## Part 5: Get a Cloudinary 