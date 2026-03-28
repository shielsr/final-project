# Final Assignment - "Overnote"

## Website URL
https://overnote-app.onrender.com/

## Github Repo
https://github.com/shielsr/final-project

## Documentation
1. [View setup instructions](setup.md)

2. [View Documentation](documentation.md)


## Project goal
The goal of the project is to create a voice memo app for songwriters (or any type of creator) that allows them to record and manage their ideas.

## Features
### As a Songwriter, the user can:
- Register, log in and out
- Record audio files
- Create projects
- Add audio files to projects
- Add co-writers to projects
- Transcribe audio

### As a Co-writer, the user can:
- Register, log in and out
- Be added to another user's project
- Add audio files to another user's project

<br>
<br>



# Instructions on how to use the site

<br>

## Navbar

The navbar is responsive on desktop and mobile.

The buttons change based on logged-in status.

<br>

## Register

Users can register via the form on /register.

Their passwords are hashed in the database. 

Once they submit the form, they are automatically logged in.

<br>

## Homepage (/)

The homepage has gives a brief introduction to the app and what it can do.

The Login and Register buttons appear when logged out, and don't show when logged in.

<br>

## Record (/record)

After registering or loggin in, the user is sent directly to the Record page.

Recording is the primary action within the app, hence why the user is sent here first.

As soon as the user stops recording, they are taken to the Audio detail page.

<br>

## Audio detail (/audio/idNumber)

Edit audio metadata, including name and description.

The title of the audio file is automatically generated based on the date and time of recording.

Users can press 'Transcribe' to generate a speech-to-text transcription of their audio in any language.

Tag the file with multiple categories (these can be filtered on the Audio list page).

Add the file to a project. The project dropdown contains all the projects that the user created, as well as any they were added to by another user.

<br>

## My files (/audio)

A list of all the audio files created by the user.

Filter them by category.

<br>

## Projects (/projects)

A list of the projects created by the user, as well as projects they've been added to by another user.

Press the 'Create new project' button to create a new project.

<br>

## Project detail (/project/idNumber)

Edit project data, including name and description.

See all the audio files that are part of the project.

Add/remove co-writers on the project.

Delete the project.

<br>

# Search (/search)

Search for keywords in the following places:

- Title and description of audio files

- Title and description of projects

- Content of transcriptions.

<br>

# Profile

Add a bio and personal website.