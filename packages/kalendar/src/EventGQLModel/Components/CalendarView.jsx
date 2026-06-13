import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "../Components"


const DAYS_CZ = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
const MONTHS_CZ = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
]

/**
 * Bootstrap třídy pro barvy eventů.
 * Každý event dostane třídu podle svého id (hash).
 * Používáme Bootstrap badge/bg varianty.
 */
const EVENT_COLOR_CLASSES = [
    "bg-warning text-dark",
    "bg-primary text-white",
    "bg-success text-white",
    "bg-danger text-white",
    "bg-info text-dark",
    "bg-secondary text-white",
]

/**
 * getColorClassForEvent — vrátí Bootstrap třídy pro barvu eventu.
 * Hash z id zajistí že stejný event má vždy stejnou barvu napříč dny.
 */
const getColorClassForEvent = (event) => {
    if (!event?.id) return EVENT_COLOR_CLASSES[0]
    const hash = event.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return EVENT_COLOR_CLASSES[hash % EVENT_COLOR_CLASSES.length]
}

/**
 * formatTime — převede ISO datum string na čas "HH:MM".
 */
const formatTime = (dateString) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
}

/**
 * getEventsForDay — vrátí eventy které zasahují do daného dne.
 * Multi-day eventy se zobrazí ve všech dnech které pokrývají.
 */
const getEventsForDay = (events, year, month, day) => {
    const dayStart = new Date(year, month, day, 0, 0, 0)
    const dayEnd = new Date(year, month, day, 23, 59, 59)
    return events.filter(ev => {
        if (!ev?.startdate) return false
        const start = new Date(ev.startdate)
        const end = ev.enddate ? new Date(ev.enddate) : start
        return start <= dayEnd && end >= dayStart
    })
}

/**
 * EventPill — bloček eventu v buňce kalendáře.
 *
 * Vizuální logika pro multi-day eventy:
 *   První den  → zaoblené rohy vlevo, zobrazí čas + název
 *   Prostřední → žádné zaoblení
 *   Poslední   → zaoblené rohy vpravo
 *
 * Inline style zůstává jen pro border-radius (Bootstrap nemá jednostranné zaoblení)
 * a pro overflow/whitespace které Bootstrap nemá jako utility třídy.
 */
const EventPill = ({ event, colorClass, isFirstDay, isLastDay }) => {
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.stopPropagation()
        navigate(ReadItemURI.replace(":id", event.id))
    }

    const startTime = formatTime(event.startdate)
    const endTime = formatTime(event.enddate)

    /**
     * label — text který se zobrazí uvnitř bločku eventu v kalendáři.
     *
     * Rozhoduje co zobrazit podle toho kde v multi-day rozsahu se buňka nachází.
     * Používá ternární operátory (podmínka ? "true" : "false") místo if/else.
     * Používá template literals (`${proměnná}`) pro vkládání hodnot do stringu.
     *
     * Vysvětlení použitých vzorů:
     *   isFirstDay && isLastDay   = event trvá jen jeden den
     *   startTime ? x + " " : "" = pokud čas existuje, přidej ho + mezeru, jinak nic
     *   event.name || "—"        = použij název, nebo "—" pokud název chybí
     */
    const label = isFirstDay && isLastDay
        ? (startTime && endTime
            ? `${startTime}–${endTime} ${event.name || "—"}`
            : startTime
                ? `${startTime} ${event.name || "—"}`
                : event.name || "—")
        : isFirstDay
            ? `${startTime ? startTime + " " : ""}${event.name || "—"} →`
            : isLastDay
                ? `→ ${event.name || "—"}${endTime ? " " + endTime : ""}`
                : `→ ${event.name || "—"} →`

    /**
     * borderRadius — inline style jen pro jednostranné zaoblení.
     * Bootstrap nemá utility třídy pro zaoblení jen jedné strany.
     */
    const borderRadius = isFirstDay && isLastDay ? "4px"
        : isFirstDay ? "4px 0 0 4px"
        : isLastDay ? "0 4px 4px 0"
        : "0"

    return (
        <div
            onClick={handleClick}
            title={`${event.name}${startTime ? ` (${startTime}${endTime ? `–${endTime}` : ""})` : ""}`}
            className={`${colorClass} mb-1 px-1 small fw-medium`}
            style={{
                borderRadius,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: "11px",
            }}
        >
            {label}
        </div>
    )
}

