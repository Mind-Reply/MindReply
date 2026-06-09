import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

type JsonObject = Record<string, unknown>;

const root = process.cwd();
const seedDir = join(root, "playbooks", "seed");
const allowedActions = new Set(["reply", "schedule", "resolve", "escalate"]);
const requiredTopLevel = [
  "playbook_id",
  "title",
  "description",
  "version",
  "triggers",
  "decision_tree",
  "actions",
  "verification",
  "audit",
];
const allowedTopLevel = new Set(requiredTopLevel);
const allowedAuditKeys = new Set(["signed", "redaction_level"]);

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(errors: string[], file: string, path: string, value: unknown, minLength = 1) {
  if (typeof value !== "string" || value.trim().length < minLength) {
    errors.push(`${file}: ${path} must be a string with length >= ${minLength}`);
  }
}

function validatePlaybook(file: string, playbook: unknown) {
  const errors: string[] = [];

  if (!isObject(playbook)) {
    return [`${file}: root must be an object`];
  }

  for (const key of requiredTopLevel) {
    if (!(key in playbook)) {
      errors.push(`${file}: missing required key ${key}`);
    }
  }

  for (const key of Object.keys(playbook)) {
    if (!allowedTopLevel.has(key)) {
      errors.push(`${file}: unexpected top-level key ${key}`);
    }
  }

  assertString(errors, file, "playbook_id", playbook.playbook_id, 3);
  assertString(errors, file, "title", playbook.title, 3);
  assertString(errors, file, "description", playbook.description, 3);
  assertString(errors, file, "version", playbook.version, 1);

  if (!Array.isArray(playbook.triggers)) {
    errors.push(`${file}: triggers must be an array`);
  } else {
    playbook.triggers.forEach((trigger, index) => {
      if (!isObject(trigger)) {
        errors.push(`${file}: triggers[${index}] must be an object`);
        return;
      }
      const keys = Object.keys(trigger);
      if (keys.length !== 1 || keys[0] !== "pattern") {
        errors.push(`${file}: triggers[${index}] must contain only pattern`);
      }
      assertString(errors, file, `triggers[${index}].pattern`, trigger.pattern, 1);
    });
  }

  if (!isObject(playbook.decision_tree)) {
    errors.push(`${file}: decision_tree must be an object`);
  } else {
    const treeKeys = Object.keys(playbook.decision_tree);
    if (treeKeys.length !== 1 || treeKeys[0] !== "nodes") {
      errors.push(`${file}: decision_tree must contain only nodes`);
    }
    const nodes = playbook.decision_tree.nodes;
    if (!Array.isArray(nodes) || nodes.length === 0) {
      errors.push(`${file}: decision_tree.nodes must be a non-empty array`);
    } else {
      nodes.forEach((node, index) => {
        if (!isObject(node)) {
          errors.push(`${file}: decision_tree.nodes[${index}] must be an object`);
          return;
        }
        const nodeKeys = Object.keys(node).sort();
        const expectedNodeKeys = ["action", "id", "synthesis"];
        if (nodeKeys.join(",") !== expectedNodeKeys.join(",")) {
          errors.push(`${file}: decision_tree.nodes[${index}] must contain only id, action, synthesis`);
        }
        assertString(errors, file, `decision_tree.nodes[${index}].id`, node.id, 1);
        assertString(errors, file, `decision_tree.nodes[${index}].synthesis`, node.synthesis, 1);
        if (typeof node.action !== "string" || !allowedActions.has(node.action)) {
          errors.push(`${file}: decision_tree.nodes[${index}].action must be one of ${Array.from(allowedActions).join(", ")}`);
        }
      });
    }
  }

  if (!Array.isArray(playbook.actions)) {
    errors.push(`${file}: actions must be an array`);
  } else {
    playbook.actions.forEach((action, index) => {
      if (typeof action !== "string" || !allowedActions.has(action)) {
        errors.push(`${file}: actions[${index}] must be one of ${Array.from(allowedActions).join(", ")}`);
      }
    });
  }

  if (!isObject(playbook.verification)) {
    errors.push(`${file}: verification must be an object`);
  }

  if (!isObject(playbook.audit)) {
    errors.push(`${file}: audit must be an object`);
  } else {
    for (const key of Object.keys(playbook.audit)) {
      if (!allowedAuditKeys.has(key)) {
        errors.push(`${file}: audit has unexpected key ${key}`);
      }
    }
    if (typeof playbook.audit.signed !== "boolean") {
      errors.push(`${file}: audit.signed must be boolean`);
    }
    assertString(errors, file, "audit.redaction_level", playbook.audit.redaction_level, 1);
  }

  return errors;
}

function main() {
  if (!existsSync(seedDir)) {
    console.error("Missing playbooks/seed directory.");
    process.exitCode = 1;
    return;
  }

  const files = readdirSync(seedDir).filter((file) => file.endsWith(".json")).sort();
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const file of files) {
    const fullPath = join(seedDir, file);
    let parsed: unknown;

    try {
      parsed = JSON.parse(readFileSync(fullPath, "utf-8"));
    } catch (error) {
      errors.push(`${file}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
      continue;
    }

    if (isObject(parsed) && typeof parsed.playbook_id === "string") {
      if (ids.has(parsed.playbook_id)) {
        errors.push(`${file}: duplicate playbook_id ${parsed.playbook_id}`);
      }
      ids.add(parsed.playbook_id);
    }

    errors.push(...validatePlaybook(file, parsed));
  }

  if (files.length < 12) {
    errors.push(`expected at least 12 seed playbooks, found ${files.length}`);
  }

  if (errors.length) {
    console.error(["Playbook verification failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(`Playbook verification passed: ${files.length} seed playbooks match the schema contract.`);
}

main();
