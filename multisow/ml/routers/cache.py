# Shared prediction cache for ML explain/explain endpoints
from typing import Any, Dict

_prediction_cache: Dict[str, Dict[str, Any]] = {}

def cache_prediction(prediction_id: str, data: Dict[str, Any]) -> None:
    """Store prediction context for later explanation."""
    _prediction_cache[prediction_id] = data
    # Keep last 200
    if len(_prediction_cache) > 200:
        oldest = list(_prediction_cache.keys())[0]
        _prediction_cache.pop(oldest, None)

def get_cached_prediction(prediction_id: str) -> Dict[str, Any]:
    return _prediction_cache.get(prediction_id)
