from fastapi import APIRouter

from app.schemas.github import GitHubStarsResponse
from app.services.github_service import GitHubService


router = APIRouter()


@router.get("/github/stars", tags=["GitHub"], response_model=GitHubStarsResponse)
async def get_github_stars():
    stars = await GitHubService.get_stars()

    return GitHubStarsResponse(
        stars=stars
    )
