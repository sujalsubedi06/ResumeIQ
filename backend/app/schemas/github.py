from pydantic import BaseModel


class GitHubStarsResponse(BaseModel):
    stars: int