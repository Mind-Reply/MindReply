import os
from github import Github

TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_NAME = "Mind-Reply/MindReply"

g = Github(TOKEN)
repo = g.get_repo(REPO_NAME)

KEEP_KEYWORDS = [
    "security", "vulnerability", "production", "deploy", "ci", "rollback"
]

def is_safe_to_close(issue):
    text = (issue.title + " " + (issue.body or "")).lower()

    for k in KEEP_KEYWORDS:
        if k in text:
            return False

    for label in issue.labels:
        if label.name.lower() in KEEP_KEYWORDS:
            return False

    return True


def main():
    issues = repo.get_issues(state="open")

    for issue in issues:
        if issue.pull_request is not None:
            continue

        if is_safe_to_close(issue):
            issue.create_comment("Auto-closed by cleanup bot (non-critical / noise).")
            issue.edit(state="closed")

if __name__ == "__main__":
    main()
