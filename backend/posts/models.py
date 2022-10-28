from django.db import models
from core.models import AbstractTimeStampedModel
from users.models import User

class Post(AbstractTimeStampedModel):
    """ Post model definition """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title  = models.CharField(max_length=60, null=False)
    content = models.TextField() # TODO: Replace content with
    like_num = models.IntegerField(null=False, default=0)
    dislike_num = models.IntegerField(null=False, default=0)
    scrap_num = models.IntegerField(null=False, default=0)

    # Related_name : comments <- comments.Comment
    def get_eff_like(self):
        """ Get effective number of like """
        return self.like_num - self.dislike_num   
    
    def __str__(self):
        """ To string method """
        return self.title
    # TODO: in_group, tags, Content
