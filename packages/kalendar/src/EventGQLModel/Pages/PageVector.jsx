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
import { CreateRootEventButton } from "../Components/CreateRootEventButton"

/**
 * safeParseWhere — bezpečně parsuje JSON where filtr z URL query parametru.
 * Vrátí null pokud parametr chybí nebo není validní JSON objekt.
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

const filterParameterName = "gr_where"

/**
 * PageVector — seznam všech událostí s filtrací, infinite scrollem
 * a tlačítkem pro vytvoření nové kořenové události.
 *
 * Obsahuje:
 *   CreateRootEventButton — tlačítko "+ Nová událost" nahoře
 *   Collapsible filtr     — skrývatelný panel s filtračními poli
 *   Table                 — tabulka eventů s infinite scrollem
 */
export const PageVector = ({ children, queryAsyncAction = ReadPageAsyncAction }) => {
    const [sp] = useSearchParams()

    /**
     * whereFromUrl — where filtr načtený z URL query parametru.
     * Mění se když uživatel klikne na Filtrovat nebo Vymazat filtr.
     */
    const whereFromUrl = useMemo(
        () => safeParseWhere(sp, filterParameterName),
        [sp.toString()]
    )

    const { items, loading, error, hasMore, sentinelRef, loadMore, restart } = useInfiniteScroll({
        asyncAction: queryAsyncAction,
        actionParams: { skip: 0, limit: 25, where: whereFromUrl },
    })

    useEffect(() => {
        const params = { skip: 0, limit: 25, where: whereFromUrl }
        restart(params)
    }, [whereFromUrl])

    return (
        <PageBase>
            {/* Tlačítko pro vytvoření nové kořenové události */}
            <div className="mb-3 px-3 pt-3">
                <CreateRootEventButton />
            </div>

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