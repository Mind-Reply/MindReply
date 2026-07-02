import os
from github import Github

TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_NAME = "Mind-Reply/MindReply"

g = Github(TOKEN)
repo = g.get_repo(REPO_NAME)

def score_issue(text, labels):
    score = 0

    if "security" in text or any(l.name == "security" for l in labels):
        score += 100

    if "infra" in text or any(l.name == "infra" for l in labels):
        score += 70

    if "bug" in text or any(l.name == "bug" for l in labels):
        score += 50

    if "enhancement" in text or any(l.name == "enhancement" for l in labels):
        score += 20

    return score


def assign_owner(score):
    if score >= 100:
        return "security-agent"
    if score >= 70:
        return "infra-agent"
    if score >= 50:
        return "backend-agent"
    return "triage-agent"


def main():
    issues = repo.get_issues(state="open")

    for issue in issues:
        if issue.pull_request:
            continue

        text = (issue.title + " " + (issue.body or "")).lower()
        score = score_issue(text, issue.labels)

        assignee = assign_owner(score)

        try:
            issue.add_to_assignees(assignee)
            issue.create_comment(f"Self-healing assignment applied (score={score}) -> {assignee}")
        except Exception as e:
            print(f"Assign failed for #{issue.number}: {e}")


if __name__ == "__main__":
    main()