import os
import json
import datetime
from django.http import (
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from googleapiclient.discovery import build
from informations.models import Information, YoutubeContent
from posts.views import prepare_posts_response


def youtube_search(query, max_result=25):
    youtube = build("youtube", "v3", developerKey=os.environ.get("YOUTUBE_KEY"))
    search_response = (
        youtube.search().list(q=query, part="id,snippet", maxResults=max_result).execute()
    )

    videos = []
    for search_result in search_response.get("items", []):
        if search_result["id"]["kind"] == "youtube#video":
            # search_result["snippet"] :
            #   publishedAt, channelId, publishTime, channelTitle
            #   title, description,
            #   thumbnails { default - url, width, height / medium, high },
            #   liveBroadcastContent
            # search_result["id"] : removed now.
            #   kind, videoId

            videos.append(
                {
                    "video_id": search_result["id"]["videoId"],
                    "published": search_result["snippet"]["publishedAt"][:-1],
                    "title": search_result["snippet"]["title"],
                    "description": search_result["snippet"]["description"],
                    "thumbnail": search_result["snippet"]["thumbnails"]["medium"],  # 320 * 180
                    "channel": search_result["snippet"]["channelTitle"],
                }
            )
    return videos


def information_update(target):  # Target Information.
    youtube_result = youtube_search(target.name)
    for video in youtube_result:
        try:
            YoutubeContent.objects.get(video_id=video["video_id"])
        except YoutubeContent.DoesNotExist:
            YoutubeContent.objects.create(
                information=target,
                video_id=video["video_id"],
                published=video["published"],
                title=video["title"],
                thumbnail=video["thumbnail"]["url"],
                channel=video["channel"],
            )
    return JsonResponse(
        {"message": 'End'},
        status=200,
    )


@require_http_methods(["GET"])
def information_detail(request, information_name):
    """
    GET : get information detail.
    """
    try:
        target = Information.objects.get(name=information_name)

        if (
            datetime.datetime.now() - target.updated > datetime.timedelta(hours=1)
            or target.youtube.count() == 0
        ):
            information_update(target)
            target.updated = datetime.datetime.now()
            target.save()
        return JsonResponse(
            {
                "basic": {"name": information_name},
                "posts": prepare_posts_response(target.tag.tagged_posts.all()),
                "youtubes": list(target.youtube.all().values()),
                "articles": 'ho',
            },
            status=200,
        )
    except (
        KeyError,
        json.JSONDecodeError,
        Information.DoesNotExist,
    ):
        return JsonResponse({"message": f"Failed {information_name}!"}, status=404)
