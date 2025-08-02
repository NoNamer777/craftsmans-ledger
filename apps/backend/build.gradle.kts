plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
}

group = "org.eu.nl.craftsmansledger"
version = "0.0.1"

application {
    mainClass = "org.eu.nl.craftsmansledger.ApplicationKt"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.bcprov.jdk18on)
    implementation(libs.bcpkix.jdk18on)
    implementation(libs.exposed.core)
    implementation(libs.exposed.jdbc)
    implementation(libs.h2)
    implementation(libs.ktor.network.tls.certicates)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.host.common)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.logback.classic)
    implementation(libs.nanoid)

    testImplementation(libs.kotlin.test.junit)
    testImplementation(libs.ktor.server.test.host)
}

tasks.named<JavaExec>("run") {
    systemProperties["ktor.environment"] = env.fetch("KTO_ENV", "production")
}

tasks.clean {
    delete("src/main/resources/*.csv")
}