/**
 * CalendarCell — jedna buňka v mřížce.
 * Inline style jen pro minHeight a border (Bootstrap border utility jsou příliš hrubé).
 */
const CalendarCell = ({ day, year, month, isToday, isOtherMonth, events, maxVisible = 2 }) => {
    const visibleEvents = events.slice(0, maxVisible)
    const hiddenCount = events.length - maxVisible

    return (
        <div
            className={`p-1 border-end border-bottom ${isOtherMonth ? "bg-light" : "bg-white"}`}
            style={{ minHeight: "90px" }}
        >
            {/* Číslo dne — Bootstrap badge pro dnešek */}
            <div className="mb-1">
                <span className={isToday
                    ? "badge bg-primary rounded-circle"
                    : isOtherMonth
                        ? "text-muted small"
                        : "small"
                }>
                    {day}
                </span>
            </div>

            {visibleEvents.map((ev) => {
                const evStart = ev.startdate ? new Date(ev.startdate) : null
                const evEnd = ev.enddate ? new Date(ev.enddate) : evStart

                const isFirstDay = evStart
                    ? (evStart.getFullYear() === year &&
                       evStart.getMonth() === month &&
                       evStart.getDate() === day)
                    : true

                const isLastDay = evEnd
                    ? (evEnd.getFullYear() === year &&
                       evEnd.getMonth() === month &&
                       evEnd.getDate() === day)
                    : true

                return (
                    <EventPill
                        key={ev.id}
                        event={ev}
                        colorClass={getColorClassForEvent(ev)}
                        isFirstDay={isFirstDay}
                        isLastDay={isLastDay}
                    />
                )
            })}

            {hiddenCount > 0 && (
                <small className="text-muted">+{hiddenCount} další</small>
            )}
        </div>
    )
}

/**
 * CalendarView — měsíční kalendářová mřížka.
 *
 * Inline style zůstává jen pro CSS grid (Bootstrap nemá 7-sloupcový grid)
 * a pro border-left/border-top mřížky.
 */
export const CalendarView = ({ items = [], currentDate, onPrev, onNext }) => {
    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const cells = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        let startDow = firstDay.getDay()
        startDow = startDow === 0 ? 6 : startDow - 1

        const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7
        const result = []

        for (let i = 0; i < totalCells; i++) {
            let day, cellYear = year, cellMonth = month, isOtherMonth = false

            if (i < startDow) {
                day = daysInPrevMonth - startDow + i + 1
                cellMonth = month - 1
                if (cellMonth < 0) { cellMonth = 11; cellYear-- }
                isOtherMonth = true
            } else if (i >= startDow + daysInMonth) {
                day = i - startDow - daysInMonth + 1
                cellMonth = month + 1
                if (cellMonth > 11) { cellMonth = 0; cellYear++ }
                isOtherMonth = true
            } else {
                day = i - startDow + 1
            }

            const isToday = (
                day === today.getDate() &&
                cellMonth === today.getMonth() &&
                cellYear === today.getFullYear()
            )

            const dayEvents = getEventsForDay(items, cellYear, cellMonth, day)
            result.push({ day, cellYear, cellMonth, isOtherMonth, isToday, dayEvents })
        }

        return result
    }, [year, month, items])

    return (
        <div>
            {/* Hlavička — název měsíce, tlačítko nové události, navigace */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0">{MONTHS_CZ[month]} {year}</h5>
                </div>
                <div className="btn-group btn-group-sm">
                    <button onClick={onPrev} className="btn btn-outline-secondary">‹</button>
                    <button onClick={onNext} className="btn btn-outline-secondary">›</button>
                </div>
            </div>

            {/* Mřížka — inline style jen pro 7-sloupcový grid který Bootstrap nemá */}
            <div
                className="border-start border-top"
                style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
                {/* Hlavička dní */}
                {DAYS_CZ.map(d => (
                    <div key={d} className="bg-light border-end border-bottom text-center text-muted small py-1 fw-medium">
                        {d}
                    </div>
                ))}

                {/* Buňky */}
                {cells.map((cell, i) => (
                    <CalendarCell
                        key={i}
                        day={cell.day}
                        year={cell.cellYear}
                        month={cell.cellMonth}
                        isToday={cell.isToday}
                        isOtherMonth={cell.isOtherMonth}
                        events={cell.dayEvents}
                    />
                ))}
            </div>
        </div>
    )
}