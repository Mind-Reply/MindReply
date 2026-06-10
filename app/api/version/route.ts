import { NextResponse } from "next/server";
import { buildMetadata } from "@/lib/build-metadata";

export const runtime = "nodejs";

function value(name: string) {
  const raw = process.env[name];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

export async function GET() {
  const commitSha = value("VERCEL_GIT_COMMIT_SHA") || value("GITHUB_SHA") || value("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA") || buildMetadata.commitSha;
  const branch = value("VERCEL_GIT_COMMIT_REF") || value("GITHUB_REF_NAME") || value("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH") || buildMetadata.branch;

  return NextResponse.json({
    status: "ok",
    service: "mindreply-decision-layer",
    timestamp: new Date().toISOString(),
    deployment: {
      commitSha,
      shortSha: commitSha ? commitSha.slice(0, 12) : null,
      branch,
      environment: value("VERCEL_ENV") || value("NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT") || buildMetadata.environment,
      url: value("VERCEL_URL") || value("NEXT_PUBLIC_MINDREPLY_BUILD_URL") || buildMetadata.url,
      projectProductionUrl: value("VERCEL_PROJECT_PRODUCTION_URL") || value("NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL") || buildMetadata.projectProductionUrl,
      region: value("VERCEL_REGION"),
      metadataGeneratedAt: buildMetadata.generatedAt,
    },
  });
}
