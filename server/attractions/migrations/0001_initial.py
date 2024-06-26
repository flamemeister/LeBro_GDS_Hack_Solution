# Generated by Django 4.1.13 on 2024-04-20 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attraction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('historical_cultural_significance', models.TextField()),
                ('working_hours', models.CharField(max_length=100)),
                ('ticket_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('address', models.CharField(max_length=255)),
                ('public_transport_routes', models.TextField()),
                ('admin_contact', models.CharField(max_length=100)),
                ('keywords', models.TextField(blank=True, help_text='Enter keywords describing the attraction, separated by commas.')),
            ],
        ),
    ]
