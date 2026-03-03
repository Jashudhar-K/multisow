module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/designer',
      ],
      startServerCommand: 'npm run build && npm start',
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 1}],
        'categories:best-practices': ['error', {minScore: 1}],
        'categories:seo': ['error', {minScore: 0.95}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
