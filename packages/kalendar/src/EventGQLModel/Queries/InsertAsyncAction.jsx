import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const InsertMutationStr = `
mutation eventInsert($event_mastereventId: UUID!, $event_name: String, $event_nameEn: String, $event_description: String, $event_startDate: DateTime, $event_endDate: DateTime, $event_id: UUID, $event_subevents: [EventInsertGQLModel!]) {
  eventInsert(event: {mastereventId: $event_mastereventId, name: $event_name, nameEn: $event_nameEn, description: $event_description, startDate: $event_startDate, endDate: $event_endDate, id: $event_id, subevents: $event_subevents}) {
  ... on EventGQLModel { ...Event }
  ... on EventGQLModelInsertError { ...EventGQLModelInsertError }
}
}

fragment User on UserGQLModel {
      __typename
      id
      studies { id }
      invitations { id }
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      name
      givenname
      middlename
      email
      firstname
      surname
      valid
      startdate
      enddate
      typeId
      memberships { id }
      roles { id }
      isThisMe
      rolesOn { id }
      gdpr
      fullname
      memberOf { id }
    }

fragment RBACObject on RBACObjectGQLModel {
      __typename
      id
      roles { id }
      currentUserRoles { id }
    }

fragment Facility on FacilityGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      path
      name
      nameEn
      label
      startdate
      enddate
      address
      valid
      capacity
      geometry
      geolocation
      reservations { id }
      groupId
      facilitytypeId
      masterFacilityId
      type { id }
      masterFacility { id }
      masterFacilities { id }
      subFacilities { id }
      group { id }
    }

fragment EventFacilityReservation on EventFacilityReservationGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      eventId
      event { id }
      facilityId
      facility { id }
      stateId
      state { id }
    }

fragment EventType on EventTypeGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      path
      name
      nameEn
      description
      parentId
      parent { id }
      children { id }
      events { id }
    }

fragment EventInvitation on EventInvitationGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      eventId
      userId
      stateId
      event { id }
      user { id }
      state { id }
    }

fragment Event on EventGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { ...User }
    changedby { ...User }
    rbacobject { ...RBACObject }
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
    facility { ...Facility }
    facilityReservations { ...EventFacilityReservation }
    mastereventId
    masterevent { id }
    subevents { id }
    typeId
    type { ...EventType }
    userInvitations { ...EventInvitation }
  }

fragment EventGQLModelInsertError on EventGQLModelInsertError {
    __typename
    Entity { ...Event }
    msg
    failed
    code
    location
    input
  }
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)