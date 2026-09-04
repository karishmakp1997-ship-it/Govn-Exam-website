from django.contrib import admin
from .models import StudyMaterial

@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'material_type', 'subject', 'is_locked', 'is_featured', 'last_updated')
    list_filter = ('category', 'material_type', 'is_locked', 'is_featured')
    search_fields = ('title', 'subject')
    ordering = ('-last_updated',)