import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL mutace pro smazání události.
 *
 * Parametry:
 *   $id         - UUID události kterou chceme smazat (povinné)
 *   $lastchange - timestamp poslední změny (povinné, stejný princip jako u update —
 *                 optimistický zámek zabraňující smazání záznamu který byl
 *                 mezitím změněn někým jiným)
 *
 * API vrací pouze error typ (na rozdíl od insert/update):
 *   EventGQLModelDeleteError - nastane pokud smazání selže
 *                              (záznam neexistuje, nemáš práva, atd.)
 *   Pokud smazání proběhne v pořádku, API vrátí prázdný objekt.
 *
 * Poznámka: Záměrně nevracíme smazanou entitu zpět — po smazání
 * ji stejně odstraníme z Redux store (to řeší Delete.jsx).
 */
const DeleteMutationStr = `
mutation eventDelete($id: UUID!, $lastchange: DateTime!) {
  eventDelete(event: {id: $id, lastchange: $lastchange}) {
    __typename
    ... on EventGQLModelDeleteError {
      __typename
      msg
      code
      failed
    }
  }
}
`;

/**
 * createQueryStrLazy — "líná" funkce, sestaví query až při prvním zavolání.
 */
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`);

/**
 * DeleteAsyncAction — Redux thunk akce pro smazání události.
 *
 * Používá výchozí middleware addItemsFromGraphQLResult který projde
 * odpověď a uloží entity do store. V případě delete odpověď typicky
 * neobsahuje žádnou entitu, takže store zůstane nezměněný — odebrání
 * ze store řeší až nadřazená komponenta (Delete.jsx) po úspěšném volání.
 *
 * Použití:
 *   dispatch(DeleteAsyncAction({ id, lastchange }, gqlClient))
 */
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation);