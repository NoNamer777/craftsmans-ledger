package org.eu.nl.craftsmansledger

import io.ktor.server.application.*
import io.ktor.server.engine.ApplicationEngine
import io.ktor.server.engine.applicationEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.engine.sslConnector
import io.ktor.server.netty.Netty
import org.eu.nl.craftsmansledger.core.appRoutes
import org.eu.nl.craftsmansledger.core.databaseService
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileInputStream
import java.security.KeyStore

val ktorEnv = System.getenv("KTOR_ENV") ?: "production"
val serverPort = System.getenv("PORT")?.toIntOrNull() ?: 7200

fun ApplicationEngine.Configuration.envConfig() {
    if (ktorEnv == "development") {
        val keyStoreFile = File("keystore.p12")
        val keyStoreAlias = "craftsmans-ledger-key"
        val keyStorePassword: String = System.getenv("KEYSTORE_PASSWORD")

        val serverHost = "localhost.api.craftsmans-ledger.net"

        val keyStore = KeyStore.getInstance("PKCS12").apply {
            FileInputStream(keyStoreFile).use {
                load(it, keyStorePassword.toCharArray())
            }
        }

        sslConnector(
            keyStore = keyStore,
            keyAlias = keyStoreAlias,
            keyStorePassword = { keyStorePassword.toCharArray() },
            privateKeyPassword = { keyStorePassword.toCharArray() }
        ) {
            host = serverHost
            port = serverPort
            keyStorePath = keyStoreFile
        }
    } else {
        connector {
            host = "0.0.0.0"
            port = serverPort
        }
    }
}

fun main() {
    System.setProperty("io.ktor.development", (ktorEnv == "development").toString())
    embeddedServer(
        factory = Netty,
        environment = applicationEnvironment {
            log = LoggerFactory.getLogger("ktor.application")
        },
        configure = {
            envConfig()
        },
        module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    databaseService.initializeConnection()
    databaseService.generateTables()

    appRoutes()
}
