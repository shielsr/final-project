# My development process
## How I went about it

The following is a step-by-step account of how I did the project, which closely corresponds with the series of commits I made to the repo.

- I began by experimenting with React. I followed Yoni's tutorials from Module 5 to set things up.
- I followed the YouTube tutorial here to create a Recorder component: https://www.youtube.com/watch?v=cG5G0DcTSGI
- Set up the timer and the record/stop button switching
- Set up MediaRecorder API. Successfully recorded audio in browser.
- Read documentation on Assembly AI, the speech-to-text API
- Installed Assembly AI npm package
- Successfully sent my recorded audio file to Assembly and got back a transcription.
- Once I did the above prototype, I switched my attention to Django and installed Django.
- Followed Yoni's REST tutorial from the Frameworks module to set up Django REST in backend folder
- Followed Unit 15 tutorial to set up the frontend-static
- Set up the proper frontend, then connected the frontend and backend
- Completed part 4, building for production. Tried testing on Render (couldn't do it yet)
- Started moving my Recorder and Transcriber components over from my test app
- Had to install things like react-icons for the above to components to work
- Connected to Cloudinary API. Read tutorials on Cloudinary Docs: https://cloudinary.com/documentation/upload_images_with_fetch_api_tutorial
- Can allow the user to save their audio files to Cloudinary
- Set up more database tables
- Captured filesize data of the blob from MediaRecorerAPI and added it to the Audio model
- Also added Project to the Audio model, to assign the file to a project
- Updated Modal.jsx component to show metadata on the audio file
- Added Cowriter table to db
- Set up Authentication, following the tutorial from Unit 16.
- Used the React Router to set up my first two pages, Home.jsx and Record.jsx
- Created an AudioDetail.jsx page, to replace the Reactstrap modal.
- Removed redundant folders (frontend-static and my-react-test)
- Added error messaging when audio can't be found on AudioDetail page
- Pulling the audio transcriptions into the AudioDetail page
- Added 'creator' data to the Audio model. 
- Assigned the logged-in user to the new audio (involving JWTAuthentication, the axios interceptor, etc)
- Rewrote the queryset request filter, so that only the files created by the current user are listed
- Began setting up the Projects. Followed the same process as creating audio
- Created pages for listing projects, creating new ones and a project detail page.
- Added a Projects select dropdown to the audio detail pages, where the user can assign an audio file to a project
- The Record page was quite cluttered, so I split the list of audio file off into its own page, AudioList.jsx

Brainstorming name ideas:

NoteCat
NoteCap
Barinote
Sopranote
Undernote


Tables

## Project
An important part of the Audio/Project relationship was that I want users to record something without adding it to a project. Again, it's all about convenience - a user should be able to come back later and assign the file to a project (if they want). Also, when a project is deleted, the audio files should not be deleted, and just return to the unassigned pool.

# Audio metadata
I wanted to show audio metadate in a few places. The duration and file size are saved in seconds and bytes, so need to be formatted. I wrote standard JS to format them, and to make the formatters available to all components I created a utils/metadata.js file.

# Moving AssemblyAI API call from React to Django
I built the original prototype full in React. This included the transcription API call to AssemblyAI. On Yoni's advice, I moved it from React to Django. This avoided security concerns. It was a major hassle. I returned to the AssemblyAI docs. Set up console logs to track where things were failing.

# Authentication
I followed the Unit 16 tutorial so it largely went smoothly. A challenge I encountered invovled my already having an /api/ url pattern from the earlier audio part. I had to use /api/auth/ instead and update the tutorial code accordingly. I obviously wouldn't have encountered this if I had done the Authentication before doing the audio recording component, so will know for future projects.

# Audio files and their creator
When trying to assign and filter audio by the logged-in user, I kept getting 500 errors. It turned out Django couldn't tell who was logged in. To fix it I did the following:

1. Switched from DebugDisableAuthentication to JWTAuthentication in views.py
2. Added an axios interceptor in utils/api.js that reads the JWT token from localStorage and attaches it to every API request as an Authorization header
3. Switched the fetch() in AudioDetail.jsx to the axios api instance. The token gets sent there too
4. Added perform_create to AudioView so the logged-in user/creator is automatically assigned to each new file
5. Updated the queryset request in AudioView to filter for audio files created by the logged-in user (or files they're co-writer on)


# Projects
I followed the patterns of creating audio for creating projects. This roughly involved:
1. Project API calls for all CRUD operations added to the utils/api.js. 
2. In api.js, instead of having 2 interceptors for audio and projects, I used one (called 'attachToken') for both (The interceptor relates to linking a logged in user with an audio file or project).
3. Added a new route to App.jsx
4. Created pages/Projects.jsx to list all the projects
5. Created pages/ProjectsNew.jsx for creating new projects
6. Created project detail page

# Transcription issues
- The button! Finally got it to disappear after the transcription.
- The endpoint.

# Tidy up apis
My initial API for the audio files endpoint was just called `api`. When I eventually had projectApi and transcriptionApi, having one just called api looked confusing. So, I went back and renamed it to audioApi for clarity.


## The flow of data when recording and transcribing

- User records audio -> blob created in React using MediaRecording API
- Blob is uploaded to Cloudinary -> URL returned
- URL saved to Django Audio model
- User clicks Transcribe -> React sends the Cloudinary URL and audio_id to Django
- Django gives the URL to AssemblyAI
- AssemblyAI transcribes it and returns the text
- Django saves the text to the Transcription model and returns it to React

Or to put it more simply:
Record audio in the browser
Upload to Cloudinary
Save metadata to Django
Transcribe via AssemblyAI through Django
Save the transcription back to Django


Rob Cleary's recommendation for including more JS:
In main interface:
Click recording
Access js recording object with transcribe content
The transcription is stored locally in the js object for continuous access


My To Do:
DONE - Show transcriptions in audio detail page
DONE - Make sure files are assigned to users
DONE - Create projects
DONE - Set up projectDetail pages, showing metadata and the assigned audio files
- Add co-writers to a project
- Split recording and file list into separate pages
- I still have to figure out how to do categorization. I need a category model
- Add testing for all models
- Add testing for React components
- Spruce up how it all looks (the UI, I mean)
- Add page titles
- Use the linter
- Create postgres in Render
- Deploy successfully
- Bonus: Search transcripts