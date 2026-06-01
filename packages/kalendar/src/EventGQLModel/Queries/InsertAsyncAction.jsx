import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { LargeFragment } from "./Fragments";

/**
 * GraphQL mutace pro vytvoření nové události.
 *
 * Parametry:
 *   $mastereventId - UUID nadřazené události (povinné)
 *   $id            - UUID nové události (volitelné)
 *   $name          - název události
 *   $nameEn        - anglický název
 *   $description   - popis
 *   $startDate     - datum začátku (camelCase D)
 *   $endDate       - datum konce (camelCase D)
 *   $subevents     - seznam pod-událostí
 *
 * Používá LargeFragment který neobsahuje invitations (backend bug).
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

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment);

export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation);