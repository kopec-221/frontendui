import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const DeleteMutationStr = `
mutation eventDelete($event_id: UUID!, $event_lastchange: DateTime!) {
  eventDelete(event: {id: $event_id, lastchange: $event_lastchange}) {
  ...EventGQLModelDeleteError
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

fragment EventGQLModelDeleteError on EventGQLModelDeleteError {
  __typename
  Entity { ...Event }
  msg
  code
  failed
  location
  input
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)