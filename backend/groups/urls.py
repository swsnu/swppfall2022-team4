from django.urls import path
from groups.views import (
    general_group,
    group_detail,
    group_members,
    group_member_check,
    group_leader_change,
    group_cert,
    join_permission,
)
from posts.views import post_group

urlpatterns = [
    path('', general_group, name="groups"),
    path('<int:group_id>/', group_detail, name="group"),
    path('<int:group_id>/member/', group_members, name="group_members"),
    path('<int:group_id>/join_permission/', join_permission, name = "join_permission"),
    path('<int:group_id>/post/', post_group, name="group_posts"),
    path('<int:group_id>/mem_check/', group_member_check, name="group_member_check"),
    path('<int:group_id>/leader_change/', group_leader_change, name="group_leader_change"),
    path(
        '<int:group_id>/cert/<int:year>/<int:month>/<int:specific_date>/',
        group_cert,
        name='group_cert',
    ),
]
