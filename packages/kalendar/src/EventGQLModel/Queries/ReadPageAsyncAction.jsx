import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * ReadPageQueryStr — GraphQL query pro načtení stránkovaného seznamu událostí.
 *
 * Parametry:
 *   $skip    — počet přeskočených záznamů pro stránkování (výchozí: 0)
 *   $limit   — maximální počet vrácených záznamů (výchozí: 25)
 *   $orderby — pole pro řazení výsledků (např. "startdate")
 *   $where   — filtrační podmínky typu EventInputFilter
 *              (např. { name: { _ilike: "%projekt%" }, startdate: { _gte: "2026-01-01" } })
 *
 * Vrací pole EventGQLModel s LargeFragment daty.
 *
 * @type {string}
 */
const ReadPageQueryStr = `
query eventPage($skip: Int, $limit: Int, $orderby: String, $where: EventInputFilter) {
  eventPage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...Large
  }
}
`

/**
 * ReadPageQuery — sestavená GraphQL query s LargeFragment závislostí.
 * createQueryStrLazy zajistí líné sestavení — query se vytvoří až při prvním volání.
 */
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment)

/**
 * ReadPageAsyncAction — Redux thunk akce pro načtení seznamu událostí.
 *
 * Volá GraphQL query eventPage a výsledky automaticky uloží do Redux store.
 * Používá se v PageVector přes hook useInfiniteScroll který zajišťuje
 * postupné načítání dat po dávkách (infinite scroll).
 *
 * Parametry se předávají při volání přes useInfiniteScroll:
 *   { skip: 0, limit: 25, where: whereFromUrl }
 *
 * @param {Object} params - parametry query
 * @param {number} [params.skip=0] - offset pro stránkování
 * @param {number} [params.limit=25] - maximální počet záznamů v jedné dávce
 * @param {string} [params.orderby] - pole pro řazení (např. "startdate")
 * @param {Object} [params.where] - where filtr (EventInputFilter objekt)
 * @returns {Function} Redux thunk který provede GraphQL dotaz a uloží výsledky do store
 *
 * @example
 * dispatch(ReadPageAsyncAction({ skip: 0, limit: 25, where: { name: { _ilike: "%projekt%" } } }, gqlClient))
 */
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery)