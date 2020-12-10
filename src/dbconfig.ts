require("dotenv").config();

module.exports = {
    production: {
        url: process.env.DATABASE_URL,
        type: "postgres",
        synchronize: process.env.DB_SYNC || false,
        logging: process.env.DB_LOG || false,
        entities: [
            __dirname+"/entity/**/*{.ts,.js}"
        ],
        migrations: [
            __dirname+"/migration/**/*{.ts,.js}"
        ],
        subscribers: [
            __dirname+"/subscriber/**/*{.ts,.js}"
        ],
        cli: {
            entitiesDir: "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    },

    development: {
        type: "postgres",
        host: "localhost",
        port: process.env.DB_PORT || 5432,
        username: process.env.PG_USER || "postgres",
        password: process.env.PG_PASS || "password",
        database: process.env.PG_DB || "postgres",
        synchronize: process.env.DB_SYNC || true,
        logging: process.env.DB_LOG || false,
        entities: [
            __dirname+"/entity/**/*{.ts,.js}"
        ],
        migrations: [
            __dirname+"/migration/**/*{.ts,.js}"
        ],
        subscribers: [
            __dirname+"/subscriber/**/*{.ts,.js}"
        ],
        cli: {
        entitiesDir: "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    },

    test: {
        type: "postgres",
        host: "localhost",
        port: process.env.TEST_PORT || 9999,
        username: process.env.TEST_PG_USER || "test",
        password: process.env.TEST_PG_PASS || "test",
        database: process.env.TEST_PG_DB || "test",
        synchronize: process.env.TEST_DB_SYNC || false,
        logging: process.env.TEST_DB_LOG || false,
        entities: [
            "src/entity/**/*{.ts,.js}"
        ],
        migrations: [
            "src/migration/**/*{.ts,.js}"
        ],
        subscribers: [
            "src/subscriber/**/*{.ts,.js}"
        ],
        cli: {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    },
}