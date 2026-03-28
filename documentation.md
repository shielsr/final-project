# Documentation

## User stories

### Personas
* Songwriters
* Co-writers

### Songwriter user stories:

#### Recording:
[MUST] As a songwriter, I want to record voice notes quickly and easily, so I can capture any ideas for songs before I forget them.

#### Categorisation:
[MUST] As a songwriter, I want to add category tags to my voice notes, so I’ll know what’s in the files without having to play them back.

#### Create projects:
[MUST] As a songwriter, I want to group audio files into song projects, so I can better keep track of related files.

#### Text transcripts:
[MUST] As a songwriter, I want to automatically transcribe audio into text, so I can read through the contents of an audio file..

#### Search transcripts:
[MUST] As a songwriter, I want to do a text search of audio file transcripts, so I can easily find lyric ideas in my files.

#### Search metadata:
[MUST] As a songwriter, I want to search file and project metadata, so I can easily find files and projects.

#### Add co-writers:
[MUST] As a songwriter, I want to add other users to my projects, so I can collaborate with other writers.

<br>

### Co-writer user stories:

#### Get added to projects
[MUST] As a co-writer, I want to be added to projects, so I can collaborate on songs with my peers

#### Add my files to another user's project
[MUST] As a co-writer, I want to add my files to another user's project, so I can contribute ideas to a song.

#### Search projects
[MUST] As a co-writer, I want to search within all projects I am involved in, so I can easily find what I want in projects I own and am a co-writer in.

<br>

### Future stories:

#### Share links:
[SHOULD] As a songwriter, I want to generate share links to my projects, so I can solicit feedback from colleagues.

#### Add comments:
[SHOULD] As a songwriter, I want to comment on audio files, so I can give feedback to other writers.

#### Listener access:
[SHOULD] As a listener, I want to access limited project views, so I can listen to audio sent by other users.

#### Comment as a listener:
[SHOULD] As a listener, I want to comment on projects, so I can give feedback to other users.


## Content

## Wireframes

I created basic wireframes in Figma for mobile and desktop, with the mobile layout responsively catering for tablets too.

<br>
<br>

# My development process
## How I went about it

The following is a step-by-step account of how I did the project, which closely corresponds with the series of commits I made to the repo.

