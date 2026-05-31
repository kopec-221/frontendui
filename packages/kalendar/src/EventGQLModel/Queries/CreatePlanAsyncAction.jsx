import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { LargeFragment } from "./Fragments"

/**
 * GraphQL mutace pro vytvoření kořenového (root) eventu.
 *
 * Rozdíl oproti eventInsert:
 *   eventInsert vyžaduje $mastereventId (povinné) — event musí mít rodiče.
 *   eventCreatePlan nevyžaduje rodiče — vytvoří "top-level" event.
 *
 * Parametry:
 *   $rbacobjectId - UUID skupiny/objektu pod který event patří (povinné)
 *                   Typicky se použije rbacobjectId přihlášeného uživatele
 *                   nebo skupiny které je uživatel členem.
 *   $id           - UUID nového eventu (volitelné, server vygeneruje)
 *   $name         - název eventu
 *   $nameEn       - anglický název
 *   $description  - popis
 *   $startDate    - datum začátku (camelCase D)
 *   $endDate      - datum konce (camelCase D)
 *   $mastereventId - volitelný rodič (může zůstat null pro root event)
 */
const CreatePlanMutationStr = `
mutation eventCreatePlan(
  $rbacobjectId: UUID!,
  $id: UUID,
  $name: String,
  $nameEn: String,
  $description: String,
  $startDate: DateTime,
  $endDate: DateTime,
  $mastereventId: UUID
) {
  eventCreatePlan(event: {
    rbacobjectId: $rbacobjectId,
    id: $id,
    name: $name,
    nameEn: $nameEn,
    description: $description,
    startDate: $startDate,
    endDate: $endDate,
    mastereventId: $mastereventId
  }) {
    ... on EventGQLModel { ...Large }
    ... on EventGQLModelInsertError {
      __typename
      msg
      failed
      code
      location
      input
    }
  }
}
`

/**
 * createQueryStrLazy — sestaví query s LargeFragment (bez invitations — backend bug).
 */
const CreatePlanMutation = createQueryStrLazy(`${CreatePlanMutationStr}`, LargeFragment)

/**
 * CreatePlanAsyncAction — Redux thunk akce pro vytvoření root eventu.
 *
 * Použití:
 *   dispatch(CreatePlanAsyncAction({
 *     rbacobjectId: "uuid-skupiny",
 *     id: generateUUID(),
 *     name: "Nová událost"
 *   }, gqlClient))
 */
export const CreatePlanAsyncAction = createAsyncGraphQLAction2(CreatePlanMutation)