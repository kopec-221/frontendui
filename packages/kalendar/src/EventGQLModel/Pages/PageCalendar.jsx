import { useState, useMemo, useEffect } from "react"
import { useInfiniteScroll } from "../../../../dynamic/src/Hooks/useInfiniteScroll"
import { ReadPageAsyncAction } from "../Queries"
import { CalendarView } from "../Components/CalendarView"
import { PageBase } from "./PageBase"

export const PageCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    /**
     * Načítáme s orderby: "startdate" aby byly nejnovější eventy první.
     * Bez orderby databáze vrátí eventy v náhodném nebo interním pořadí
     * a nové eventy mohou být mimo limit 500.
     *
     * limit: 1000 — zvýšeno aby pokrylo více eventů.
     * Ideální by byl where filtr na server ale API má bug s datetime filtrem.
     */
    const { items, loading, error, restart } = useInfiniteScroll({
        asyncAction: ReadPageAsyncAction,
        actionParams: { skip: 0, limit: 1000, orderby: "startdate" },
    })

    useEffect(() => {
        restart({ skip: 0, limit: 1000, orderby: "startdate" })
    }, [])

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

    const handlePrev = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    const handleNext = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

    return (
        <PageBase>
            {loading && <div className="text-center text-muted py-2">Načítám události...</div>}
            {error && <div className="alert alert-warning mx-3">Chyba: {error?.message}</div>}
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