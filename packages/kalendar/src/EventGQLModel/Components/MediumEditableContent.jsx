import { Input } from "../../../../_template/src/Base/FormControls/Input"

/**
 * formatForDateTimeLocal — převede ISO datum string z GraphQL odpovědi
 * do formátu který vyžaduje HTML input type="datetime-local".
 *
 * GraphQL vrací:       "2024-09-08T15:27:14.364590"
 * datetime-local chce: "2024-09-08T15:27"
 *
 * Zohledňuje časové pásmo přes getTimezoneOffset() aby se zobrazil
 * správný lokální čas bez UTC posuvu.
 *
 * @param {string|null} dateString - ISO datum string z GraphQL nebo null
 * @returns {string} datum ve formátu "YYYY-MM-DDTHH:MM" nebo prázdný string
 */
const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
    return localISOTime;
};

/**
 * MediumEditableContent — formulář pro vytvoření nebo editaci události.
 *
 * Zobrazuje inputy pro všechna editovatelná pole EventGQLModel:
 *   - Název           (id="name")
 *   - Anglický název  (id="nameEn")
 *   - Popis           (id="description")
 *   - Začátek         (id="startDate", type="datetime-local")
 *   - Konec           (id="endDate", type="datetime-local")
 *
 * Pole "Místo" (place) záměrně chybí — backend EventUpdateGQLModel
 * ho nepodporuje (ověřeno v GraphiQL: "Field place is not defined").
 *
 * DŮLEŽITÉ — id datumových polí používají camelCase (startDate, endDate):
 *   - eventInsert očekává proměnné $startDate (camelCase D)
 *   - attributeTransformer v Update.jsx přeloží startDate → startdate pro eventUpdate
 *
 * Komponenta je řízená (controlled) — hodnoty přijímá přes item prop
 * a změny propaguje přes onChange/onBlur callbacky.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt s aktuálními hodnotami polí
 * @param {string} [props.item.name] - název události
 * @param {string} [props.item.nameEn] - anglický název
 * @param {string} [props.item.description] - popis
 * @param {string} [props.item.startdate] - datum začátku (lowercase, z GraphQL)
 * @param {string} [props.item.enddate] - datum konce (lowercase, z GraphQL)
 * @param {Function} [props.onChange=(e)=>null] - callback při změně hodnoty inputu
 * @param {Function} [props.onBlur=(e)=>null] - callback při opuštění inputu
 *   (v LiveEdit spouští uložení na server, v ConfirmEdit jen aktualizuje draft)
 * @param {React.ReactNode} [props.children] - volitelný obsah renderovaný na konci
 *   (typicky tlačítka Uložit/Zrušit v ConfirmEdit)
 * @returns {JSX.Element}
 */
export const MediumEditableContent = ({ item, onChange = (e) => null, onBlur = (e) => null, children }) => {
    return (
        <>
            <Input
                id={"name"}
                label={"Název"}
                className="form-control mb-3"
                value={item?.name || ""}
                onChange={onChange}
                onBlur={onBlur}
            />
            <Input
                id={"nameEn"}
                label={"Anglický název"}
                className="form-control mb-3"
                value={item?.nameEn || ""}
                onChange={onChange}
                onBlur={onBlur}
            />
            <Input
                id={"description"}
                label={"Popis"}
                className="form-control mb-3"
                value={item?.description || ""}
                onChange={onChange}
                onBlur={onBlur}
            />
            <Input
                id={"startDate"}
                type={"datetime-local"}
                label={"Začátek"}
                className="form-control mb-3"
                value={formatForDateTimeLocal(item?.startdate || item?.startDate)}
                onChange={onChange}
                onBlur={onBlur}
            />
            <Input
                id={"endDate"}
                type={"datetime-local"}
                label={"Konec"}
                className="form-control mb-3"
                value={formatForDateTimeLocal(item?.enddate || item?.endDate)}
                onChange={onChange}
                onBlur={onBlur}
            />
            {children}
        </>
    )
}