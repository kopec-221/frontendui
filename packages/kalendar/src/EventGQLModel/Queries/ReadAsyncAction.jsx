import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * ReadQueryStr — GraphQL query pro načtení jedné události podle UUID.
 *
 * Parametry:
 *   $id — UUID události (povinné)
 *
 * Vrací EventGQLModel s LargeFragment daty (všechna pole včetně subevents,
 * createdby, changedby, facility a RBAC rolí aktuálního uživatele).
 *
 * @type {string}
 */
const ReadQueryStr = `
query eventById($id: UUID!) {
  eventById(id: $id) {
    ...Large
  }
}
`

/**
 * ReadQuery — sestavená GraphQL query s LargeFragment závislostí.
 * createQueryStrLazy zajistí líné sestavení — query se vytvoří až při prvním volání.
 */
const ReadQuery = createQueryStrLazy(`${ReadQueryStr}`, LargeFragment)

/**
 * ReadAsyncAction — Redux thunk akce pro načtení jedné události podle id.
 *
 * Volá GraphQL query eventById a výsledek automaticky uloží do Redux store
 * přes middleware. Komponenty které čtou entitu přes useSelector() se
 * po uložení automaticky překreslí s novými daty.
 *
 * Používá se v PageItemBase při navigaci na /view/:id nebo /edit/:id —
 * PageItemBase zavolá tuto akci s id z URL parametru.
 *
 * @param {Object} params - parametry query
 * @param {string} params.id - UUID události k načtení
 * @returns {Function} Redux thunk který provede GraphQL dotaz a uloží výsledek do store
 *
 * @example
 * dispatch(ReadAsyncAction({ id: "3e52a301-caad-46ba-8fe6-1a7e2f370866" }, gqlClient))
 */
// export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery, reduceToFirstEntity("result"))
export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery)