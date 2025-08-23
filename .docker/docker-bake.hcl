variable "TAG" {
    type = list(string)
    default = ["latest"]
}

group "all" {
    targets = ["web-app", "admin-portal", "api"]
}

target "_common" {
    context = "."
    platforms = ["linux/amd64", "linux/arm64", "linux/arm/v7"]
}

target "web-app" {
    inherits = ["_common"]
    dockerfile = "apps/web-app/.docker/Dockerfile"
    tags = [for tag in TAG: "ghcr.io/nonamer777/craftsmans-ledger/cml-web-app:${tag}"]
}

target "admin-portal" {
    inherits = ["_common"]
    dockerfile = "apps/admin-portal/.docker/Dockerfile"
    tags = [for tag in TAG: "ghcr.io/nonamer777/craftsmans-ledger/cml-admin-portal:${tag}"]
}

target "api" {
    inherits = ["_common"]
    dockerfile = "apps/api/.docker/Dockerfile"
    tags = [for tag in TAG: "ghcr.io/nonamer777/craftsmans-ledger/cml-api:${tag}"]
}
