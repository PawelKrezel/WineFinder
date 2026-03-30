from django.db import models
import uuid

# Create your models here.

class Wine(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    wine_name = models.CharField(max_length=255)
    grape = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    country_of_origin = models.CharField(max_length=100)
    vintage = models.PositiveIntegerField(null=False, default=2020)

    BODY_CHOICES = [
        ('light-body', 'Light Body'),
        ('medium-body', 'Medium Body'),
        ('full-body', 'Full Body'),
    ]
    TANNIN_CHOICES = [
        ('no-tannin', 'No/Very Low Tannin'),
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
        ('Standard', 'Standard Glass'),
        ('Burgundy', 'Burgundy Glass'),
        ('Bordeaux', 'Bordeaux Glass'),
        ('Flute', 'Flute Glass'),
        ('Tst', 'Tasting Glass')
    ]
    CORAVIN_CHOICES = [
        ('Yes', 'Needs to be Coravined'),
        ('No', 'No Need to Coravin')
    ]
    BTL_ONLY_CHOICES = [
        ('Yes', 'Only by the Bottle'),
        ('No', 'Available by the Glass/Carafe/Bottle')
    ]
    COLOUR_CHOICES = [
        ('Red', 'Red'),
        ('White', 'White'),
        ('Rose', 'Rosé'),
        ('Orange', 'Orange (skin contact)')
    ]
    
    body = models.CharField(max_length=15,choices=BODY_CHOICES)
    tannin = models.CharField(max_length=15, choices=TANNIN_CHOICES)
    acidity = models.CharField(max_length=15, choices=ACIDITY_CHOICES)
    glass = models.CharField(max_length=15, choices=GLASS_CHOICES)
    coravin = models.CharField(max_length=15, choices=CORAVIN_CHOICES)
    btl_only = models.CharField(max_length=15, choices=BTL_ONLY_CHOICES)
    colour = models.CharField(max_length=15, choices=COLOUR_CHOICES)

    sommNotes = models.TextField(blank=True, null=True)
    imageURL = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.wine_name} {self.grape} ({self.vintage})"
    
class Slot(models.Model):
    id = models.CharField(
        max_length=20,
        primary_key=True,
        help_text="follows column-row-shelf format, for example c2-r1-s1 means column 2, row 1, first shelf"
    )
    wine = models.ForeignKey(
        Wine,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="slots"
    )

    def __str__(self):
        if self.wine:
            return f"{self.id} -> {self.wine}"
        return f"{self.id} [unallocated]"