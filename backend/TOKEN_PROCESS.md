## Optional: GitHub Personal Access Token

GitRank works without a GitHub Personal Access Token (PAT), but using one is strongly recommended to avoid GitHub API rate limits.

### Why use a token?

GitHub imposes stricter rate limits on unauthenticated requests.

| Mode          | Rate Limit         |
| ------------- | ------------------ |
| Without Token | 60 requests/hour   |
| With Token    | 5000 requests/hour |

Using a token significantly improves reliability when analyzing multiple profiles.

### Create a GitHub Token

1. Open GitHub Developer Settings:
   https://github.com/settings/tokens

2. Click:

```text
Generate new token
→ Generate new token (classic)
```

3. Enter a token name:

```text
GitRank Development
```

4. Choose an expiration period.

5. No additional permissions are required because GitRank only accesses public GitHub data.

6. Click **Generate token**.

7. Copy the generated token.

### Add Token to .env

```env
PORT=5000
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxx
```

### Security Notice

Never commit your `.env` file or GitHub token to version control.

Ensure `.env` is included in `.gitignore`:

```gitignore
.env
```

If no token is provided, GitRank will automatically fall back to unauthenticated GitHub API requests.
