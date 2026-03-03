self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/docs"
      },
      {
        "source": "/openapi.json"
      },
      {
        "source": "/health"
      },
      {
        "source": "/api/:path*"
      },
      {
        "source": "/ml/:path*"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()