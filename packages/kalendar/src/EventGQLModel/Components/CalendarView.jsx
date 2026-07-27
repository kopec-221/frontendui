import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "../Components"

/**
 * DAYS_CZ — české zkratky dnů v týdnu seřazené od pondělí.
 * @type {string[]}
 */
const DAYS_CZ = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]

/**
 * MONTHS_CZ — české názvy měsíců indexované od 0 (leden = 0).
 * @type {string[]}
 */
const MONTHS_CZ = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
]

/**
 * EVENT_COLOR_CLASSES — Bootstrap třídy pro barvy eventů v kalendáři.
 *
 * Každý event dostane třídu podle deterministického hashe svého id,
 * takže stejný event má vždy stejnou barvu napříč různými dny a měsíci.
 *
 * @type {string[]}
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
 * getColorClassForEvent — vrátí Bootstrap CSS třídy pro barvu eventu.
 *
 * Vypočítá hash z event.id (součet char kódů) a modulo počtu tříd
 * vybere konkrétní barvu. Deterministické — stejné id = stejná barva.
 *
 * @param {Object} event - EventGQLModel objekt
 * @param {string} [event.id] - UUID události (použito pro hash)
 * @returns {string} Bootstrap třídy pro barvu (např. "bg-primary text-white")
 */
const getColorClassForEvent = (event) => {
    if (!event?.id) return EVENT_COLOR_CLASSES[0]
    const hash = event.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return EVENT_COLOR_CLASSES[hash % EVENT_COLOR_CLASSES.length]
}

/**
 * formatTime — převede ISO datum string na čas ve formátu "HH:MM".
 *
 * @param {string|null} dateString - ISO datum string nebo null
 * @returns {string} čas "HH:MM" nebo prázdný string pokud datum chybí nebo je neplatné
 */
const formatTime = (dateString) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
}

/**
 * getEventsForDay — vrátí všechny eventy které zasahují do daného dne.
 *
 * Správně zpracovává multi-day eventy — event který začal před daným dnem
 * a končí po něm se zobrazí i pro tento den.
 *
 * @param {Object[]} events - pole EventGQLModel objektů
 * @param {number} year - rok buňky
 * @param {number} month - měsíc buňky (0-indexed)
 * @param {number} day - den buňky
 * @returns {Object[]} pole eventů zasahujících do daného dne
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
 * EventPill — barevný bloček eventu zobrazený v buňce kalendáře.
 *
 * Vizuální logika pro multi-day eventy:
 *   První den  → zaoblené rohy vlevo, zobrazí čas + název + "→"
 *   Prostřední → žádné zaoblení, zobrazí "→ název →"
 *   Poslední   → zaoblené rohy vpravo, zobrazí "→ název čas"
 *   Jednodení  → plné zaoblení, zobrazí "čas–čas název"
 *
 * Inline style pouze pro border-radius (Bootstrap nemá jednostranné zaoblení)
 * a overflow/whitespace (Bootstrap nemá text-overflow: ellipsis jako utilitu).
 *
 * @component
 * @param {Object} props
 * @param {Object} props.event - EventGQLModel objekt
 * @param {string} props.colorClass - Bootstrap CSS třídy pro barvu pozadí
 * @param {boolean} props.isFirstDay - true pokud je toto první den multi-day eventu
 * @param {boolean} props.isLastDay - true pokud je toto poslední den multi-day eventu
 * @returns {JSX.Element}
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
     * label — text zobrazený uvnitř bločku eventu.
     *
     * Sestaví se pomocí ternárních operátorů podle pozice v multi-day rozsahu:
     *   isFirstDay && isLastDay = jednodení event → "HH:MM–HH:MM název"
     *   isFirstDay              = začátek         → "HH:MM název →"
     *   isLastDay               = konec           → "→ název HH:MM"
     *   jinak                   = prostřední den  → "→ název →"
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
     * borderRadius — jednostranné zaoblení rohů pro multi-day eventy.
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
 * CalendarCell — jedna buňka v kalendářové mřížce.
 *
 * Zobrazí číslo dne (dnešek jako badge) a seznam eventů pro daný den.
 * Pokud je eventů více než maxVisible, zobrazí "+N další".
 * Buňky z jiného měsíce mají světlé pozadí (bg-light).
 *
 * Inline style pouze pro minHeight (Bootstrap nemá vh-based min-height pro buňky).
 *
 * @component
 * @param {Object} props
 * @param {number} props.day - číslo dne v měsíci
 * @param {number} props.year - rok buňky
 * @param {number} props.month - měsíc buňky (0-indexed)
 * @param {boolean} props.isToday - true pokud je buňka dnešní datum
 * @param {boolean} props.isOtherMonth - true pokud buňka patří do jiného měsíce
 * @param {Object[]} props.events - pole eventů pro tento den
 * @param {number} [props.maxVisible=2] - maximální počet zobrazených eventů
 * @returns {JSX.Element}
 */
const CalendarCell = ({ day, year, month, isToday, isOtherMonth, events, maxVisible = 2 }) => {
    const visibleEvents = events.slice(0, maxVisible)
    const hiddenCount = events.length - maxVisible

    return (
        <div
            className={`p-1 border-end border-bottom ${isOtherMonth ? "bg-light" : "bg-white"}`}
            style={{ minHeight: "90px" }}
        >
            {/* Číslo dne — dnešek zobrazíme jako Bootstrap badge */}
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
 * CalendarView — měsíční kalendářová mřížka pro zobrazení událostí.
 *
 * Zobrazuje události v mřížce 7 sloupců (Po–Ne) s navigací mezi měsíci.
 * Správně zpracovává multi-day eventy, přechody měsíců a roků.
 * Kliknutí na event naviguje na jeho detail stránku (/view/:id).
 *
 * Inline style pouze pro:
 *   - CSS grid (Bootstrap nemá 7-sloupcový grid)
 *   - border-left/border-top mřížky
 *
 * Výpočet buněk je cachován přes useMemo — přepočítá se jen při změně
 * roku, měsíce nebo pole items.
 *
 * @component
 * @param {Object} props
 * @param {Object[]} [props.items=[]] - pole EventGQLModel objektů k zobrazení
 * @param {Date} props.currentDate - aktuálně zobrazený měsíc
 * @param {Function} props.onPrev - callback pro přechod na předchozí měsíc
 * @param {Function} props.onNext - callback pro přechod na další měsíc
 * @returns {JSX.Element}
 */
export const CalendarView = ({ items = [], currentDate, onPrev, onNext }) => {
    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    /**
     * cells — pole objektů popisujících každou buňku kalendáře.
     *
     * useMemo zajistí že výpočet (iterace přes všechny dny + filtrování eventů)
     * se provede jen při změně roku, měsíce nebo pole items.
     *
     * Každý objekt: { day, cellYear, cellMonth, isOtherMonth, isToday, dayEvents }
     */
    const cells = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        // getDay() vrací 0=neděle, převedeme na 0=pondělí
        let startDow = firstDay.getDay()
        startDow = startDow === 0 ? 6 : startDow - 1

        const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7
        const result = []

        for (let i = 0; i < totalCells; i++) {
            let day, cellYear = year, cellMonth = month, isOtherMonth = false

            if (i < startDow) {
                // Buňky z předchozího měsíce
                day = daysInPrevMonth - startDow + i + 1
                cellMonth = month - 1
                if (cellMonth < 0) { cellMonth = 11; cellYear-- }
                isOtherMonth = true
            } else if (i >= startDow + daysInMonth) {
                // Buňky z následujícího měsíce
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
            {/* Hlavička — název měsíce vlevo, navigační šipky vpravo */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0">{MONTHS_CZ[month]} {year}</h5>
                </div>
                <div className="btn-group btn-group-sm">
                    <button onClick={onPrev} className="btn btn-outline-secondary">‹</button>
                    <button onClick={onNext} className="btn btn-outline-secondary">›</button>
                </div>
            </div>

            {/* Mřížka — inline style pro 7-sloupcový CSS grid (Bootstrap nemá tuto utilitu) */}
            <div
                className="border-start border-top"
                style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
                {/* Hlavička dní v týdnu */}
                {DAYS_CZ.map(d => (
                    <div key={d} className="bg-light border-end border-bottom text-center text-muted small py-1 fw-medium">
                        {d}
                    </div>
                ))}

                {/* Buňky kalendáře */}
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