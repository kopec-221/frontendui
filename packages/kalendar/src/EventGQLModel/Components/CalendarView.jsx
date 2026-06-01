import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "../Components"
import { CreateRootEventButton } from "./CreateRootEventButton"

const DAYS_CZ = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
const MONTHS_CZ = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
]

/**
 * EVENT_COLORS — paleta barev pro eventy.
 * Každý event dostane barvu podle svého id (hash) — vždy stejnou barvu.
 */
const EVENT_COLORS = [
    { bg: "#FDE68A", text: "#78350F" },  // žlutá
    { bg: "#B5D4F4", text: "#0C447C" },  // modrá
    { bg: "#9FE1CB", text: "#085041" },  // zelená
    { bg: "#F5C4B3", text: "#712B13" },  // oranžová
    { bg: "#CECBF6", text: "#3C3489" },  // fialová
    { bg: "#FCA5A5", text: "#7F1D1D" },  // červená
    { bg: "#86EFAC", text: "#14532D" },  // tmavě zelená
    { bg: "#93C5FD", text: "#1E3A5F" },  // tmavě modrá
]

/**
 * getColorForEvent — každý event dostane barvu podle svého id.
 * Hash z id zajistí že stejný event má vždy stejnou barvu napříč dny.
 *
 * @param {Object} event - EventGQLModel
 * @returns {{ bg, text }} barvy
 */
const getColorForEvent = (event) => {
    if (!event?.id) return EVENT_COLORS[0]
    // Součet ASCII hodnot znaků id → index do palety
    const hash = event.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return EVENT_COLORS[hash % EVENT_COLORS.length]
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
 *   Prostřední → žádné zaoblení, šipka →
 *   Poslední   → zaoblené rohy vpravo, šipka →
 *
 * Tím vznikne iluze kontinuálního bločku přes více dní.
 */
const EventPill = ({ event, color, isFirstDay, isLastDay }) => {
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.stopPropagation()
        navigate(ReadItemURI.replace(":id", event.id))
    }

    const startTime = formatTime(event.startdate)
    const endTime = formatTime(event.enddate)

    /**
     * Label podle pozice eventu v multi-day rozsahu:
     *   Jednodení      → "08:00–09:30 Název"
     *   První den      → "08:00 Název →"
     *   Prostřední den → "→ Název →"
     *   Poslední den   → "→ Název 09:30"
     */
    const label = isFirstDay && isLastDay
        ? (startTime && endTime
            ? `${startTime}–${endTime} ${event.name || "—"}`
            : startTime
                ? `${startTime} ${event.name || "—"}`
                : event.name || "—")
        : isFirstDay
            ? `${startTime ? startTime + " " : ""}${event.name || "—"}`
            : isLastDay
                ? `${endTime ? endTime + " " : ""}${event.name || "—"}`
                : `${event.name || "—"}`

    // Zaoblení rohů podle pozice v multi-day eventu
    const borderRadius = isFirstDay && isLastDay
        ? "4px"                          // jen v jeden den — plně zaoblený
        : isFirstDay
            ? "4px 0 0 4px"              // první den — zaoblené vlevo
            : isLastDay
                ? "0 4px 4px 0"          // poslední den — zaoblené vpravo
                : "0"                    // prostřední — bez zaoblení

    // Margin pro kontinuální vzhled — první a poslední den mají malý margin
    const marginLeft = isFirstDay ? "2px" : "0"
    const marginRight = isLastDay ? "2px" : "0"

    return (
        <div
            onClick={handleClick}
            title={`${event.name}${startTime ? ` (${startTime}${endTime ? `–${endTime}` : ""})` : ""}`}
            style={{
                backgroundColor: color.bg,
                color: color.text,
                fontSize: "11px",
                padding: "2px 5px",
                borderRadius,
                marginBottom: "2px",
                marginLeft,
                marginRight,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                fontWeight: 500,
            }}
        >
            {label}
        </div>
    )
}

/**
 * CalendarCell — jedna buňka v mřížce.
 */
const CalendarCell = ({ day, year, month, isToday, isOtherMonth, events, maxVisible = 4 }) => {
    const visibleEvents = events.slice(0, maxVisible)
    const hiddenCount = events.length - maxVisible

    return (
        <div style={{
            minHeight: "90px",
            padding: "4px",
            borderRight: "0.5px solid #dee2e6",
            borderBottom: "0.5px solid #dee2e6",
            backgroundColor: isOtherMonth ? "#f8f9fa" : "#ffffff",
        }}>
            {/* Číslo dne */}
            <div style={{
                width: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "4px",
                borderRadius: "50%",
                backgroundColor: isToday ? "#378ADD" : "transparent",
                color: isToday ? "#fff" : isOtherMonth ? "#adb5bd" : "#212529",
                fontSize: "12px",
                fontWeight: isToday ? 700 : 400,
            }}>
                {day}
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
                        color={getColorForEvent(ev)}
                        isFirstDay={isFirstDay}
                        isLastDay={isLastDay}
                    />
                )
            })}

            {hiddenCount > 0 && (
                <div style={{ fontSize: "11px", color: "#6c757d", padding: "1px 4px" }}>
                    +{hiddenCount} další
                </div>
            )}
        </div>
    )
}

/**
 * CalendarView — měsíční kalendářová mřížka.
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
        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "14px" }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                padding: "0 4px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 500 }}>
                        {MONTHS_CZ[month]} {year}
                    </span>
                    <CreateRootEventButton />
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={onPrev} className="btn btn-outline-secondary btn-sm">‹</button>
                    <button onClick={onNext} className="btn btn-outline-secondary btn-sm">›</button>
                </div>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                borderLeft: "0.5px solid #dee2e6",
                borderTop: "0.5px solid #dee2e6",
            }}>
                {DAYS_CZ.map(d => (
                    <div key={d} style={{
                        backgroundColor: "#f8f9fa",
                        padding: "6px 4px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6c757d",
                        fontWeight: 500,
                        borderRight: "0.5px solid #dee2e6",
                        borderBottom: "0.5px solid #dee2e6",
                    }}>
                        {d}
                    </div>
                ))}

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