package org.eu.nl

import io.ktor.server.application.*
import org.eu.nl.model.FakeItemRepository

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    val repository = FakeItemRepository()

    configureSerialization(repository)
    configureDatabases()
    configureRouting()
}
