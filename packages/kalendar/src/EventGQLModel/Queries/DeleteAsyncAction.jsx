import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Plochá a bezpečná mutace. Vracíme pouze typy a případnou chybu.
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

const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`);

// Nativní volání akce bez externích normalizérů, které způsobovaly pád
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation);