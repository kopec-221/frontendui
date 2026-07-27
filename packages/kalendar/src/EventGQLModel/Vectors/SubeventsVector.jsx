import { useState } from "react"
import { useSelector } from "react-redux"
import { selectItemById } from "../../../../dynamic/src/Store"
import { CreateButton } from "../Mutations/Create"
import { UpdateButton } from "../Mutations/Update"
import { DeleteButton } from "../Mutations/Delete"
import { CalendarView } from "../Components/CalendarView"

/**
 * formatDate — převede ISO datum na čitelný formát pro českou lokalizaci.
 *
 * @param {string|null} d - ISO datum string nebo null
 * @returns {string} formátované datum "DD. MM. YYYY HH:MM" nebo "—" pokud datum chybí
 */
const formatDate = (d) => d ? new Date(d).toLocaleString("cs-CZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
}) : "—"

/**
 * SubeventRow — jeden řádek v tabulce sub-událostí.
 *
 * Načítá plná data sub-eventu ze Redux store podle id přes selectItemById.
 * Renderuje null pokud entita ve store ještě není (načítá se).
 *
 * Používá UpdateButton a DeleteButton z Mutations/ složky která má
 * nastavenou roli "plánovací administrátor" — ne z _template kde
 * je výchozí role "superadmin".
 *
 * @component
 * @param {Object} props
 * @param {string} props.id - UUID sub-události k zobrazení
 * @returns {JSX.Element|null} řádek tabulky nebo null pokud entita není ve store
 */
const SubeventRow = ({ id }) => {
    const item = useSelector(s => selectItemById(s, id))
    if (!item) return null

    return (
        <tr>
            <td><a href={`/kalendar/EventGQLModel/view/${item.id}`}>{item.name || item.id}</a></td>
            <td>{formatDate(item.startdate)}</td>
            <td>{formatDate(item.enddate)}</td>
            <td>{item.place || "—"}</td>
            <td>
                <div className="d-flex gap-1">
                    <UpdateButton item={item} />
                    <DeleteButton item={item} />
                </div>
            </td>
        </tr>
    )
}

/**
 * SubeventsCalendar — kalendářový pohled zobrazující pouze sub-události dané události.
 *
 * Načte plná data všech sub-událostí ze Redux store podle jejich id.
 * filter(Boolean) odstraní undefined hodnoty pro případ že entita
 * ještě není ve store načtena.
 *
 * Inicializuje currentDate na měsíc první sub-události která má datum.
 * Pokud žádná nemá datum, použije aktuální měsíc.
 *
 * @component
 * @param {Object} props
 * @param {string[]} props.subeventIds - pole UUID sub-událostí k zobrazení
 * @returns {JSX.Element}
 */
const SubeventsCalendar = ({ subeventIds }) => {
    const allSubevents = useSelector(s =>
        subeventIds.map(id => selectItemById(s, id)).filter(Boolean)
    )

    /**
     * initialDate — počáteční měsíc kalendáře.
     * Nastaven na měsíc první sub-události s datem, jinak na aktuální měsíc.
     */
    const firstWithDate = allSubevents.find(e => e?.startdate)
    const initialDate = firstWithDate ? new Date(firstWithDate.startdate) : new Date()

    const [currentDate, setCurrentDate] = useState(
        new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    )

    return (
        <CalendarView
            items={allSubevents}
            currentDate={currentDate}
            onPrev={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            onNext={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
        />
    )
}

/**
 * SubeventsVector — zobrazení sub-událostí nadřazené události jako tabulka + kalendář.
 *
 * Vždy zobrazuje obojí najednou (bez přepínače):
 *   1. Tabulka sub-událostí — seznam s CRUD operacemi (Přidat, Editovat, Odstranit)
 *   2. Kalendář sub-událostí — CalendarView zobrazující pouze sub-události
 *      této konkrétní události (ne všechny eventy v systému)
 *
 * Renderuje se v MiddleColumn detail stránky (PageReadItem → EventSubPage).
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt nadřazené události
 * @param {Array} [props.item.subevents] - seznam sub-událostí (obsahuje { id, name })
 * @returns {JSX.Element}
 */
export const SubeventsVector = ({ item }) => {
    const subevents = item?.subevents || []
    const subeventIds = subevents.map(s => s?.id).filter(Boolean)

    return (
        <div>
            {/* Tabulka sub-událostí */}
            <div className="card mb-3">
                <div className="card-header py-2 d-flex justify-content-between align-items-center">
                    <span className="fw-semibold small">
                        Sub-události ({subevents.length})
                    </span>
                    <CreateButton item={item}>
                        + Přidat sub-event
                    </CreateButton>
                </div>
                <div className="card-body p-0">
                    {subevents.length === 0
                        ? <p className="text-muted text-center py-3 mb-0 small">Žádné sub-události. Klikněte na "+ Přidat sub-event".</p>
                        : (
                            <table className="table table-sm table-hover mb-0 small">
                                <thead>
                                    <tr>
                                        <th>Název</th><th>Začátek</th><th>Konec</th><th>Místo</th><th>Nástroje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subevents.map(s => <SubeventRow key={s.id} id={s.id} />)}
                                </tbody>
                            </table>
                        )
                    }
                </div>
            </div>

            {/* Kalendář sub-událostí */}
            <div className="card">
                <div className="card-header py-2">
                    <span className="fw-semibold small">Kalendář</span>
                </div>
                <div className="card-body">
                    <SubeventsCalendar subeventIds={subeventIds} />
                </div>
            </div>
        </div>
    )
}