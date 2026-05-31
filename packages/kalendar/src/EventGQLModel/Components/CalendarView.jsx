import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "../Components"

/**
 * ČESKÉ NÁZVY DNŮ A MĚSÍCŮ
 * Používáme česká jména pro zobrazení v hlavičce mřížky a nadpisu.
 */
const DAYS_CZ = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
const MONTHS_CZ = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
]

/**
 * TYPE_COLORS — mapování typeId (nebo indexu) na barvu bločku eventu.
 * Pokud event nemá typeId, použije se první barva jako výchozí.
 * Přidej sem další barvy pokud máš více typů událostí.
 */
const TYPE_COLORS = [
    { bg: "#B5D4F4", text: "#0C447C" },  // modrá
    { bg: "#9FE1CB", text: "#085041" },  // zelená
    { bg: "#F5C4B3", text: "#712B13" },  // červená
    { bg: "#CECBF6", text: "#3C3489" },  // fialová
    { bg: "#FDE68A", text: "#78350F" },  // žlutá
]

/**
 * getColorForEvent — vrátí barvu pro daný event na základě jeho typeId.
 * Pokud typeId chybí, vezme barvu podle pozice eventu v poli (fallback).
 *
 * @param {Object} event - EventGQLModel objekt
 * @param {number} index - pozice eventu v poli (jako fallback pro barvu)
 * @returns {{ bg: string, text: string }} objekt s barvami pozadí a textu
 */
const getColorForEvent = (event, index) => {
    if (event?.typeId) {
        // Hashujeme typeId na index do TYPE_COLORS
        // charCodeAt(0) vezme ASCII kód prvního znaku UUID
        const hash = event.typeId.charCodeAt(0) % TYPE_COLORS.length
        return TYPE_COLORS[hash]
    }
    return TYPE_COLORS[index % TYPE_COLORS.length]
}

/**
 * formatTime — převede ISO datum string na čas "HH:MM".
 * Zobrazuje se před názvem eventu v bločku kalendáře.
 *
 * @param {string|null} dateString - ISO datum string nebo null
 * @returns {string} čas ve formátu "HH:MM" nebo prázdný string
 */
const formatTime = (dateString) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
}

/**
 * getEventsForDay — filtruje pole eventů na ty které začínají v daném dni.
 * Porovnává rok, měsíc a den startu eventu s danou buňkou kalendáře.
 *
 * @param {Array} events - pole EventGQLModel objektů
 * @param {number} year - rok buňky
 * @param {number} month - měsíc buňky (0-11)
 * @param {number} day - den buňky (1-31)
 * @returns {Array} filtrované eventy pro daný den
 */
