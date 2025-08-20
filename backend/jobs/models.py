from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    skills = models.TextField()
    link = models.URLField()

    def __str__(self):
        return f"{self.title} at {self.company}"
