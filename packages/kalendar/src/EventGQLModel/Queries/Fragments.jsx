import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

/**
 * LinkFragment — minimální data pro zobrazení odkazu na událost.
 * Obsahuje jen základní skalární pole bez relací.
 */
const LinkFragmentStr = `
fragment Link on EventGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  startdate
  enddate
  valid
  place
  typeId
  type {
    __typename
    id
    name
  }
}
`

/**
 * MediumFragment — rozšiřuje Link o popis a RBAC role.
 * Používá se pro zobrazení v kartách a tabulkách.
 */
const MediumFragmentStr = `
fragment Medium on EventGQLModel {
  ...Link
  description
  duration_raw
  facilityId
  mastereventId
  rbacobject {
    ...RBRoles
  }
}
`

/**
 * LargeFragment — plná data události včetně relací.
 * Používá se na detail stránce.
 * 
 * POZOR: User fragment záměrně NEobsahuje "invitations" ani "studies" —
 * backend mikroslužba "office" má bug kde vrací Python <generator>
 * místo pole pro invitations, což způsobuje chybu celého requestu.
 */
const LargeFragmentStr = `
fragment Large on EventGQLModel {
  ...Medium
  createdby {
     __typename
     id
     email
  }
  changedby {
     __typename
     id
     email
  }
  facility {
     __typename
     id
     name
     address
  }
  subevents { 
     __typename
     id
     name
  }
}
`

/**
 * RBACFragment — role aktuálního uživatele na entitě.
 * Používá se pro kontrolu oprávnění (může editovat/mazat?).
 */
const RBACFragmentStr = `
fragment RBRoles on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    lastchange
    valid
    startdate
    enddate
    roletype {
      __typename
      id
      name
    }
    group {
      __typename
      id
      name
      grouptype {
        __typename
        id
        name
      }
    }
  }
}`

export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)

export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)