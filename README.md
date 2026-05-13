# Změny

## 12.5.2026

- úprava Queries, Mutations, Components pro projektový den
- zprovoznění edit/delete
- vyřešení problémů s permissions
- update README.md
- **Problémy/errory**: Nelze změnit "Místo konání", příliš pomalé zadávání změn vyhazuje Error 1, po zmáčknutí tlačítka "Aktulizovat" se ale změna uloží a error zmizí. Při "Create" po stisknutí tlačítka "OK" se nám vyhodí Error 2.
Error 1
```
{
    "errors": {
        "__typename": "EventGQLModelUpdateError",
        "msg": "update failed",
        "failed": true
    }
}
```
Error 2
```
{
    "name": "GraphQLResponseError",
    "errors": [
        {
            "message": "This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"\nDETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.\n[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]\n[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]\n(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
            "path": [
                "eventInsert"
            ],
            "extensions": {
                "serviceName": "office",
                "code": "DOWNSTREAM_SERVICE_ERROR",
                "exception": {
                    "message": "This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"\nDETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.\n[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]\n[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]\n(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                    "stacktrace": [
                        "GraphQLError: This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"",
                        "DETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.",
                        "[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]",
                        "[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]",
                        "(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                        "    at Object.err (/usr/src/app/node_modules/@apollo/federation-internals/dist/error.js:11:32)",
                        "    at downstreamServiceError (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:523:120)",
                        "    at /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:341:59",
                        "    at Array.map (<anonymous>)",
                        "    at sendOperation (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:341:44)",
                        "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
                        "    at async /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:255:49",
                        "    at async executeNode (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:200:17)",
                        "    at async /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:96:35",
                        "    at async /usr/src/app/node_modules/@apollo/gateway/dist/index.js:112:38"
                    ]
                },
                "stacktrace": [
                    "GraphQLError: This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"",
                    "DETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.",
                    "[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]",
                    "[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]",
                    "(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                    "    at createGraphQLError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:32:12)",
                    "    at createGraphQLError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:27:33)",
                    "    at Object.relocatedError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:35:12)",
                    "    at mergeDataAndErrors (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:481:28)",
                    "    at checkResultAndHandleErrors (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:457:36)",
                    "    at Transformer.transformResult (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:1724:12)",
                    "    at handleExecutorResult (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:2431:26)",
                    "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
                ]
            }
        }
    ],
    "response": {
        "errors": [
            {
                "message": "This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"\nDETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.\n[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]\n[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]\n(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                "path": [
                    "eventInsert"
                ],
                "extensions": {
                    "serviceName": "office",
                    "code": "DOWNSTREAM_SERVICE_ERROR",
                    "exception": {
                        "message": "This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"\nDETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.\n[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]\n[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]\n(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                        "stacktrace": [
                            "GraphQLError: This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"",
                            "DETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.",
                            "[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]",
                            "[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]",
                            "(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                            "    at Object.err (/usr/src/app/node_modules/@apollo/federation-internals/dist/error.js:11:32)",
                            "    at downstreamServiceError (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:523:120)",
                            "    at /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:341:59",
                            "    at Array.map (<anonymous>)",
                            "    at sendOperation (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:341:44)",
                            "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
                            "    at async /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:255:49",
                            "    at async executeNode (/usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:200:17)",
                            "    at async /usr/src/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:96:35",
                            "    at async /usr/src/app/node_modules/@apollo/gateway/dist/index.js:112:38"
                        ]
                    },
                    "stacktrace": [
                        "GraphQLError: This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (sqlalchemy.dialects.postgresql.asyncpg.IntegrityError) <class 'asyncpg.exceptions.UniqueViolationError'>: duplicate key value violates unique constraint \"events_pkey\"",
                        "DETAIL:  Key (id)=(b3fa7b40-e83a-4f77-a00e-3cc9679dd626) already exists.",
                        "[SQL: INSERT INTO events (path, name, name_en, description, startdate, enddate, place, facility_id, masterevent_id, type_id, id, createdby_id, changedby_id, rbacobject_id) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::TIMESTAMP WITHOUT TIME ZONE, $6::TIMESTAMP WITHOUT TIME ZONE, $7::VARCHAR, $8::UUID, $9::UUID, $10::UUID, $11::UUID, $12::UUID, $13::UUID, $14::UUID) RETURNING events.created, events.lastchange]",
                        "[parameters: ('b3fa7b40-e83a-4f77-a00e-3cc9679dd626', 'tets', None, None, None, None, None, None, UUID('3e52a301-caad-46ba-8fe6-1a7e2f370866'), None, UUID('b3fa7b40-e83a-4f77-a00e-3cc9679dd626'), UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'), None, UUID('51d101a0-81f1-44ca-8366-6cf51432e8d6'))]",
                        "(Background on this error at: https://sqlalche.me/e/20/gkpj) (Background on this error at: https://sqlalche.me/e/20/7s2a)",
                        "    at createGraphQLError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:32:12)",
                        "    at createGraphQLError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:27:33)",
                        "    at Object.relocatedError (/usr/src/app/node_modules/@graphql-tools/utils/cjs/errors.js:35:12)",
                        "    at mergeDataAndErrors (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:481:28)",
                        "    at checkResultAndHandleErrors (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:457:36)",
                        "    at Transformer.transformResult (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:1724:12)",
                        "    at handleExecutorResult (/usr/src/app/node_modules/@graphql-tools/delegate/dist/index.cjs:2431:26)",
                        "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
                    ]
                }
            }
        ],
        "data": null
    }
}
```

## 7.5.2026

- úprava Queries: DeleteAsyncAction.jsx, InsertAsyncAction.jsx, UpdateAsyncAction.jsx, Fragments.jsx
- úprava Mutations: Create.jsx, Delete.jsx, InteractiveMutations.jsx, Update.jsx
- úprava Components: MediumEditableContent.jsx
- **Problémy/errory**: chybějící role "Plánovací administrátor", problémy s permissions

## 28.4.2026

- publikace verze 0.0.3

## 12.4.2026

- úprava MediumContent
- příprava na projektový den 1
- zaručení propojení s EventGQLModel

## 9.4.2026

- vytvoření app_kalendar
- nastavení kalendar jako uri
- přidání package kalendar

## 3.4.2026

- script `createscalar.js`
- script `createvector.js`
- template `EmptyVectorsAttribute.jsx`



# Jak spustit konrétní app

```cmd
npm run dev -w @hrbolek/app_dynamic
```

# Jak sestavit konrétní app

```cmd
npm run build -w @hrbolek/app_dynamic
```
