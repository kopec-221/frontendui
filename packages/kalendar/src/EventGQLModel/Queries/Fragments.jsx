import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

/**
 * LinkFragmentStr — minimální data pro zobrazení odkazu na událost.
 *
 * Obsahuje pouze základní skalární pole bez vnořených relací (kromě type).
 * Používá se jako základ pro MediumFragment a LargeFragment.
 *
 * Zahrnuje pole: __typename, id, lastchange, created, createdbyId,
 * changedbyId, rbacobjectId, name, nameEn, startdate, enddate,
 * valid, place, typeId, type { id, name }
 *
 * @type {string}
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
 * MediumFragmentStr — rozšiřuje LinkFragment o popis, facility a RBAC role.
 *
 * Přidává k LinkFragment: description, duration_raw, facilityId,
 * mastereventId a rbacobject s rolemi aktuálního uživatele.
 * Používá se pro zobrazení v kartách a tabulkách kde potřebujeme
 * znát oprávnění uživatele.
 *
 * @type {string}
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
 * LargeFragmentStr — plná data události včetně všech relací.
 *
 * Rozšiřuje MediumFragment o: createdby, changedby, facility, subevents.
 * Používá se na detail stránce (PageReadItem) kde potřebujeme všechna data.
 *
 * DŮLEŽITÉ: UserGQLModel záměrně NEobsahuje pole "invitations" —
 * backend mikroslužba "office" má bug kde vrací Python <generator>
 * místo pole pro invitations. To způsobuje chybu celého GraphQL requestu.
 * Proto jsou createdby a changedby omezeny pouze na { id, email }.
 *
 * @type {string}
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
 * RBACFragmentStr — role aktuálního uživatele na konkrétní entitě.
 *
 * Vrací currentUserRoles které obsahují informace o rolích uživatele
 * (název role, platnost, skupina...). Používá se pro kontrolu oprávnění
 * — zda má uživatel právo editovat nebo mazat danou entitu.
 *
 * @type {string}
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

/**
 * RBACFragment — sestavený fragment pro RBAC role.
 * Používá se jako závislost v MediumFragment.
 */
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)

/**
 * LinkFragment — sestavený fragment s minimálními daty události.
 * Základ pro MediumFragment a LargeFragment.
 */
export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)

/**
 * MediumFragment — sestavený fragment s rozšířenými daty události.
 * Závisí na LinkFragment a RBACFragment.
 */
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)

/**
 * LargeFragment — sestavený fragment s plnými daty události včetně relací.
 * Závisí na MediumFragment (který závisí na LinkFragment a RBACFragment).
 * Používá se v ReadAsyncAction a ReadPageAsyncAction.
 */
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)