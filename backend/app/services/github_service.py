import httpx
from cachetools import TTLCache

from app.core.logging import logger


GITHUB_OWNER = "karlowsmorris"
GITHUB_REPOSITORY = "ResumeIQ"

# Cache GitHub stars for 4 hours
_stars_cache = TTLCache(maxsize=1, ttl=60 * 60 * 4)


class GitHubService:
    GITHUB_API_URL = (
        f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPOSITORY}"
    )

    @staticmethod
    async def get_stars() -> int:
        """
        Fetch GitHub stars with 4-hour in-memory caching.
        """

        if "stars" in _stars_cache:
            return _stars_cache["stars"]

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(GitHubService.GITHUB_API_URL)

                response.raise_for_status()

                data = response.json()
                stars = int(data.get("stargazers_count", 0))

                _stars_cache["stars"] = stars

                return stars

        except Exception as exc:
            logger.warning(
                f"Failed to fetch GitHub stars: {str(exc)}"
            )

            # Return cached value if available
            if "stars" in _stars_cache:
                return _stars_cache["stars"]

            return 0
