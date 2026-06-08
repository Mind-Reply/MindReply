# Azure VM Infrastructure Plan

## Purpose

MindReply should continue to use Vercel as the default hosting and deployment path for the web application. Azure VMs are reserved for workloads that need operating-system control, longer runtimes, private network reachability, specialized build tools, or isolated execution that does not fit Vercel's serverless model.

This plan defines when to add Azure VM capacity, how to run GitHub self-hosted runners safely, and how to keep secrets, cost, and monitoring under control.

## When To Use Azure VMs

Use Azure VMs only for workloads that meet at least one of these criteria:

- Long-running jobs that exceed Vercel or GitHub-hosted runner time limits.
- Build, test, or release steps that require pinned OS packages, privileged tooling, browsers, GPU/CPU-heavy workloads, or large local caches.
- Integration tests that need stable egress IPs, access to private Azure resources, or controlled network paths.
- Background workers, schedulers, or internal automation that must keep stateful processes warm and cannot be expressed cleanly as Vercel functions.
- Emergency operational tooling where an isolated VM is safer than running commands on a developer laptop.

Do not use Azure VMs for static hosting, normal API endpoints, preview deployments, lightweight cron jobs, or request/response workloads that Vercel already handles well.

## Recommended Topology

- Production web traffic stays on Vercel.
- Azure hosts internal-only runner and worker capacity in a dedicated resource group.
- Each VM uses explicit environment tags: `env`, `owner`, `service`, `cost-center`, and `ttl`.
- Runner VMs live in a subnet with outbound access limited to GitHub, Azure control-plane endpoints, package registries required by builds, and approved dependency mirrors.
- No inbound public SSH or RDP is open by default. Administrative access should go through Azure Bastion, Just-in-Time VM access, or a temporary break-glass path approved by the infrastructure owner.
- VM images are rebuilt from code-managed configuration instead of manually patched snowflake servers.

## GitHub Self-Hosted Runner Safety

Self-hosted runners must be treated as sensitive infrastructure because workflow code can execute arbitrary commands.

Required controls:

- Prefer ephemeral runners. One job should get one clean VM or runner instance, then the instance should be destroyed or fully reimaged.
- Scope runners to the MindReply repository or to a tightly controlled runner group. Do not register broad organization-wide runners unless the repository allowlist is explicit.
- Use dedicated runner labels such as `mindreply-azure-linux-x64` and require workflows to opt in deliberately.
- Disable self-hosted runners for untrusted pull requests from forks unless the job is manually approved and the workflow cannot access secrets.
- Run the runner process as a non-admin user with the smallest practical filesystem and service permissions.
- Avoid mounting the host Docker socket into jobs. If Docker is required, isolate it per job and clear images, volumes, build cache, and credentials after execution.
- Keep runner work directories on disposable disks where possible. If persistent disks are used for dependency caches, separate cache paths from workspace paths.
- Patch base images regularly and rebuild runners after patching rather than relying on long-lived mutable hosts.
- Log runner registration, deregistration, job start, job finish, and teardown events.
- Maintain an emergency disable procedure that removes runner registration and denies outbound traffic from the runner subnet.

## Secrets Handling

Secrets must not be stored in VM images, shell history, repository files, startup scripts, or plaintext environment files.

Approved patterns:

- Use GitHub Actions OIDC federation for Azure access instead of long-lived cloud credentials.
- Store Azure-side secrets in Azure Key Vault with RBAC, audit logging, purge protection, and least-privilege access policies.
- Store GitHub workflow secrets in GitHub Environments with required reviewers for production access.
- Prefer Azure Managed Identity for VM-to-Azure access. Grant access only to the specific Key Vault secrets, storage containers, queues, or databases required by that workload.
- Rotate any registration credentials or bootstrap secrets immediately after use. Runner registration material should be short-lived and never committed.
- Mask secret-like values in logs and block debug logging for production jobs unless an incident lead approves it.
- Pass secrets at runtime through the platform secret store. Do not bake them into images, cloud-init templates, Terraform variables committed to the repo, or shared cache layers.

## Cost Controls

Azure VM usage should be capacity-on-demand, not always-on by default.

Baseline controls:

- Set Azure Budgets with alerts at 50%, 80%, and 100% of the monthly infrastructure budget.
- Apply required cost tags to every VM, disk, public IP, load balancer, NAT gateway, Log Analytics workspace, and storage account.
- Use VM auto-shutdown for non-production instances.
- Prefer ephemeral runners or VM scale sets with minimum capacity of zero for CI burst workloads.
- Use smaller SKUs first, then increase size based on measured job duration and queue pressure.
- Use Spot VMs only for retry-safe jobs. Do not use Spot for release publishing, migrations, or stateful production workers.
- Delete unattached disks, stale snapshots, orphaned public IPs, and unused network interfaces during a scheduled weekly cleanup.
- Cap log retention by environment. Production needs enough retention for incident review; development and preview runner logs should be shorter-lived.
- Review VM spend weekly until usage stabilizes, then monthly.

## Monitoring And Operations

Minimum observability:

- Azure Monitor metrics for CPU, memory, disk, network, VM availability, and disk queue depth.
- Log Analytics collection for system logs, runner service logs, job lifecycle events, and security-relevant events.
- Alerts for VM unavailable, runner offline, repeated job failures, high queue wait time, disk space below threshold, unexpected public IP exposure, budget thresholds, and Key Vault access anomalies.
- Microsoft Defender for Cloud recommendations reviewed on a regular schedule.
- Update management or image rebuild cadence documented with the VM image owner.
- A simple dashboard showing active runner count, queued jobs, job success rate, average job duration, VM uptime, and monthly cost.

Incident response expectations:

- If a runner is suspected of compromise, stop accepting jobs, revoke runner registration, isolate the subnet or VM, preserve logs, rotate exposed credentials, and rebuild from a clean image.
- If a secret appears in logs, treat it as exposed, revoke it, rotate dependent credentials, and remove the log artifact if platform policy allows.
- If cost spikes unexpectedly, stop non-production VMs first, then disable scale-out while preserving production service continuity.

## Complementing Vercel

Vercel remains the system of record for frontend deployments, preview URLs, edge delivery, and serverless web/API workloads. Azure VMs complement Vercel by handling work that benefits from durable compute or private infrastructure boundaries.

Recommended split:

- Vercel: web app hosting, preview deployments, edge middleware, static assets, serverless API routes, lightweight scheduled jobs, and fast rollback.
- Azure VMs: heavyweight CI tasks, controlled self-hosted runners, private integration testing, internal workers, specialized tooling, and operational break-glass jobs.
- GitHub Actions: workflow orchestration, approvals, branch protection integration, and artifact handoff between Azure runner jobs and Vercel deployments.

The default path for product changes should still be GitHub to Vercel. Azure runner jobs should produce artifacts, test reports, or release metadata that GitHub and Vercel can consume without making Azure the public serving layer.

## Initial Rollout

1. Start with one non-production ephemeral Linux runner pool with zero idle capacity.
2. Allow only explicitly labeled CI jobs to use the Azure runner.
3. Run non-secret build and integration test jobs first.
4. Add OIDC-based Azure access only after runner teardown, logging, and approval controls are verified.
5. Document each accepted workload with owner, purpose, expected monthly cost, required secrets, network access, and rollback plan.
6. Review the first month of usage before adding production release or worker responsibilities.

## Guardrails Before Production Use

Production use is blocked until these checks are true:

- Runner registration and teardown are automated and logged.
- Forked pull request workflows cannot reach production secrets.
- Azure access uses OIDC or Managed Identity, not long-lived credentials.
- No public inbound admin ports are open.
- Budget alerts and operational alerts are active.
- VM images can be rebuilt from documented configuration.
- Incident isolation and credential rotation steps have been rehearsed.
