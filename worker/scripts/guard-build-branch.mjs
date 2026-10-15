// Runs first in the Cloudflare build (wrangler.jsonc "build.command"). Workers Builds sets WORKERS_CI_BRANCH.
// Preview builds of other branches would run unreviewed code against the PRODUCTION database binding, so only the
// production branch may build here. Pull requests are tested by GitHub Actions against a local database instead.
const branch = process.env.WORKERS_CI_BRANCH;
const allowed = (process.env.SIDEQUEST_DEPLOY_BRANCH || "main").split(",").map((s) => s.trim());
if (process.env.WORKERS_CI && branch && !allowed.includes(branch)) {
  console.error(`Refusing to build branch "${branch}" on Cloudflare: previews would use the production database. Only ${allowed.join(", ")} deploys from Cloudflare; pull requests are tested in GitHub Actions.`);
  process.exit(1);
}
console.log(`Build branch check passed (${branch || "local build"}).`);
