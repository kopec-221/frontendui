import { useState, useMemo, useEffect } from "react"
import { useInfiniteScroll } from "../../../../dynamic/src/Hooks/useInfiniteScroll"
import { ReadPageAsyncAction } from "../Queries"
import { CalendarView } from "../Components/CalendarView"
import { PageBase } from "./PageBase"

/**
 * PageCalendar — stránka s měsíční kalendářovou mřížkou.
 *
 * Jak načítá data:
 *   Používá useInfiniteScroll stejně jako PageVector — bez autoload,
 *   restart se volá v useEffect při mountu. Hook si interně vezme
 *   gqlClient přes useGQLClient() a dispatch přes useDispatch().
 *
 *   items jsou zpočátku prázdné (Array(0)) a naplní se po prvním
 *   HTTP requestu — React automaticky překreslí kalendář s daty.
 *
 * Filtrování:
 *   Načteme všechny eventy (limit 500) a filtrujeme na klientovi
 *   podle aktuálního měsíce. Při přepnutí měsíce se filtr přepočítá
 *   bez nového HTTP requestu — je to rychlé.
 */
export const PageCalendar = () => {
    /**
     * currentDate — aktuálně zobrazovaný měsíc.
     * Inicializujeme na dnešek — první zobrazený měsíc = aktuální.
     */
    const [currentDate, setCurrentDate] = useState(new Date())

    /**
     * useInfiniteScroll — načte eventy ze serveru.
     * Přesně stejný pattern jako PageVector který funguje správně.
     *
     * Vrací:
     *   items   - pole EventGQLModel objektů (zpočátku [], pak 500 po načtení)
     *   loading - true dokud nepřijde odpověď
     *   error   - chybová hláška nebo null
     *   restart - funkce pro reset a nové načtení
     */
    const { items, loading, error, restart } = useInfiniteScroll({
        asyncAction: ReadPageAsyncAction,
        actionParams: { skip: 0, limit: 500 },
    })

    /**
     * useEffect — spustí načítání při mountu stránky.
     * restart() vymaže stávající items a načte znovu.
     * Prázdné dependency pole [] = spustí se jen jednou při mountu.
     */
    useEffect(() => {
        restart({ skip: 0, limit: 500 })
    }, [])

    /**
     * filteredItems — eventy pro aktuálně zobrazený měsíc.
     * Přepočítá se při každé změně items nebo currentDate.
     * Filtruje podle startdate — event patří do měsíce pokud jeho
     * startdate spadá do rozsahu prvního a posledního dne měsíce.
     */
    const filteredItems = useMemo(() => {
        if (!items || items.length === 0) return []
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const start = new Date(year, month, 1)
        const end = new Date(year, month + 1, 1)
        return items.filter(ev => {
            if (!ev?.startdate) return false
            const d = new Date(ev.startdate)
            return d >= start && d < end
        })
    }, [items, currentDate])

    /**
     * handlePrev/handleNext — přepínání měsíců.
     * Vytvoří nový Date objekt → currentDate se změní
     * → filteredItems se přepočítá v useMemo → kalendář se překreslí.
     * Žádný nový HTTP request — data jsou již v items.
     */
    const handlePrev = () => setCurrentDate(
        prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
    const handleNext = () => setCurrentDate(
        prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )

    return (
        <PageBase>
            {/* Spinner během načítání */}
            {loading && (
                <div className="text-center text-muted py-3" style={{ fontSize: "14px" }}>
                    Načítám události...
                </div>
            )}

            {/* Chybová hláška pokud request selže */}
            {error && (
                <div className="alert alert-warning mx-3">
                    Nepodařilo se načíst události: {error?.message || "neznámá chyba"}
                </div>
            )}

            {/*
             * CalendarView — čistě vizuální komponenta.
             * Dostane filteredItems pro aktuální měsíc a vykreslí mřížku.
             * Při prvním renderu dostane [] (loading) — zobrazí prázdnou mřížku.
             * Po načtení dat React překreslí komponentu s plnými daty.
             */}
            <div style={{ padding: "0 16px 16px" }}>
                <CalendarView
                    items={filteredItems}
                    currentDate={currentDate}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </PageBase>
    )
}