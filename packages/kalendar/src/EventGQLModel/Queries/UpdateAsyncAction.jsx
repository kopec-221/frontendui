import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * GraphQL mutace pro aktualizaci existující události.
 *
 * Parametry:
 *   $id          - UUID události kterou chceme upravit (povinné)
 *   $lastchange  - timestamp poslední změny (povinné, slouží jako optimistický zámek
 *                  aby dva uživatelé nepřepsali navzájem své změny)
 *   $name        - nový název události (volitelné)
 *   $nameEn      - nový anglický název (volitelné)
 *   $description - nový popis (volitelné)
 *   $startdate   - nové datum začátku (volitelné)
 *   $enddate     - nové datum konce (volitelné)
 *
 * API vrací union type:
 *   EventGQLModel            - úspěch, vrátí upravenou entitu
 *   EventGQLModelUpdateError - chyba (např. záznam mezitím někdo jiný změnil)
 */
const UpdateMutationStr = `
mutation eventUpdate(
  $id: UUID!,
  $lastchange: DateTime!,
  $name: String,
  $nameEn: String,
  $description: String,
  $startdate: DateTime,
  $enddate: DateTime
) {
  eventUpdate(event: {
    id: $id,
    lastchange: $lastchange,
    name: $name,
    nameEn: $nameEn,
    description: $description,
    startdate: $startdate,
    enddate: $enddate
  }) {
    __typename
    ... on EventGQLModel {
      __typename
      id
      lastchange
      name
      nameEn
      description
      startdate
      enddate
    }
    ... on EventGQLModelUpdateError {
      __typename
      msg
      failed
    }
  }
}
`;

/**
 * createQueryStrLazy — "líná" funkce která drží query string a sestaví
 * ho až při prvním zavolání. Umožňuje skládání fragmentů napříč soubory.
 */
const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`);

/**
 * UpdateAsyncAction — Redux thunk akce pro odeslání update mutace.
 *
 * Jak funguje middleware chain:
 *   1. createAsyncGraphQLAction2 odešle HTTP request na GraphQL endpoint
 *   2. updateItemsFromGraphQLResult — projde odpověď a uloží všechny
 *      nalezené entity (objekty s id + __typename) do Redux store
 *   3. reduceToFirstEntity — z odpovědi vytáhne první entitu a vrátí ji
 *      jako výsledek akce (aby volající mohl pracovat s updatovaným objektem)
 *
 * Použití:
 *   dispatch(UpdateAsyncAction({ id, lastchange, name, ... }, gqlClient))
 */
export const UpdateAsyncAction = createAsyncGraphQLAction2(
  UpdateMutation,
  updateItemsFromGraphQLResult,
  reduceToFirstEntity
);