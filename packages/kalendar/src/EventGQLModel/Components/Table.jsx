import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "./index"
import { UpdateButton } from "../Mutations/Update"
import { DeleteButton } from "../Mutations/Delete"

/**
 * formatDate — převede ISO datum string na čitelný formát pro českou lokalizaci.
 *
 * @param {string|null} dateStr - ISO datum string nebo null
 * @returns {string} formátované datum "DD. MM. YYYY HH:MM" nebo "—" pokud datum chybí
 */
const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleString("cs-CZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

/**
 * EventRow — jeden řádek v tabulce událostí.
 *
 * Zobrazuje pouze relevantní pole pro uživatele:
 *   Název, Začátek, Konec, Místo, Počet sub-událostí (badge), Nástroje
 *
 * Technická pole (id, __typename, rbacobjectId, lastchange...) jsou záměrně skryta.
 *
 * Kliknutí na řádek naviguje na detail stránku události (/view/:id).
 * e.stopPropagation() na sloupci Nástroje zabrání navigaci při kliknutí
 * na tlačítka Upravit/Odstranit.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} props.item.id - UUID události (použito pro navigaci)
 * @param {string} [props.item.name] - název události
 * @param {string} [props.item.startdate] - datum začátku (ISO string)
 * @param {string} [props.item.enddate] - datum konce (ISO string)
 * @param {string} [props.item.place] - místo konání
 * @param {Array} [props.item.subevents] - seznam sub-událostí (zobrazí se počet)
 * @returns {JSX.Element}
 */
const EventRow = ({ item }) => {
    const navigate = useNavigate()

    return (
        <tr
            style={{ cursor: "pointer" }}
            onClick={() => navigate(ReadItemURI.replace(":id", item.id))}
        >
            <td className="fw-semibold">
                {item.name || <span className="text-muted fst-italic">Bez názvu</span>}
            </td>
            <td className="text-muted small">{formatDate(item.startdate)}</td>
            <td className="text-muted small">{formatDate(item.enddate)}</td>
            <td className="text-muted small">{item.place || "—"}</td>
            <td className="text-center">
                <span className="badge bg-secondary">
                    {item.subevents?.length ?? 0}
                </span>
            </td>
            {/* stopPropagation zabrání navigaci při kliknutí na tlačítka */}
            <td onClick={e => e.stopPropagation()}>
                <div className="d-flex gap-1">
                    <UpdateButton item={item} />
                    <DeleteButton item={item} />
                </div>
            </td>
        </tr>
    )
}

/**
 * Table — tabulka událostí pro seznam stránku (PageVector).
 *
 * Zobrazuje pouze důležité sloupce místo všech technických polí entity.
 * Pokud data jsou prázdná nebo undefined, zobrazí informační zprávu.
 *
 * Sloupce: Název | Začátek | Konec | Místo | Sub-události | Nástroje
 *
 * @component
 * @param {Object} props
 * @param {Object[]} props.data - pole EventGQLModel objektů k zobrazení
 * @returns {JSX.Element} tabulka s řádky nebo zpráva o prázdném seznamu
 */
export const Table = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-muted text-center py-5">
                Žádné události k zobrazení.
            </div>
        )
    }

    return (
        <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
                <tr>
                    <th>Název</th>
                    <th>Začátek</th>
                    <th>Konec</th>
                    <th>Místo</th>
                    <th className="text-center">Sub-události</th>
                    <th>Nástroje</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <EventRow key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    )
}