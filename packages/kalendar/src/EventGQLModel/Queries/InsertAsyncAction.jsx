import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { LargeFragment } from "./Fragments";

/**
 * InsertMutationStr — GraphQL mutace pro vytvoření nové události.
 *
 * Parametry:
 *   $mastereventId — UUID nadřazené události (povinné)
 *                    Musí být UUID eventu z originální DB tabulky —
 *                    eventy z eventCreatePlan nejdou použít jako rodič.
 *   $id            — UUID nové události (volitelné, generuje se na klientovi)
 *   $name          — název události
 *   $nameEn        — anglický název
 *   $description   — popis události
 *   $startDate     — datum začátku (camelCase D — liší se od query kde je startdate!)
 *   $endDate       — datum konce (camelCase D)
 *   $subevents     — seznam pod-událostí pro hromadné vytvoření
 *
 * API vrací union type:
 *   EventGQLModel            — úspěšné vytvoření, vrátí vytvořenou entitu s LargeFragment daty
 *   EventGQLModelInsertError — chyba (msg, failed, code, location, input pro debug)
 *
 * Používá LargeFragment který záměrně NEobsahuje invitations (backend bug —
 * mikroslužba vrací Python generator místo pole).
 *
 * @type {string}
 */
const InsertMutationStr = `
mutation eventInsert(
  $mastereventId: UUID!,
  $name: String,
  $nameEn: String,
  $description: String,
  $startDate: DateTime,
  $endDate: DateTime,
  $id: UUID,
  $subevents: [EventInsertGQLModel!]
) {
  eventInsert(event: {
    mastereventId: $mastereventId,
    name: $name,
    nameEn: $nameEn,
    description: $description,
    startDate: $startDate,
    endDate: $endDate,
    id: $id,
    subevents: $subevents
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
`;

/**
 * InsertMutation — sestavená GraphQL mutace s LargeFragment závislostí.
 * createQueryStrLazy zajistí líné sestavení — query se vytvoří až při prvním volání.
 */
const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment);

/**
 * InsertAsyncAction — Redux thunk akce pro vytvoření nové události.
 *
 * Po úspěšném vytvoření middleware automaticky uloží novou entitu
 * do Redux store (přes LargeFragment data v odpovědi).
 *
 * Volá se z CreateButton/CreateDialog/CreateBody v Create.jsx.
 * Před voláním Create.jsx sestaví newItem s vygenerovaným UUID
 * a mastereventId z nadřazené události.
 *
 * @param {Object} params - parametry mutace
 * @param {string} params.mastereventId - UUID nadřazené události (povinné)
 * @param {string} [params.id] - UUID nové události (generuje se automaticky)
 * @param {string} [params.name] - název události
 * @param {string} [params.nameEn] - anglický název
 * @param {string} [params.description] - popis
 * @param {string} [params.startDate] - datum začátku (ISO string, camelCase D)
 * @param {string} [params.endDate] - datum konce (ISO string, camelCase D)
 *
 * @example
 * dispatch(InsertAsyncAction({
 *     id: crypto.randomUUID(),
 *     mastereventId: "3e52a301-caad-46ba-8fe6-1a7e2f370866",
 *     name: "Nová událost"
 * }, gqlClient))
 */
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation);