---
title: "Django Patterns"
description: "Guides Kiro to write Django applications following best practices and conventions"
category: "frameworks"
tags: ["django", "python", "orm", "views", "models"]
inclusion: always
version: "1.0.0"
---

## Core Principle

**Kiro writes clean, maintainable Django applications using Django conventions and best practices.** This steering document ensures Django projects are well-structured, secure, and follow the framework's philosophy.

## How Kiro Will Write Django Applications

### Project Structure

**Standard Django layout**: Organized apps and settings

```python
# Kiro will write:
# myproject/
#   manage.py
#   myproject/
#     __init__.py
#     settings.py
#     urls.py
#     wsgi.py
#   users/
#     __init__.py
#     models.py
#     views.py
#     urls.py
#     serializers.py
#     admin.py
#     tests.py
#   posts/
#     __init__.py
#     models.py
#     views.py
#     urls.py
#     admin.py

# Not:
# myproject/
#   app.py
#   models.py
#   views.py
#   everything_in_one_place.py
```

### Model Definitions

**Clear model structure**: Proper field types and relationships

```python
# Kiro will write:
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    """Custom user model with additional fields."""
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username

    def get_full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip() or self.username


class Post(models.Model):
    """Blog post model."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    tags = models.ManyToManyField('Tag', related_name='posts', blank=True)
    views = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status', '-published_at']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """Override save to auto-generate slug."""
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Tag model for categorizing posts."""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    class Meta:
        db_table = 'tags'
        ordering = ['name']

    def __str__(self):
        return self.name

# Not:
class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author_id = models.IntegerField()
    created = models.DateTimeField()
    
    def __str__(self):
        return self.title
```

### View Patterns

**Class-based views**: Use Django's generic views

```python
# Kiro will write:
# views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Post
from .forms import PostForm

class PostListView(ListView):
    """Display list of published posts."""
    model = Post
    template_name = 'posts/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10

    def get_queryset(self):
        """Filter to only show published posts."""
        return Post.objects.filter(status='published').select_related('author')

    def get_context_data(self, **kwargs):
        """Add additional context."""
        context = super().get_context_data(**kwargs)
        context['total_posts'] = self.get_queryset().count()
        return context


class PostDetailView(DetailView):
    """Display single post detail."""
    model = Post
    template_name = 'posts/post_detail.html'
    context_object_name = 'post'

    def get_queryset(self):
        """Optimize query with related data."""
        return Post.objects.select_related('author').prefetch_related('tags')

    def get_object(self, queryset=None):
        """Increment view count when post is viewed."""
        obj = super().get_object(queryset)
        obj.views += 1
        obj.save(update_fields=['views'])
        return obj


class PostCreateView(LoginRequiredMixin, CreateView):
    """Create new post."""
    model = Post
    form_class = PostForm
    template_name = 'posts/post_form.html'
    success_url = reverse_lazy('post-list')

    def form_valid(self, form):
        """Set the author to the current user."""
        form.instance.author = self.request.user
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    """Update existing post."""
    model = Post
    form_class = PostForm
    template_name = 'posts/post_form.html'

    def test_func(self):
        """Only allow author to edit their own posts."""
        post = self.get_object()
        return self.request.user == post.author

    def get_success_url(self):
        """Redirect to post detail after update."""
        return reverse_lazy('post-detail', kwargs={'pk': self.object.pk})


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    """Delete post."""
    model = Post
    template_name = 'posts/post_confirm_delete.html'
    success_url = reverse_lazy('post-list')

    def test_func(self):
        """Only allow author to delete their own posts."""
        post = self.get_object()
        return self.request.user == post.author

# Not:
def post_list(request):
    posts = Post.objects.all()
    return render(request, 'posts.html', {'posts': posts})

def post_detail(request, id):
    post = Post.objects.get(id=id)
    return render(request, 'post.html', {'post': post})
```

### URL Configuration

**Clear URL patterns**: RESTful URL structure

```python
# Kiro will write:
# urls.py
from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('create/', views.PostCreateView.as_view(), name='post-create'),
    path('<int:pk>/edit/', views.PostUpdateView.as_view(), name='post-update'),
    path('<int:pk>/delete/', views.PostDeleteView.as_view(), name='post-delete'),
    path('tag/<slug:slug>/', views.PostsByTagView.as_view(), name='posts-by-tag'),
]

# project urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('posts/', include('posts.urls')),
    path('users/', include('users.urls')),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Not:
urlpatterns = [
    path('post_list/', views.post_list),
    path('post/<int:id>/', views.post_detail),
    path('new_post/', views.create_post),
    path('edit_post/<int:id>/', views.edit_post),
]
```

### Forms

**Django forms**: Validation and cleaning

```python
# Kiro will write:
# forms.py
from django import forms
from django.core.exceptions import ValidationError
from .models import Post, Tag

class PostForm(forms.ModelForm):
    """Form for creating and updating posts."""
    tags = forms.ModelMultipleChoiceField(
        queryset=Tag.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = Post
        fields = ['title', 'content', 'status', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter post title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 10,
                'placeholder': 'Write your post content...'
            }),
            'status': forms.Select(attrs={'class': 'form-control'}),
        }

    def clean_title(self):
        """Validate title is not empty and unique."""
        title = self.cleaned_data.get('title')
        if not title or not title.strip():
            raise ValidationError('Title cannot be empty')
        
        # Check for duplicate titles (excluding current instance)
        qs = Post.objects.filter(title__iexact=title)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        
        if qs.exists():
            raise ValidationError('A post with this title already exists')
        
        return title.strip()

    def clean(self):
        """Validate form data."""
        cleaned_data = super().clean()
        status = cleaned_data.get('status')
        content = cleaned_data.get('content')

        if status == 'published' and not content:
            raise ValidationError('Published posts must have content')

        return cleaned_data

# Not:
class PostForm(forms.Form):
    title = forms.CharField()
    content = forms.CharField(widget=forms.Textarea)
    
    def clean(self):
        # All validation in one method
        pass
```

