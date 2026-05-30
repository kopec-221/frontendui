import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL mutace pro vytvoření nové události.
 *
 * Parametry:
 *   $mastereventId - UUID nadřazené události (povinné — každá událost musí
 *                    patřit pod nějakou "master" událost, tvoří stromovou strukturu)
 *   $id            - UUID nové události (volitelné, pokud není zadáno server vygeneruje)
 *   $name          - název události
 *   $nameEn        - anglický název
 *   $description   - popis
 *   $startDate     - datum začátku (pozor: camelCase D, liší se od update kde je lowercase)
 *   $endDate       - datum konce (stejný případ)
 *   $subevents     - seznam pod-událostí které se mají rovnou vytvořit (volitelné)
 *
 * API vrací union type:
 *   EventGQLModel            - úspěch, vrátí nově vytvořenou entitu se všemi poli
 *   EventGQLModelInsertError - chyba při vkládání (např. chybí povinné pole)
 *
 * Poznámka: Mutace vrací kompletní Event fragment se všemi relacemi
 * (facility, invitations, type...) aby Redux store měl hned plná data.
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
    ... on EventGQLModel { ...Event }
    ... on EventGQLModelInsertError { ...EventGQLModelInsertError }
  }
}

fragment User on UserGQLModel {
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
  studies { id }
  invitations { id }
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
`;

/**
 * createQueryStrLazy — sestaví query string líně (až při prvním zavolání).
 * Důvod: fragmenty se mohou nacházet v různých souborech a skládat se postupně.
 */
const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`);

/**
 * InsertAsyncAction — Redux thunk akce pro vytvoření nové události.
 *
 * Na rozdíl od UpdateAsyncAction zde nepoužíváme middleware
 * updateItemsFromGraphQLResult + reduceToFirstEntity, protože
 * výchozí middleware addItemsFromGraphQLResult (přidán automaticky
 * v createAsyncGraphQLAction2) stačí — nová entita se přidá do store.
 *
 * Použití:
 *   dispatch(InsertAsyncAction({ mastereventId, name, startDate, ... }, gqlClient))
 */
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation);