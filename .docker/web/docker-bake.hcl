// Build context is the repo root, matching .docker/web/Dockerfile's own
// convention (see its header comment). Invoked in CI as:
//   docker buildx bake -f .docker/web/docker-bake.hcl -f <metadata-action bake-file> build
//
// See docs/adr/0035-docker-bake-multi-platform-provenance-and-labels-for-web.md
// for the rationale behind using Bake here, the platform list, and the
// provenance mode.

target "docker-metadata-action" {}

target "build" {
  inherits   = ["docker-metadata-action"]
  context    = "."
  dockerfile = ".docker/web/Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  attest     = ["type=provenance,mode=max"]
}
