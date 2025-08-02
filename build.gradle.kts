plugins {
    alias(libs.plugins.nxprojectgraph)
    alias(libs.plugins.dotenv)
}

allprojects {
    apply {
        plugin("dev.nx.gradle.project-graph")
    }
}
