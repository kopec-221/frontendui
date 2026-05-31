import { useSelector } from "react-redux"
import { selectItemById } from "../../../../dynamic/src/Store"
import { CardCapsule } from "../Components/CardCapsule"
import { Link } from "../Components/Link"
import { CreateButton } from "../Mutations/Create"
import { DeleteButton } from "../Mutations/Delete"
import { UpdateButton } from "../Mutations/Update"

/**
 * SubeventRow — jeden řádek v tabulce sub-eventů.
 *
 * Přijímá jen { id } z pole item.subevents a načte plná data
 * ze Redux store pomocí selectItemById. To funguje protože
 * LargeFragment při načtení rodiče uloží všechny sub-entity do store.
 *
 * Co zobrazuje:
 *   - Odkaz na detail sub-eventu (Link komponenta)
 *   - Datum začátku a konce
 *   - Tlačítka Upravit a Odstranit
 *
 * Props:
 *   subevent - objekt s alespoň { id } (zbytek se načte ze store)
 *   masterevent - rodičovský event (potřebný pro DeleteButton kvůli vectorItemsURI)
 */
const SubeventRow = ({ subevent, masterevent }) => {
    /**
     * fullSubevent — plná data sub-eventu ze Redux store.
     * selectItemById vyhledá entitu podle id v ItemSlice.
     * Pokud entita není ve store (ještě nebyla načtena), vrátí základní { id }.
     */
    const fullSubevent = useSelector(
        (rootState) => selectItemById(rootState, subevent?.id)
    ) || subevent

    /**
     * formatDate — převede ISO datum na čitelný formát pro českou lokalizaci.
     * Zobrazí datum a čas ve formátu "DD. MM. YYYY HH:MM".
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

    return (
        <tr>
            {/* Název sub-eventu jako klikací odkaz na jeho detail stránku */}
            <td>
                <Link item={fullSubevent}>
                    {fullSubevent?.name || fullSubevent?.id}
                </Link>
            </td>

            {/* Datum začátku */}
            <td style={{ fontSize: "13px", color: "#6c757d" }}>
                {formatDate(fullSubevent?.startdate)}
            </td>

            {/* Datum konce */}
            <td style={{ fontSize: "13px", color: "#6c757d" }}>
                {formatDate(fullSubevent?.enddate)}
            </td>

            {/* Místo konání */}
            <td style={{ fontSize: "13px" }}>
                {fullSubevent?.place || "—"}
            </td>

            {/* Nástroje — tlačítka pro editaci a smazání */}
            <td>
                <div className="d-flex gap-1">
                    {/*
                     * UpdateButton — otevře dialog pro editaci sub-eventu.
                     * item je fullSubevent (ten který chceme editovat).
                     */}
                    <UpdateButton
                        item={fullSubevent}
                        className="btn btn-sm btn-outline-primary"
                    >
                        Upravit
                    </UpdateButton>

                    {/*
                     * DeleteButton — otevře potvrzovací dialog pro smazání.
                     * item je fullSubevent, po smazání přesměruje na detail rodiče.
                     */}
                    <DeleteButton
                        item={fullSubevent}
                        className="btn btn-sm btn-outline-danger"
                    >
                        Smazat
                    </DeleteButton>
                </div>
            </td>
        </tr>
    )
}

/**
 * SubeventsVector — komponenta pro zobrazení a správu sub-eventů.
 *
 * Zobrazí tabulku všech sub-eventů (subevents) daného eventu
 * a tlačítko "Přidat sub-event" pro vytvoření nového.
 *
 * Kde se používá:
 *   Vkládá se do LargeCard.jsx jako children (do MiddleColumn).
 *   Tím se zobrazí na detail stránce každého eventu.
 *
 * Jak funguje tok dat:
 *   1. item.subevents je pole { id } objektů (jen ID, ne plná data)
 *      — tak je vrací LargeFragment ze serveru
 *   2. Každý SubeventRow si sám načte plná data ze Redux store
 *      — tam jsou uložena při načtení rodiče (LargeFragment obsahuje
 *        subevents { id } a Redux middleware uloží každou entitu zvlášť)
 *   3. CreateButton vytvoří nový sub-event s mastereventId = item.id
 *
 * Props:
 *   item - rodičovský EventGQLModel objekt (musí mít id a subevents pole)
 */
export const SubeventsVector = ({ item }) => {
    /**
     * subevents — pole sub-eventů z rodičovské entity.
     * Fallback na prázdné pole pokud subevents není načteno.
     */
    const subevents = item?.subevents || []

    return (
        <CardCapsule item={item} title="Sub-události">
            {/* HLAVIČKA SEKCE — název a tlačítko přidat */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0" style={{ fontWeight: 600 }}>
                    Sub-události ({subevents.length})
                </h6>

                {/*
                 * CreateButton — otevře dialog pro vytvoření nového sub-eventu.
                 * item je rodičovský event — CreateButton z něj vezme id
                 * jako mastereventId pro nový sub-event.
                 * Viz Create.jsx: newItem = { id: generateUUID(), mastereventId: item?.id }
                 */}
                <CreateButton
                    item={item}
                    className="btn btn-sm btn-success"
                >
                    + Přidat sub-event
                </CreateButton>
            </div>

            {/* TABULKA SUB-EVENTŮ */}
            {subevents.length === 0 ? (
                /* Prázdný stav — zobrazíme informativní text */
                <div className="text-muted text-center py-3" style={{ fontSize: "14px" }}>
                    Žádné sub-události. Klikněte na "+ Přidat sub-event".
                </div>
            ) : (
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th style={{ fontSize: "13px" }}>Název</th>
                            <th style={{ fontSize: "13px" }}>Začátek</th>
                            <th style={{ fontSize: "13px" }}>Konec</th>
                            <th style={{ fontSize: "13px" }}>Místo</th>
                            <th style={{ fontSize: "13px" }}>Nástroje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*
                         * Pro každý sub-event vykreslíme SubeventRow.
                         * key={subevent.id} je povinné pro React reconciliation
                         * (React potřebuje unikátní klíč pro každý prvek v seznamu).
                         */}
                        {subevents.map(subevent => (
                            <SubeventRow
                                key={subevent.id}
                                subevent={subevent}
                                masterevent={item}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </CardCapsule>
    )
}