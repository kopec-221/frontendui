import { Input } from "../../../../_template/src/Base/FormControls/Input"

/**
 * formatForDateTimeLocal — převede ISO datum string z GraphQL odpovědi
 * do formátu který vyžaduje HTML input type="datetime-local".
 *
 * GraphQL vrací: "2024-09-08T15:27:14.364590"
 * datetime-local očekává: "2024-09-08T15:27"
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
 * DŮLEŽITÉ — id datumových polí:
 *   id="startDate" (camelCase D) — eventInsert očekává $startDate
 *   Update.jsx má attributeTransformer který přeloží startDate → startdate pro eventUpdate
 *
 * id="place" — mapuje na $place v UpdateAsyncAction
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