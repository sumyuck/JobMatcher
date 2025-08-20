from django.urls import path
from . import views
from .views import signup_view, login_view, user_profile, delete_account

urlpatterns = [
    path("api/jobs/", views.job_list, name="job_list"),
    path("api/jobs/create/", views.create_job, name="create_job"),
    path("api/jobs/<int:job_id>/update/", views.update_job, name="update_job"),
    path("api/jobs/<int:job_id>/delete/", views.delete_job, name="delete_job"),
    path("api/signup/", signup_view, name="signup"),
    path("api/login/", login_view, name="login"),
    path("api/user/", user_profile, name="user_profile"),
    path("api/delete/", delete_account, name="delete_account"),
]
