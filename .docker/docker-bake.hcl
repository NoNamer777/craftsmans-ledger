// Build context is the repo root, matching .docker/web/Dockerfile's own
// convention (see its header comment). Invoked in CI as:
//   docker buildx bake -f .docker/docker-bake.hcl -f <metadata-action bake-file> web
//
// One target per containerized project, keyed by project name. See
// docs/adr/0041-shared-docker-bake-file-across-projects.md for why this file
// lives here rather than under .docker/web/, and
// docs/adr/0035-docker-bake-multi-platform-provenance-and-labels-for-web.md
// for the rationale behind the web target's own settings (Bake usage,
// platform list, provenance/SBOM, and registry caching).

variable "GITHUB_REPOSITORY_OWNER" {
  default = "nonamer777"
}

target "docker-metadata-action" {}

target "web" {
  inherits   = ["docker-metadata-action"]
  context    = "."
  dockerfile = ".docker/web/Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  attest     = ["type=provenance,mode=max", "type=sbom"]
  cache-from = ["type=registry,ref=ghcr.io/${GITHUB_REPOSITORY_OWNER}/craftsmans-ledger/web:buildcache"]
  cache-to   = ["type=registry,ref=ghcr.io/${GITHUB_REPOSITORY_OWNER}/craftsmans-ledger/web:buildcache,mode=max"]
}
