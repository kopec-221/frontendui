import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation eventUpdate($id: UUID!, $lastchange: DateTime!, $event_name: String, $event_nameEn: String, $event_description: String, $event_startdate: DateTime, $event_enddate: DateTime) {
  eventUpdate(event: {id: $id, lastchange: $lastchange, name: $event_name, nameEn: $event_nameEn, description: $event_description, startdate: $event_startdate, enddate: $event_enddate}) {
    ... on EventGQLModel { 
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      path
      name
      nameEn
      description
      startdate
      enddate
      duration_raw
      valid
      place
      facilityId
      mastereventId
      typeId
    }
    ... on EventGQLModelUpdateError { 
      __typename
      msg
      failed
      code
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