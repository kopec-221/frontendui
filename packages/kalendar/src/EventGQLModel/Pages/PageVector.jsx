import { ReadPageAsyncAction } from "../Queries"
import { useInfiniteScroll } from "../../../../dynamic/src/Hooks/useInfiniteScroll"
import { PageBase } from "./PageBase"
import { Table } from "../Components/Table"
import { Filter } from "../Components/Filter"
import { FilterButton, ResetFilterButton } from "../../../../_template/src/Base/FormControls/Filter"
import { useSearchParams } from "react-router"
import { useEffect, useMemo } from "react"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Collapsible } from "../../../../_template/src/Base/FormControls/Collapsible"

/**
 * safeParseWhere — bezpečně parsuje JSON where filtr z URL query parametru.
 *
 * Vrátí null pokud:
 *   - parametr v URL chybí
 *   - hodnota není validní JSON
 *   - hodnota není objekt (např. je to string nebo číslo)
 *
 * @param {URLSearchParams} sp - URL search params objekt
 * @param {string} [paramName="where"] - název URL parametru s filtrem
 * @returns {Object|null} parsovaný where objekt nebo null
 */
function safeParseWhere(sp, paramName = "where") {
    const raw = sp.get(paramName)
    if (!raw) return null
    try {
        const obj = JSON.parse(raw)
        return obj && typeof obj === "object" ? obj : null
    } catch {
        return null
    }
}

/**
 * filterParameterName — název URL query parametru pro uložení where filtru.
 *
 * Filtr se ukládá jako JSON do URL aby byl sdílitelný odkazem.
 * Příklad URL: /list/?gr_where={"name":{"_ilike":"%projekt%"}}
 *
 * @type {string}
 */
const filterParameterName = "gr_where"

/**
 * PageVector — seznam všech událostí s filtrací a infinite scrollem.
 *
 * URL: /kalendar/EventGQLModel/list/
 *
 * Obsahuje:
 *   - skrývatelný filtrační panel (Název, Začátek od, Konec do)
 *   - tabulku událostí s kliknutím na řádek → detail stránka
 *   - infinite scroll pro automatické načítání dalších záznamů
 *
 * Jak funguje filtr:
 *   1. Uživatel vyplní pole a klikne "Filtrovat"
 *   2. FilterButton uloží where JSON do URL parametru gr_where
 *   3. useSearchParams detekuje změnu URL
 *   4. useMemo přepočítá whereFromUrl
 *   5. useEffect detekuje změnu whereFromUrl a zavolá restart()
 *   6. restart() načte data znovu od začátku s novým filtrem
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah
 * @param {Function} [props.queryAsyncAction=ReadPageAsyncAction]
 *   Async action pro načtení seznamu událostí. Lze přepsat pro customizaci dotazu.
 * @returns {JSX.Element}
 */
export const PageVector = ({ children, queryAsyncAction = ReadPageAsyncAction }) => {
    const [sp] = useSearchParams()

    /**
     * whereFromUrl — where filtr načtený z URL query parametru gr_where.
     *
     * useMemo zajistí že se JSON.parse nevolá při každém renderu,
     * ale pouze když se změní URL search params.
     */
    const whereFromUrl = useMemo(
        () => safeParseWhere(sp, filterParameterName),
        [sp.toString()]
    )

    const { items, loading, error, hasMore, sentinelRef, loadMore, restart } = useInfiniteScroll({
        asyncAction: queryAsyncAction,
        actionParams: { skip: 0, limit: 25, where: whereFromUrl },
    })

    /**
     * useEffect — spustí restart() při každé změně filtru.
     *
     * Prázdné pole závislostí by způsobilo načtení jen při mountu.
     * [whereFromUrl] zajistí opětovné načtení při každé změně filtru.
     */
    useEffect(() => {
        const params = { skip: 0, limit: 25, where: whereFromUrl }
        restart(params)
    }, [whereFromUrl])

    return (
        <PageBase>
            {/* Skrývatelný filtrační panel */}
            <Collapsible
                className="form-control btn btn-outline-primary"
                buttonLabelCollapsed="Zobrazit filtr"
                buttonLabelExpanded="Skrýt filtr"
            >
                <Filter>
                    <FilterButton
                        className="form-control btn btn-outline-success"
                        paramName={filterParameterName}
                    >
                        Filtrovat
                    </FilterButton>
                    <ResetFilterButton
                        className="form-control btn btn-warning"
                        paramName={filterParameterName}
                    >
                        Vymazat filtr
                    </ResetFilterButton>
                </Filter>
            </Collapsible>

            <Table data={items} />

            <AsyncStateIndicator error={error} loading={loading} text="Nahrávám další..." />

            {hasMore && <div ref={sentinelRef} style={{ height: 80, backgroundColor: "lightgray" }} />}
            {hasMore && <button className="btn btn-success form-control" onClick={() => loadMore()}>Více</button>}
        </PageBase>
    )
}