const getEventsForDay = (events, year, month, day) => {
    return events.filter(ev => {
        if (!ev?.startdate) return false
        const d = new Date(ev.startdate)
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
}

/**
 * EventPill — malý bloček reprezentující jeden event v buňce kalendáře.
 * Po kliknutí naviguje na detail stránku eventu (/kalendar/EventGQLModel/view/:id).
 *
 * Props:
 *   event - EventGQLModel objekt
 *   color - { bg, text } barvy z getColorForEvent
 */
const EventPill = ({ event, color }) => {
    const navigate = useNavigate()

    /**
     * handleClick — zastaví propagaci kliknutí (aby se nekliklo na buňku)
     * a naviguje na detail stránku eventu.
     */
    const handleClick = (e) => {
        e.stopPropagation()
        const uri = ReadItemURI.replace(":id", event.id)
        navigate(uri)
    }

    const time = formatTime(event.startdate)

    return (
        <div
            onClick={handleClick}
            title={event.name}
            style={{
                backgroundColor: color.bg,
                color: color.text,
                fontSize: "11px",
                padding: "2px 5px",
                borderRadius: "4px",
                marginBottom: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                fontWeight: 500,
            }}
        >
            {time && <span style={{ opacity: 0.8 }}>{time} </span>}
            {event.name || "—"}
        </div>
    )
}

/**
 * CalendarCell — jedna buňka v mřížce kalendáře reprezentující jeden den.
 *
 * Props:
 *   day        - číslo dne (1-31)
 *   isToday    - true pokud je tato buňka dnešní den (zobrazí modré kolečko)
 *   isOtherMonth - true pokud den patří do předchozího/následujícího měsíce (šedé pozadí)
 *   events     - pole eventů pro tento den
 *   maxVisible - maximální počet zobrazených eventů (zbytek schoveme za "+N další")
 */
const CalendarCell = ({ day, isToday, isOtherMonth, events, maxVisible = 2 }) => {
    const visibleEvents = events.slice(0, maxVisible)
    const hiddenCount = events.length - maxVisible

    return (
        <div style={{
            minHeight: "90px",
            padding: "4px",
            borderRight: "0.5px solid #dee2e6",
            borderBottom: "0.5px solid #dee2e6",
            backgroundColor: isOtherMonth ? "#f8f9fa" : "#ffffff",
            verticalAlign: "top",
        }}>
            {/* Číslo dne — dnes má modré kolečko */}
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

            {/* Eventy v buňce */}
            {visibleEvents.map((ev, idx) => (
                <EventPill
                    key={ev.id}
                    event={ev}
                    color={getColorForEvent(ev, idx)}
                />
            ))}

            {/* "+N další" pokud je eventů více než maxVisible */}
            {hiddenCount > 0 && (
                <div style={{ fontSize: "11px", color: "#6c757d", padding: "1px 4px" }}>
                    +{hiddenCount} další
                </div>
            )}
        </div>
    )
}

/**
 * CalendarView — hlavní komponenta měsíční kalendářové mřížky.
 *
 * Přijímá pole eventů a aktuální datum, vykreslí mřížku 7×N buněk
 * kde každá buňka reprezentuje jeden den v měsíci.
 *
 * Props:
 *   items       - pole EventGQLModel objektů (načtené přes ReadPageAsyncAction)
 *   currentDate - Date objekt pro aktuálně zobrazený měsíc
 *   onPrev      - callback pro přechod na předchozí měsíc
 *   onNext      - callback pro přechod na následující měsíc
 *
 * Jak funguje výpočet mřížky:
 *   1. Zjistíme první den měsíce a jeho den v týdnu (0=Ne...6=So, převedeme na Po=0)
 *   2. Zjistíme počet dní v měsíci
 *   3. Vypočteme celkový počet buněk (zaokrouhlíme nahoru na násobek 7)
 *   4. Pro každou buňku zjistíme zda patří do aktuálního, předchozího nebo následujícího měsíce
 *   5. Filtrujeme eventy pro každou buňku přes getEventsForDay
 */
export const CalendarView = ({ items = [], currentDate, onPrev, onNext }) => {
    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    /**
     * cells — memoizované pole buněk pro aktuální měsíc.
     * Přepočítá se pouze při změně roku/měsíce nebo pole eventů.
     */
    const cells = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        // getDay() vrací 0=Ne, 1=Po...6=So — převedeme na Po=0...Ne=6
        let startDow = firstDay.getDay()
        startDow = startDow === 0 ? 6 : startDow - 1

        const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7
        const result = []

        for (let i = 0; i < totalCells; i++) {
            let day, cellYear = year, cellMonth = month, isOtherMonth = false

            if (i < startDow) {
                // Dny z předchozího měsíce
                day = daysInPrevMonth - startDow + i + 1
                cellMonth = month - 1
                if (cellMonth < 0) { cellMonth = 11; cellYear-- }
                isOtherMonth = true
            } else if (i >= startDow + daysInMonth) {
                // Dny z následujícího měsíce
                day = i - startDow - daysInMonth + 1
                cellMonth = month + 1
                if (cellMonth > 11) { cellMonth = 0; cellYear++ }
                isOtherMonth = true
            } else {
                // Dny aktuálního měsíce
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

            {/* HLAVIČKA — název měsíce + navigační šipky */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                padding: "0 4px",
            }}>
                <span style={{ fontSize: "18px", fontWeight: 500 }}>
                    {MONTHS_CZ[month]} {year}
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                    <button
                        onClick={onPrev}
                        className="btn btn-outline-secondary btn-sm"
                        title="Předchozí měsíc"
                    >
                        ‹
                    </button>
                    <button
                        onClick={onNext}
                        className="btn btn-outline-secondary btn-sm"
                        title="Následující měsíc"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* MŘÍŽKA — 7 sloupců (Po–Ne) */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                borderLeft: "0.5px solid #dee2e6",
                borderTop: "0.5px solid #dee2e6",
            }}>
                {/* Hlavičky dnů */}
                {DAYS_CZ.map(d => (
                    <div
                        key={d}
                        style={{
                            backgroundColor: "#f8f9fa",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: 500,
                            borderRight: "0.5px solid #dee2e6",
                            borderBottom: "0.5px solid #dee2e6",
                        }}
                    >
                        {d}
                    </div>
                ))}

                {/* Buňky dnů */}
                {cells.map((cell, i) => (
                    <CalendarCell
                        key={i}
                        day={cell.day}
                        isToday={cell.isToday}
                        isOtherMonth={cell.isOtherMonth}
                        events={cell.dayEvents}
                    />
                ))}
            </div>
        </div>
    )
}