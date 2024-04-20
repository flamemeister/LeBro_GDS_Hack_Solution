from django.db import models

class Attraction(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    historical_cultural_significance = models.TextField()
    working_hours = models.CharField(max_length=100)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    address = models.CharField(max_length=255)
    public_transport_routes = models.TextField()
    admin_contact = models.CharField(max_length=100)
    keywords = models.TextField(blank=True, help_text="Enter keywords describing the attraction, separated by commas.")

    def __str__(self):
        return self.name