### Django REST Framework

**API views and serializers**: RESTful API patterns

```python
# Kiro will write:
# serializers.py
from rest_framework import serializers
from .models import Post, Tag, User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'bio', 'avatar']
        read_only_fields = ['id']


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model."""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model."""
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.all(),
        source='tags'
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'status',
            'author', 'tags', 'tag_ids', 'views', 'rating',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'views', 'created_at', 'updated_at']

    def validate_title(self, value):
        """Validate title."""
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty')
        return value.strip()

    def validate(self, data):
        """Validate serializer data."""
        if data.get('status') == 'published' and not data.get('content'):
            raise serializers.ValidationError({
                'content': 'Published posts must have content'
            })
        return data


# views.py (API)
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for Post model."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views', 'rating']
    ordering = ['-created_at']

    def get_queryset(self):
        """Optimize queryset with related data."""
        return Post.objects.select_related('author').prefetch_related('tags')

    def perform_create(self, serializer):
        """Set author to current user on create."""
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """Publish a draft post."""
        post = self.get_object()
        
        if post.status == 'published':
            return Response(
                {'detail': 'Post is already published'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.utils import timezone
        post.status = 'published'
        post.published_at = timezone.now()
        post.save()
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)

# Not:
@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all()
    data = [{'id': p.id, 'title': p.title} for p in posts]
    return Response(data)
```

### Admin Configuration

**Customized admin**: Enhanced admin interface

```python
# Kiro will write:
# admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Post, Tag

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Admin configuration for Tag model."""
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class PostTagInline(admin.TabularInline):
    """Inline admin for post tags."""
    model = Post.tags.through
    extra = 1


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin configuration for Post model."""
    list_display = ['title', 'author', 'status', 'views', 'created_at', 'status_badge']
    list_filter = ['status', 'created_at', 'author']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['views', 'created_at', 'updated_at']
    inlines = [PostTagInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'author', 'status')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Metadata', {
            'fields': ('views', 'rating', 'published_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        """Display colored status badge."""
        colors = {
            'draft': 'gray',
            'published': 'green',
            'archived': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related('author')

# Not:
admin.site.register(Post)
admin.site.register(Tag)
```

### Query Optimization

**Efficient queries**: Use select_related and prefetch_related

```python
# Kiro will write:
# views.py or managers.py
from django.db.models import Count, Avg, Q, Prefetch

class PostQuerySet(models.QuerySet):
    """Custom queryset for Post model."""
    
    def published(self):
        """Filter published posts."""
        return self.filter(status='published')
    
    def with_author(self):
        """Include author data."""
        return self.select_related('author')
    
    def with_tags(self):
        """Include tags data."""
        return self.prefetch_related('tags')
    
    def with_stats(self):
        """Annotate with statistics."""
        return self.annotate(
            tag_count=Count('tags'),
            avg_rating=Avg('rating')
        )
    
    def search(self, query):
        """Search posts by title or content."""
        return self.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )


class PostManager(models.Manager):
    """Custom manager for Post model."""
    
    def get_queryset(self):
        """Return custom queryset."""
        return PostQuerySet(self.model, using=self._db)
    
    def published(self):
        """Get published posts."""
        return self.get_queryset().published()
    
    def popular(self, limit=10):
        """Get most viewed posts."""
        return self.published().order_by('-views')[:limit]


# In models.py
class Post(models.Model):
    # ... fields ...
    
    objects = PostManager()

# Usage in views:
posts = Post.objects.published().with_author().with_tags().with_stats()

# Not:
posts = Post.objects.all()
for post in posts:
    author = post.author  # N+1 query
    tags = post.tags.all()  # N+1 query
```

## What This Prevents

- **N+1 query problems** from missing select_related/prefetch_related
- **Security vulnerabilities** from improper permission checks
- **Inconsistent code** from not following Django conventions
- **Poor performance** from unoptimized queries
- **Difficult maintenance** from mixing concerns
- **Admin interface limitations** from not customizing admin

## Simple Examples

### Before/After: Complete CRUD

```python
# Before:
def create_post(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        post = Post.objects.create(title=title, content=content, author_id=request.user.id)
        return redirect('/posts/')
    return render(request, 'form.html')

# After:
class PostCreateView(LoginRequiredMixin, CreateView):
    """Create new post."""
    model = Post
    form_class = PostForm
    template_name = 'posts/post_form.html'
    success_url = reverse_lazy('post-list')

    def form_valid(self, form):
        """Set the author to the current user."""
        form.instance.author = self.request.user
        return super().form_valid(form)
```

## Customization

This is a starting point for Django patterns. You can customize by:

- Adding different database backends (PostgreSQL, MySQL)
- Including caching strategies (Redis, Memcached)
- Adding celery for async tasks
- Incorporating different authentication methods

## Related Documents

- [Python Formatting](../../code-formatting/python-formatting.md) - Python conventions
- [Database Query Patterns](../../code-quality/database-query-patterns.md) - Query optimization

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### Django Development Tools (Optional)

```bash
# Django extensions
pip install django-extensions

# Code quality
pip install pylint django-stubs

# Testing
pip install pytest pytest-django factory-boy
```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
