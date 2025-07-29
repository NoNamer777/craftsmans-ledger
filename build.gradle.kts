plugins {
    alias(libs.plugins.nxprojectgraph)
}

allprojects {
    apply {
        plugin("dev.nx.gradle.project-graph")
    }
}
