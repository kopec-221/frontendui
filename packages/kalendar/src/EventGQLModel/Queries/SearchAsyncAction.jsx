import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { LargeFragment } from "./Fragments"
import { reduceToFirstEntity } from "../../../../dynamic/src/Store"

/**
 * SearchQueryStr — GraphQL query pro vyhledávání uživatelů podle emailu.
 *
 * Používá alias "result" pro výstup (result: userPage) — standardní konvence
 * pro search queries která umožňuje obecnému middleware najít výsledky.
 *
 * Parametry:
 *   $skip    — offset pro stránkování výsledků
 *   $limit   — maximální počet vrácených výsledků
 *   $pattern — vzor pro vyhledávání emailu (case-insensitive _ilike, např. "jan@")
 *
 * Vrací pole UserGQLModel s LargeFragment daty.
 *
 * @type {string}
 */
const SearchQueryStr = `
query SearchQuery($skip: Int, $limit: Int, $pattern: String) {
  result: userPage(skip: $skip, limit: $limit, where: {email: {_ilike: $pattern}}) {
    ...Large
  }
}
`

/**
 * SearchAsyncActionQuery — sestavená GraphQL query s LargeFragment závislostí.
 * Exportována pro případné přímé použití nebo testování.
 */
export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, LargeFragment)

/**
 * SearchAsyncAction — Redux thunk akce pro vyhledávání uživatelů podle emailu.
 *
 * Používá se v EntityLookup polích formuláře pro autocomplete vyhledávání —
 * například při přiřazování uživatele k události.
 * Výsledky se automaticky uloží do Redux store.
 *
 * @param {Object} params - parametry query
 * @param {string} params.pattern - vzor pro vyhledávání emailu (např. "jan@example")
 * @param {number} [params.skip=0] - offset pro stránkování
 * @param {number} [params.limit=10] - maximální počet výsledků
 * @returns {Function} Redux thunk který provede GraphQL dotaz a uloží výsledky do store
 *
 * @example
 * dispatch(SearchAsyncAction({ pattern: "jan@", limit: 10 }, gqlClient))
 */
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery)