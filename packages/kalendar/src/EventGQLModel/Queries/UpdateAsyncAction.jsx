import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * Plochá mutace bez problematických relací. 
 * Tím se vyhneme chybě <generator> v mikroslužbě Office.
 */
const UpdateMutationStr = `
mutation eventUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $nameEn: String, $description: String, $startdate: DateTime, $enddate: DateTime) {
  eventUpdate(event: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn, description: $description, startdate: $startdate, enddate: $enddate}) {
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

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`);

export const UpdateAsyncAction = createAsyncGraphQLAction2(
  UpdateMutation, 
  updateItemsFromGraphQLResult, 
  reduceToFirstEntity
);