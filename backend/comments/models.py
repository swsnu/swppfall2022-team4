from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User
from posts.models import Post
 

class Comment(AbstractTimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")

    content = models.TextField()

    like_num = models.IntegerField(null=False, default=0)
    dislike_num = models.IntegerField(null=False, default=0)

    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)

    def get_eff_like(self):
        """ Get effective number of like """
        return self.like_num - self.dislike_num
    
    def __str__(self):
        """ To string method """
        return self.content