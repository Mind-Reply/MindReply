import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  MOA_AGENTS,
  MOA_CONTROLLER_CONTRACT,
  orchestrateGoal,
  routeGoalToAgents,
  validateAgentOutputs,
} from "../lib/moa";

describe("Master Orchestrator Agent", () => {
  it("keeps every domain specialist active under MOA control", () => {
    const routed = routeGoalToAgents(
      "Launch an AI booking platform with secure payments, analytics, integrations, and support automation",
    );

    assert.equal(routed.length, 15);
    assert.ok(!routed.some((agent) => agent.id === "moa"));
    assert.deepEqual(
      routed.map((agent) => agent.name),
      MOA_AGENTS.map((agent) => agent.name),
    );
    assert.ok(routed.every((agent) => agent.status === "active"));
    assert.ok(routed.some((agent) => agent.priority === "primary"));
  });

  it("validates that routed outputs are complete before synthesis", () => {
    const routed = routeGoalToAgents("Harden the database, backend APIs, frontend UX, and DevOps pipeline");
    const validation = validateAgentOutputs(routed);

    assert.equal(validation.valid, true);
    assert.equal(validation.checkedAgents, 15);
    assert.deepEqual(validation.missingAgents, []);
    assert.deepEqual(validation.domainBoundaryViolations, []);
    assert.ok(validation.confidenceScore >= 90);
  });

  it("returns a final combined result with MOA validation evidence", () => {
    const result = orchestrateGoal({
      goal: "Expand the platform with AI content, workflow automation, security review, and launch support",
    });

    assert.match(result.finalCombinedResult.summary, /Master Orchestrator Agent/i);
    assert.equal(result.taskRoutingLayer.length, 15);
    assert.equal(result.validation.valid, true);
    assert.ok(result.finalCombinedResult.nextActions.length >= 5);
    assert.ok(result.finalCombinedResult.nextActions[0].includes("MOA"));
  });

  it("includes the Business Agent without allowing domain overlap", () => {
    const business = MOA_AGENTS.find((agent) => agent.id === "business");
    const routed = routeGoalToAgents("Create pricing, offers, partnerships, and revenue strategy");

    assert.ok(business);
    assert.equal(business.name, "Business Agent");
    assert.match(business.domain, /pricing/i);
    assert.equal(routed.find((agent) => agent.id === "business")?.priority, "primary");
  });

  it("exposes the MindReply controller contract and rejection rules", () => {
    assert.equal(MOA_CONTROLLER_CONTRACT.role, "Master Orchestrator Agent for the MindReply ecosystem");
    assert.ok(MOA_CONTROLLER_CONTRACT.coreRules.includes("Only MOA talks to the user."));
    assert.ok(MOA_CONTROLLER_CONTRACT.routingLogic.includes("Merge into one final response."));
    assert.ok(MOA_CONTROLLER_CONTRACT.conflictRejectionRules.some((rule) => rule.includes("overlap another agent domain")));
    assert.match(MOA_CONTROLLER_CONTRACT.finalAnswerStandard, /MindReply/);
  });
});
