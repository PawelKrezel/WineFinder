from django.db import models
import uuid

# Create your models here.
class Slot(models.Model):
    id = models.CharField(
        max_length=20,
        primary_key=True,
        help_text="follows column-row-shelf format, for example 2-1-s1 means column 2, row 1, first shelf"
    )
    occupied = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"{self.id} occupied:{self.occupied}"

class Wine(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    name = models.CharField(max_length=255)
    grape = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    vintage = models.PositiveIntegerField(null=False, default=2020)

    BODY_CHOICES = [
        ('light-body', 'Light Body'),
        ('medium-body', 'Medium Body'),
        ('full-body', 'Full Body'),
    ]
    TANNIN_CHOICES = [
    ('light-tannin', 'Light Tannin'),
    ('medium-tannin', 'Medium Tannin'),
    ('full-tannin', 'Full Tannin'),
    ]
    ACIDITY_CHOICES = [
        ('low-acidity', 'Low Acidity'),
        ('medium-acidity', 'Medium Acidity'),
        ('high-acidity', 'High Acidity'),
    ]
    GLASS_CHOICES = [
        ('Standard', 'Standard'),
        ('Burgundy', 'Burgundy'),
        ('Bordeaux', 'Bordeaux'),
        ('Flute', 'Flute'),
        ('Tst', 'Tasting glass')
    ]
    CORAVIN_CHOICES = [
        ('Yes', 'Needs to be Coravined'),
        ('No', 'No Need to Coravin')
    ]
    BTL_ONLY_CHOICES = [
        ('Yes', 'Only by the Bottle'),
        ('No', 'Available by the Glass/Carafe')
    ]
    
    body = models.CharField(max_length=15,choices=BODY_CHOICES)
    tannin = models.CharField(max_length=15, choices=TANNIN_CHOICES)
    acidity = models.CharField(max_length=15, choices=ACIDITY_CHOICES)
    glass = models.CharField(max_length=15, choices=GLASS_CHOICES)
    coravin = models.CharField(max_length=15, choices=CORAVIN_CHOICES)
    btl_only = models.CharField(max_length=15, choices=BTL_ONLY_CHOICES)

    sommNotes = models.TextField(blank=True)
    image = models.ImageField(upload_to="wine_images/", blank=True)

    shelves = models.ManyToManyField(
        Slot,
        related_name="wines",
        blank=True,
        help_text="Slots where this wine is stored."
    )

    def __str__(self):
        return f"{self.name} ({self.vintage or 'NV'})"
    
