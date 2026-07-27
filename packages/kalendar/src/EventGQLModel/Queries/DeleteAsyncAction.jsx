import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * DeleteMutationStr — GraphQL mutace pro smazání události.
 *
 * Parametry:
 *   $id         — UUID události kterou chceme smazat (povinné)
 *   $lastchange — timestamp poslední změny (povinné)
 *                 Optimistický zámek — zabrání smazání záznamu který byl
 *                 mezitím změněn někým jiným. Server porovná lastchange
 *                 s hodnotou v DB a odmítne operaci při neshodě.
 *
 * API vrací union type:
 *   EventGQLModelDeleteError — nastane pokud smazání selže
 *                              (záznam neexistuje, nemáš práva, lastchange nesedí)
 *   Prázdný objekt           — smazání proběhlo úspěšně
 *
 * Poznámka: Záměrně nevracíme smazanou entitu zpět — po smazání
 * ji stejně odstraníme z Redux store (to řeší SafeDeleteAsyncAction v Delete.jsx).
 *
 * @type {string}
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
 * DeleteMutation — sestavená GraphQL mutace připravená pro odeslání.
 *
 * createQueryStrLazy vytvoří "línou" funkci — query se sestaví až při
 * prvním zavolání, ne při importu modulu.
 */
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`);

/**
 * DeleteAsyncAction — Redux thunk akce pro smazání události.
 *
 * Volá GraphQL mutaci eventDelete s parametry id a lastchange.
 * Výchozí middleware projde odpověď a uloží případné entity do store.
 * V případě úspěšného smazání odpověď neobsahuje žádnou entitu —
 * odebrání ze store řeší nadřazená komponenta (Delete.jsx).
 *
 * Není volána přímo — místo ní se používá SafeDeleteAsyncAction z Delete.jsx
 * která nejdříve zkontroluje zda událost nemá pod-události.
 *
 * @param {Object} params - parametry mutace
 * @param {string} params.id - UUID události ke smazání
 * @param {string} params.lastchange - timestamp poslední změny (optimistický zámek)
 *
 * @example
 * dispatch(DeleteAsyncAction({ id: item.id, lastchange: item.lastchange }, gqlClient))
 */
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation);