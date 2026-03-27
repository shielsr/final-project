from django.test import TestCase
from django.contrib.auth.models import User
from .models import Project, CoWriter

class ProjectModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.project = Project.objects.create(
            owner=self.user,
            title='Test Project',
            description='A test project'
        )

    def test_project_creation(self):
        # Checks the project was saved to the database correctly
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.description, 'A test project')

    def test_string_representation(self):
        # Checks that str(project) returns the title
        self.assertEqual(str(self.project), 'Test Project')

    def test_owner_is_set(self):
        # Checks the owner foreign key is correct
        self.assertEqual(self.project.owner, self.user)

    def test_default_title(self):
        # Checks the default title works when none is provided
        project = Project.objects.create(owner=self.user)
        self.assertEqual(project.title, 'my project')

    def test_add_cowriter(self):
        # Checks that a cowriter can be added to a project
        cowriter = User.objects.create_user(
            username='cowriter',
            password='testpass123'
        )
        CoWriter.objects.create(project=self.project, user=cowriter)
        self.assertIn(cowriter, self.project.cowriters.all())

    def test_cowriters_empty_by_default(self):
        # Checks a new project has no cowriters
        self.assertEqual(self.project.cowriters.count(), 0)