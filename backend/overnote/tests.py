from django.test import TestCase
from django.contrib.auth.models import User
from .models import SongwriterProfile, Project, Category, Audio, CoWriter, Transcription


class SongwriterProfileTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.profile = SongwriterProfile.objects.create(
            user=self.user,
            bio='I write songs',
            website='https://example.com'
        )

    def test_profile_creation(self):
        # Checks the profile was saved with the correct fields
        self.assertEqual(self.profile.bio, 'I write songs')
        self.assertEqual(self.profile.website, 'https://example.com')

    def test_profile_str(self):
        # Checks __str__ returns "<username>'s profile"
        self.assertEqual(str(self.profile), "testuser's profile")

    def test_profile_linked_to_user(self):
        # Checks the OneToOneField links correctly to the user
        self.assertEqual(self.profile.user, self.user)

    def test_profile_deleted_when_user_deleted(self):
        # Checks CASCADE — deleting the user also deletes their profile
        self.user.delete()
        self.assertEqual(SongwriterProfile.objects.count(), 0)


class ProjectModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.project = Project.objects.create(
            owner=self.user,
            title='Test Project',
            description='A test project'
        )

    def test_project_creation(self):
        # Checks the project was saved with the correct fields
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.description, 'A test project')

    def test_project_str(self):
        # Checks __str__ returns the project title
        self.assertEqual(str(self.project), 'Test Project')

    def test_project_owner(self):
        # Checks the owner ForeignKey is set correctly
        self.assertEqual(self.project.owner, self.user)

    def test_default_title(self):
        # Checks that 'my project' is used when no title is provided
        project = Project.objects.create(owner=self.user)
        self.assertEqual(project.title, 'my project')

    def test_cowriters_empty_by_default(self):
        # Checks a new project has no cowriters
        self.assertEqual(self.project.cowriters.count(), 0)

    def test_add_cowriter(self):
        # Checks that a cowriter can be added via the CoWriter through model
        cowriter = User.objects.create_user(username='cowriter', password='testpass123')
        CoWriter.objects.create(project=self.project, user=cowriter)
        self.assertIn(cowriter, self.project.cowriters.all())

    def test_project_deleted_when_owner_deleted(self):
        # Checks CASCADE — deleting the owner also deletes their projects
        self.user.delete()
        self.assertEqual(Project.objects.count(), 0)


class CategoryModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Verse', group='section')

    def test_category_creation(self):
        # Checks the category was saved with the correct fields
        self.assertEqual(self.category.name, 'Verse')
        self.assertEqual(self.category.group, 'section')

    def test_category_str(self):
        # Checks __str__ returns the category name
        self.assertEqual(str(self.category), 'Verse')

    def test_category_group_choices(self):
        # Checks that both valid group choices work
        type_category = Category.objects.create(name='Melody', group='type')
        self.assertEqual(type_category.group, 'type')


class AudioModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.audio = Audio.objects.create(
            creator=self.user,
            title='Test Recording',
            description='A test recording',
            duration=120,
            url='https://cloudinary.com/test.mp3',
            file_size=1024
        )

    def test_audio_creation(self):
        # Checks the audio was saved with the correct fields
        self.assertEqual(self.audio.title, 'Test Recording')
        self.assertEqual(self.audio.duration, 120)
        self.assertEqual(self.audio.file_size, 1024)

    def test_audio_str(self):
        # Checks __str__ returns the audio title
        self.assertEqual(str(self.audio), 'Test Recording')

    def test_audio_creator(self):
        # Checks the creator ForeignKey is set correctly
        self.assertEqual(self.audio.creator, self.user)

    def test_default_title(self):
        # Checks that 'my audio' is used when no title is provided
        audio = Audio.objects.create(creator=self.user, url='https://cloudinary.com/test.mp3')
        self.assertEqual(audio.title, 'my audio')

    def test_audio_no_project_by_default(self):
        # Checks that audio has no project assigned by default
        self.assertIsNone(self.audio.project)

    def test_audio_assign_to_project(self):
        # Checks that audio can be assigned to a project
        project = Project.objects.create(owner=self.user, title='My Project')
        self.audio.project = project
        self.audio.save()
        self.assertEqual(self.audio.project, project)

    def test_audio_project_set_null_when_project_deleted(self):
        # Checks SET_NULL — deleting a project doesn't delete the audio,
        # it just sets the project field to null
        project = Project.objects.create(owner=self.user, title='My Project')
        self.audio.project = project
        self.audio.save()
        project.delete()
        self.audio.refresh_from_db()
        self.assertIsNone(self.audio.project)

    def test_audio_add_category(self):
        # Checks that a category can be added to an audio file
        category = Category.objects.create(name='Verse', group='section')
        self.audio.categories.add(category)
        self.assertIn(category, self.audio.categories.all())

    def test_audio_categories_empty_by_default(self):
        # Checks a new audio file has no categories
        self.assertEqual(self.audio.categories.count(), 0)


class CoWriterModelTest(TestCase):

    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='testpass123')
        self.cowriter = User.objects.create_user(username='cowriter', password='testpass123')
        self.project = Project.objects.create(owner=self.owner, title='Test Project')
        self.cowriter_entry = CoWriter.objects.create(
            project=self.project,
            user=self.cowriter,
            role='Lyricist'
        )

    def test_cowriter_creation(self):
        # Checks the CoWriter entry was created correctly
        self.assertEqual(self.cowriter_entry.user, self.cowriter)
        self.assertEqual(self.cowriter_entry.project, self.project)
        self.assertEqual(self.cowriter_entry.role, 'Lyricist')

    def test_cowriter_str(self):
        # Checks __str__ returns "<username> on <project title>"
        self.assertEqual(str(self.cowriter_entry), 'cowriter on Test Project')

    def test_cowriter_deleted_when_project_deleted(self):
        # Checks CASCADE — deleting a project deletes its CoWriter entries
        self.project.delete()
        self.assertEqual(CoWriter.objects.count(), 0)

    def test_cowriter_deleted_when_user_deleted(self):
        # Checks CASCADE — deleting a user deletes their CoWriter entries
        self.cowriter.delete()
        self.assertEqual(CoWriter.objects.count(), 0)


class TranscriptionModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.audio = Audio.objects.create(
            creator=self.user,
            title='Test Recording',
            url='https://cloudinary.com/test.mp3'
        )
        self.transcription = Transcription.objects.create(
            audio=self.audio,
            content='This is a test transcription'
        )

    def test_transcription_creation(self):
        # Checks the transcription was saved with the correct content
        self.assertEqual(self.transcription.content, 'This is a test transcription')

    def test_transcription_str(self):
        # Checks __str__ returns "Transcription for <audio title>"
        self.assertEqual(str(self.transcription), 'Transcription for Test Recording')

    def test_transcription_linked_to_audio(self):
        # Checks the OneToOneField links correctly to the audio
        self.assertEqual(self.transcription.audio, self.audio)

    def test_transcription_deleted_when_audio_deleted(self):
        # Checks CASCADE — deleting the audio also deletes its transcription
        self.audio.delete()
        self.assertEqual(Transcription.objects.count(), 0)

    def test_audio_can_only_have_one_transcription(self):
        # Checks the OneToOne constraint — a second transcription for the
        # same audio should raise an error
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Transcription.objects.create(
                audio=self.audio,
                content='Duplicate transcription'
            )