package org.eu.nl.craftsmansledger.core

import org.eu.nl.craftsmansledger.items.ItemTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection

class DatabaseService {
    var connection: Database? = null

    fun initializeConnection() {
        val databaseType = System.getenv("DB_TYPE") ?: "h2"

        val connectionString = this.constructConnectionString(databaseType)

        val user = this.getUser(databaseType)
        val password = this.getPassword(databaseType)
        val driver = this.getDriver(databaseType)

        connection = if (user != null && password != null) {
            Database.connect(url = connectionString, driver = driver, user = user, password = password)
        } else {
            Database.connect(url = connectionString, driver = driver)
        }

        TransactionManager.defaultDatabase = connection

        // Change default to prevent dirty reads, non-repeatable reads, and phantom reads
        // Source: https://www.jetbrains.com/help/exposed/transactions.html#transactionisolation
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE
    }

    fun generateTables() {
        transaction {
            SchemaUtils.create(*arrayOf(ItemTable))
        }
    }

    private fun constructConnectionString(databaseType: String): String {
        var connectionString = "jdbc:"

        when (databaseType) {
            "mysql" -> {
                connectionString += "mysql://"

                val mysqlHost = System.getenv("MYSQL_HOST") ?: "localhost"
                val mysqlPort = System.getenv("MYSQL_PORT") ?: "3306"
                val mysqlSchema = System.getenv("MYSQL_SCHEMA") ?: "test"

                connectionString += "$mysqlHost:$mysqlPort/$mysqlSchema"
            }

            "mariadb" -> {
                connectionString += "mariadb://"

                val mariadbHost = System.getenv("MARIADB_HOST") ?: "localhost"
                val mariadbPort = System.getenv("MARIADB_PORT") ?: "3306"
                val mariadbSchema = System.getenv("MARIADB_SCHEMA") ?: "test"

                connectionString += "$mariadbHost:$mariadbPort/$mariadbSchema"
            }

            // Will fall back to an in-memory H2 database.
            else -> {
                connectionString += "h2:"

                val h2DbName = System.getenv("H2_DB_NAME") ?: "cml_db"
                val h2KeepOpen = System.getenv("H2_KEEP_OPEN") ?: "true"

                val h2InMemory = System.getenv("H2_IN_MEMORY") ?: "true"
                val useInMemoryDb = h2InMemory == "true"

                connectionString += if (useInMemoryDb) {
                    "mem:$h2DbName"
                } else {
                    "file:./$h2DbName"
                }
                connectionString += if (h2KeepOpen == "true") {
                    ";DB_CLOSE_DELAY=-1"
                } else {
                    ""
                }
            }
        }
        return connectionString
    }

    private fun getUser(databaseType: String) =
        System.getenv(if (databaseType == "mysql") "MYSQL_USER" else "MARIADB_USER")

    private fun getPassword(databaseType: String) =
        System.getenv(if (databaseType == "mysql") "MYSQL_PASSWORD" else "MARIADB_PASSWORD")

    private fun getDriver(databaseType: String): String {
        return when (databaseType) {
            "mariadb" -> "org.mariadb.jdbc.Driver"
            "mysql" -> "com.mysql.cj.jdbc.Driver"
            else -> "org.h2.Driver"
        }
    }
}

val databaseService = DatabaseService()