- I began by experimenting with React. I followed Yoni's tutorials from Module 5 to set things up.
- I followed the YouTube tutorial here to create a Recorder component: https://www.youtube.com/watch?v=cG5G0DcTSGI
- Set up the timer and the record/stop button switching
- Set up MediaRecorder API. Successfully recorded audio in browser.
- Read documentation on Assembly AI, the speech-to-text API.
- Installed Assembly AI npm package.
- Successfully sent my recorded audio file to Assembly and got back a transcription.
- Once I did the above prototype, I switched my attention to Django and installed Django.
- Followed Yoni's REST tutorial from the Frameworks module to set up Django REST in backend folder.
- Followed Unit 15 tutorial to set up the frontend-static.
- Set up the proper frontend, then connected the frontend and backend.
- Completed part 4, building for production. Tried deploying to Render (wasn't successful yet).
- Started moving my Recorder and Transcriber components over from my test app.
- Had to install things like react-icons for the above components to work.
- Connected to Cloudinary. Read tutorials on Cloudinary Docs: https://cloudinary.com/documentation/upload_images_with_fetch_api_tutorial
- Can allow the user to save their audio files to Cloudinary.
- Created all database models including Project and Cowriter.
- Captured filesize data of the blob from MediaRecorerAPI and added it to the Audio model.
- Updated Modal.jsx component to show metadata on the audio file
- Set up Authentication, following the tutorial from Unit 16.
- Used the React Router to set up my first two pages, Home.jsx and Record.jsx
- Created an AudioDetail.jsx page, to replace the Reactstrap modal.
- Removed redundant folders (frontend-static and my-react-test).
- Added error messaging when audio can't be found on AudioDetail page.
- Pulling the audio transcriptions into the AudioDetail page.
- Added 'creator' data to the Audio model.
- Assigned the logged-in user to the new audio (involving JWTAuthentication, the axios interceptor, etc).
- Rewrote the queryset request filter, so that only the files created by the current user are listed.
- Began setting up the Projects. Followed the same process as creating audio.
- Created pages for listing projects, creating new ones and a project detail page.
- Added a Projects select dropdown to the audio detail pages, so the user can assign an audio file to a project.
- The Record page was very cluttered and the code was messy so I split it in two: AudioList.jsx and Record.jsx. I did this in a branch for safety.
- Tidied up the Recorder component, as it was largely the initial prototype and had some redundant code.
- Cowriters can be added to projects.
- Began work on the Categories. Started with add category tags on the Audio detail page.
- After an ordeal I successfully deployed the web service and postgres to Render.
- I installed Shadcn to improve the appearance of the app.
- Finished writing all uniittests for my models.
- Created a very basic profile page, using the SongwriterProfile model that I created at the very beginning.
- As a bonus feature, I created a Search page that queries the audio file metadata, project metadata and transcriptions.
- As a final bonus feature, I added filters to the Audio List page, which used the same category tags as used on the Audio Detail pages.
- I sent the app out to friends and family for user testing.
- Fixed bugs found in user testing, e.g. the cowriter's files not being accessible to the project owner.
- Fixed bug where the Profile page changes weren't saving.
- Fixed the page refresh bug, where refreshing the page would send the user to the /login page.
- Addressed a bug with the Transcriber component. See below for full explanation.

<br>
<br>

# Project Details

## 1. Application structure
### Backend Framework
I followed Yoni's lessons to set up the Django framework.

### Database
I initially worked locally with SQLite, and when deploying I changed the database to Postgres. 

At the planning stage, these are the tables and relationships I mapped out:

Tables:
* User (out-of-the-box Django user table)
* SongwriterProfile
* Audio
* Project
* CoWriter
* Transcription
* Category

<br>

Relationships:

User -       one to one - SongwriterProfile

Songwriter 	-	one to many - Project

Project -	one to many - CoWriter

Project -	one to many - Audio

Audio	-	one to one - Transcription

Audio 	-	one to many - Category

Project	-	one to many	- ProjectTag

<br>

### Frontend

I built the frontend in React.

For styling, I initially prototyped with Reactstrap, and switched to Shadcn later in development.

<br>

## 2. Core features

### The flow of data when recording and transcribing
It look a lot of work to get the MediaRecording API, Cloudinary and AssemblyAI all working in harmony. This is how the flow works.

#### Recording
- User records audio -> blob created in React using MediaRecording API
- Blob is uploaded to Cloudinary -> URL returned
- Cloudinary URL is saved to Django Audio model

#### Transcribing
- The user clicks Transcribe -> React sends the Cloudinary URL and audio_id to Django
- Django gives the Cloudinary URL to AssemblyAI
- AssemblyAI transcribes the audio stream from Cloudinary and returns the text
- Django saves the text to the Transcription model and returns it to React

#### Or to put it more simply:
Record audio in the browser
Upload to Cloudinary
Save Cloudinary URL to Django
Transcribe audio via AssemblyAI
Save the transcription back to Django


### The Audio/Project relationship
I wanted users to be able to record without having to add it to a project. It's all about convenience - a user should be able to record audio on the go, then return to it later to assign it to a project (if they want). Also, when a project is deleted, the audio files are not be deleted; they return to the unassigned pool.

### Audio metadata
I wanted to show audio metadata in a few places. The duration and file size are saved in seconds and bytes, so need to be formatted. I wrote standard JS to format them, and to make the formatters available to all components I created a utils/metadata.js file.

### Sasdf


### The Projects feature
I followed the patterns of creating audio for creating projects. This roughly involved:
1. Added Project API calls for all CRUD operations to utils/api.js. 
2. In api.js, instead of having 2 interceptors for audio and projects, I used one (called 'attachToken') for both (The interceptor relates to linking a logged in user with an audio file or project).
3. Added a new route to App.jsx
4. Created pages/Projects.jsx to list all the projects
5. Created pages/ProjectsNew.jsx for creating new projects
6. Created project detail page

### Tidy up apis
My initial API for the audio files endpoint was just called `api`. When I eventually had projectApi and transcriptionApi, having one just called api looked confusing. So, I went back and renamed it to audioApi for clarity.

### Recorder component
This started as my prototype, seeing if the MediaRecorder API, Cloudinary and Assembly AI would work together. As the project developed, a lot of the code in the Recorder became redundant. It made more sense to keep the Recorder component purely for recording, and to redirect the user to an AudioDetail page to enter metadata. This kept the component clean and tidy.




### PageTitle component
I wanted to give every page a ``<title>`` which would also double as the page's H1 title. I thought a small component would be handy here.

<br>
<br>

# Challenges faced

## Authentication
I followed the Unit 16 tutorial so it largely went smoothly. A challenge I encountered invovled my already having an /api/ url pattern from the earlier audio part. I had to use /api/auth/ instead and updated the tutorial code accordingly. I obviously wouldn't have encountered this if I had done the Authentication before doing the audio recording component, so will know for future projects.

## Moving AssemblyAI API call from React to Django
I built the original prototype fully in React. This included the transcription API call to AssemblyAI. On Yoni's advice, I moved it from React to Django. This avoided security concerns.

## Audio files and their creator
When trying to assign and filter audio by the logged-in user, I kept getting 500 errors. It turned out Django couldn't tell who was logged in. To fix it I did the following:

1. Switched from DebugDisableAuthentication to JWTAuthentication in views.py
2. Added an axios interceptor in utils/api.js that reads the JWT token from localStorage and attaches it to every API request as an Authorization header
3. Switched the fetch() in AudioDetail.jsx to the axios api instance. The token gets sent there too.
4. Added perform_create to AudioView so the logged-in user/creator is automatically assigned to each new file.
5. Updated the queryset request in AudioView to filter for audio files created by the logged-in user (or files they're co-writer on).

## Deploying to Render
I followed the Unit 11 deployment instructions, but it didn't seem to cover the React side of things.

In a case of terrible timing, Render switched off their community forums on March 24th (the day I started trying to deploy) so any relevant information in the forums was gone.

I went around in circles and found a series on YouTube: https://www.youtube.com/watch?v=t8tkHO4Hi4U&list=PLmEKHA8iFrmDpiqMsEXowUz7-G2RCOyfr&index=3

I spent hours hitting various walls. One was with "vite: Permission denied". The problem was addressed in the Render forums (based on Google searches) but the pages were gone. I found this reference to the dead forum link: https://www.reddit.com/r/vercel/comments/1i9rur8/permission_denied_while_deploying_vite_app_on/

I hit issues around file case. At some point, I must have changed my lowercase component filenames to title case (from recorder to Recorder). GIthub didn't update though. Had to force a rename of the files in github.

Eventually I gave up and went back to the course videos. It turns out Yoni explained the approach of static files in Unit 15 (from around 48 minutes on), which I watched at the time but forgot about. Once I followed that, it was relatively plain sailing.

## Processing issue with Assembly AI
A user tester encountered a bug when transcribing audio. They pressed the Transcribe button, and then received the error message ``Unexpected token '<', "<html> <"... is not valid JSON``. They pressed the button again and it worked.

I initially thought it was a problem with my code. I then checked the logs in Assembly AI. It turned out that the transcription requests (the failed attempt and the successful one) both went through fine. However, the first one took 52 seconds while the second one took 5 seconds.

The problem was to do with timeouts. 52 seconds is beyond the standard 30 seconds that Render allows before timing out.

Lengthy processing time is a risk associated with using the free tier of Assembly, i.e. activity on the free tier is less of a priority for their servers.  Possible ways of addressing this:
- Increase the wait time on Render from the current 30 seconds.
- Pay for an Assembly subscrption (which I don't believe is necessary for the purposes of this project)
- Add error handling to give proper feedback to the user.

For future development, I would address the issue with one (or more) of the above options.

## Adding a co-writer

My approach to adding a co-writer here is not ideal. It exposes all usernames, which is fine for this college project, but in a real-world app it's not scaleable. Ideally, I would allow co-writers to be added via email - they recieve the invite, accept and create an account. But, given time constraints, I will stick to the dropdown for now.

Adding a co-writer also opened up a lot of permissions issues that I hadn't planned for. A co-writer:
- Shouldn't be able to delete a project they were invited to
- Shouldn't be able to remove the owner from a project
- Shouldn't be able to delete/remove an audio file

I eventually implemented all of the above.

<br>
<br>

# Future features

Future features I would work on next include:

## Pagination
On the audio list and project list pages.

## Shareable public link
This was part of my original plan, but I felt that the Songwriter/Co-writer roles and the related permissions covered the roles requirements for this project. It is something I would return to for future development. 

## Adding co-writers
The co-writer select dropdown that I've implemented on the Project Detail page is a 'proof of concept' rather than the ideal setup. I would like to build an 'Invite a co-writer' email system, where users could send email invitations to others. This would avoid my current setup of simply listing all available users, which is not scaleable and has obvious privacy issues.

<br>
<br>


My To Do:
DONE - Show transcriptions in audio detail page
DONE - Make sure files are assigned to users
DONE - Create projects
DONE - Set up projectDetail pages, showing metadata and the assigned audio files
DONE - Split recording and file list into separate pages
DONE - Tidy up the Recorder component
DONE - Add co-writers to a project
DONE - Add permissions for cowriters
DONE - I still have to figure out how to do categorization. I need a category model
DONE - Add testing for all models
DONE - Spruce up how it all looks (the UI, I mean)
DONE - Add page titles
DONE - Profile page
- Use Ruff linter
- Documentation
DONE - Add docstrings to models
DONE - Create postgres in Render
DONE - Deploy successfully
DONE - Give feedback when Login and Register buttons are pressed
DONE - Bonus: Search transcripts
- Bonus: Share projects with the public




