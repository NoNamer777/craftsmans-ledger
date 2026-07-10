// Build context is the repo root, matching this Dockerfile's own convention
// (see its header comment). Invoked in CI as:
//   docker buildx bake -f apps/web/.docker/docker-bake.hcl -f <metadata-action bake-file> build
//
// web-specific — not shared with other apps. See
// docs/adr/0043-per-app-docker-bake-file.md for why each app gets its own
// bake file, and docs/adr/0035-docker-bake-multi-platform-provenance-and-labels-for-web.md
// for the rationale behind this target's own settings (Bake usage, platform
// list, provenance/SBOM, and registry caching).

variable "GITHUB_REPOSITORY_OWNER" {
  default = "nonamer777"
}

variable "WEB_IMAGE_REPOSITORY" {
  default = "craftsmans-ledger/web"
}

target "docker-metadata-action" {}

target "build" {
  inherits   = ["docker-metadata-action"]
  context    = "."
  dockerfile = "apps/web/.docker/Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  attest     = ["type=provenance,mode=max", "type=sbom"]
  cache-from = ["type=registry,ref=ghcr.io/${GITHUB_REPOSITORY_OWNER}/${WEB_IMAGE_REPOSITORY}:buildcache"]
  cache-to   = ["type=registry,ref=ghcr.io/${GITHUB_REPOSITORY_OWNER}/${WEB_IMAGE_REPOSITORY}:buildcache,mode=max"]
}
