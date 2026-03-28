# Final Assignment - "Overnote"

## Website URL
https://overnote-app.onrender.com/

## Github Repo
https://github.com/shielsr/final-project

## Documentation
1. [View setup instructions](setup.md)

2. [View Documentation](documentation.md)


## Project goal
The goal of the project is to allow writers to post 'fan fiction' stories about their favourite TV shows, films, books, etc.

## Features
### As a writer, the user can:
- Register, log in and out
- Write and edit stories
- Add chapters to their stories
- Publish and unpublish their stories
- Receive direct messages from other users

### As a reader, the user can:
- Register, log in and out
- Read stories from other users
- Send direct messages to authors

<br>
<br>



# Instructions on how to use the site

<br>

## Navbar

The navbar is responsive on desktop and mobile.

The buttons change based on logged-in status.

The buttons also change based on the user's role. Admins (i.e. 'staff' users in the `auth_user` table) can access the Django Admin dashboard.


<br>

## Register

Users can register via the form on /register.

Their passwords are hashed in the database. 

Once they fill out the form, they are directed to /login, where they can enter their new credentials.

<br>

## Logging into admin

To access the admin dashboard, use the username rob and password 13546cb6e3c7f9ce8af4e0033760d95f (I've only included the password here in this zip, not in the Github readme)


<br>

## Homepage story list

The homepage shows a list of all the published stories.

<br>

## Writing stories

Logged-in users click 'New story' in the nav bar or 'Write a new story' in the Actions sidebar to open the form.

They fill out the form and submit it.

On the story detail page, the user can add chapters, edit their story, delete their story, or publish it as is.

<br>

## Adding chapters

Writers click 'Add new chapter'. This takes them to a form, where they can write their story.

<br>

## Drag and drop chapter reorder

On the story detail page on desktop, users can change the order of their chapters. Simply drag and drop the handles by the chapter names.

<br>

## Draft stories

Draft stories don't appear on the homepage. To find your draft story again, go to your account page at /profile and scroll to the bottom.

<br>

## Delete a story

On the story detail page, click 'Delete story'. The user will be taken to a confirmation page.

<br>

##  View my account

Logged-in users can see their account on the /profile page

They can edit their details or change the default profile pic here.

<br>

## Sending messages

Users can send messages to writers.

Go to the story detail page of a story written by a different user.

Click 'Message the author' and fill out the form.

<br>

## Receiving messages

Users can see messages they've received by clicking 'Mailbox' in the navbar

<br>

## Archived messages

Messages can be archived from the Mailbox.

Archived messages can then be seen in the private mails/archived page.
