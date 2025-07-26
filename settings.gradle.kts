import java.io.File

rootProject.name = "craftsmans_ledger"

val appsRoot = file("apps")
val libsRoot = file("libs")

// Function to find all build.gradle.kts files within a base directory
fun findProjects(baseDir: File): List<String> {
    val projectPaths = mutableListOf<String>()

    if (baseDir.exists() && baseDir.isDirectory) {
        baseDir.walkTopDown().forEach { file ->
            if (file.isFile && (file.name == "build.gradle.kts")) {
                val relativePath = file.parentFile.relativeTo(settingsDir).path
                    .replace(File.separator, ":")

                if (relativePath.isNotEmpty()) {
                    projectPaths.add(relativePath)
                }
            }
        }
    }
    return projectPaths
}

findProjects(appsRoot).forEach { projectPath ->
    println("Including app project: :$projectPath")
    include(":$projectPath")
}

findProjects(libsRoot).forEach { projectPath ->
    println("Including lib project: :$projectPath")
    include(":$projectPath")
}


