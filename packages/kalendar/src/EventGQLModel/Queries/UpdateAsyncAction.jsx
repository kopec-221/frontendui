import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * GraphQL mutace pro aktualizaci existující události.
 *
 * Parametry které EventUpdateGQLModel podporuje:
 *   $id          - UUID události (povinné)
 *   $lastchange  - optimistický zámek (povinné)
 *   $name        - název
 *   $nameEn      - anglický název
 *   $description - popis
 *   $startdate   - datum začátku
 *   $enddate     - datum konce
 *
 * POZNÁMKA: $place není v EventUpdateGQLModel implementováno na backendu.
 * Pokus o jeho odeslání vrátí: "Field place is not defined by type EventUpdateGQLModel"
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

const UpdateMutation = createQueryStrLazy(UpdateMutationStr);

export const UpdateAsyncAction = createAsyncGraphQLAction2(
  UpdateMutation,
  updateItemsFromGraphQLResult,
  reduceToFirstEntity
);