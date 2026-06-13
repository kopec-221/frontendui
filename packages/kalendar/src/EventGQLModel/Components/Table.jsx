import { useNavigate } from "react-router-dom"
import { ReadItemURI } from "./index"
import { UpdateButton } from "../Mutations/Update"
import { DeleteButton } from "../Mutations/Delete"

/**
 * formatDate — převede ISO datum na čitelný formát pro českou lokalizaci.
 *
 * @param {string|null} dateStr - ISO datum string nebo null
 * @returns {string} formátované datum nebo "—" pokud datum chybí
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
 * Zobrazuje pouze relevantní pole:
 *   Název, Začátek, Konec, Místo, Počet sub-událostí, Nástroje
 *
 * Technická pole (id, __typename, rbacobjectId...) jsou skryta.
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
 * Table — tabulka událostí pro PageVector (seznam stránku).
 *
 * Zobrazuje pouze důležité sloupce místo všech technických polí.
 * Kliknutí na řádek naviguje na detail stránku události.
 *
 * @param {Object} props
 * @param {Array} props.data - pole EventGQLModel objektů
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