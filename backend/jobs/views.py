from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Job
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Read all jobs
def job_list(request):
    jobs = list(Job.objects.values())
    return JsonResponse(jobs, safe=False)

# Create job
@csrf_exempt
@require_http_methods(["POST"])
def create_job(request):
    data = json.loads(request.body)

    job = Job.objects.create(
        title=data.get("title", ""),
        company=data.get("company", ""),
        location=data.get("location", ""),
        skills=data.get("skills", ""),
        link=data.get("link", "#")
    )
    return JsonResponse({"message": "Job created", "id": job.id}, status=201)

# Update job
@csrf_exempt
@require_http_methods(["PUT"])
def update_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return JsonResponse({"error": "Job not found"}, status=404)

    data = json.loads(request.body)
    job.title = data.get("title", job.title)
    job.company = data.get("company", job.company)
    job.location = data.get("location", job.location)
    job.skills = data.get("skills", job.skills)
    job.link = data.get("link", job.link)
    job.save()

    return JsonResponse({"message": "Job updated"})

# Delete job
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        job.delete()
        return JsonResponse({"message": "Job deleted"})
    except Job.DoesNotExist:
        return JsonResponse({"error": "Job not found"}, status=404)


# Signup - Create
@csrf_exempt
@require_http_methods(["POST"])
def signup_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    return JsonResponse({"message": "User created", "id": user.id}, status=201)

# Login - Read
@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"message": "Login successful", "username": user.username})
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

# View / Update Profile
@csrf_exempt
@require_http_methods(["GET", "PUT"])
def user_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    if request.method == "GET":
        user = request.user
        return JsonResponse({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        })

    elif request.method == "PUT":
        data = json.loads(request.body)
        user = request.user
        user.email = data.get("email", user.email)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.save()
        return JsonResponse({"message": "Profile updated"})

# Delete - Delete
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_account(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    user = request.user
    user.delete()
    logout(request)
    return JsonResponse({"message": "Account deleted"})