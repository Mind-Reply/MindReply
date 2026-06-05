export type SlackNotifyInput = {
  title: string;
  message: string;
  severity?: "info" | "warning" | "critical";
  fields?: Record<string, string | number | null | undefined>;
};

export function isSlackConfigured() {
  return Boolean(process.env.SLACK_WEBHOOK_URL?.trim());
}

function severityPrefix(severity: SlackNotifyInput["severity"] = "info") {
  if (severity === "critical") return "[CRITICAL]";
  if (severity === "warning") return "[WARNING]";
  return "[INFO]";
}

export async function sendSlackNotification(input: SlackNotifyInput) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return { sent: false, reason: "SLACK_WEBHOOK_URL is not configured." as const };
  }

  const fields = Object.entries(input.fields ?? {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `*${key}:* ${String(value)}`)
    .join("\n");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `${severityPrefix(input.severity)} ${input.title}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${severityPrefix(input.severity)} ${input.title}*\n${input.message}`,
          },
        },
        ...(fields
          ? [{
              type: "section",
              text: { type: "mrkdwn", text: fields },
            }]
          : []),
      ],
    }),
  });

  return response.ok
    ? { sent: true as const, status: response.status }
    : { sent: false as const, status: response.status, reason: response.statusText };
}
