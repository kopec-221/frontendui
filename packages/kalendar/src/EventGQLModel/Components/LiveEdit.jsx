import { useCallback } from "react"
import { UpdateAsyncAction } from "../Queries"
import { LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { MediumEditableContent } from "./MediumEditableContent"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"

/**
 * EDITABLE_FIELDS — seznam polí která EventUpdateGQLModel podporuje.
 *
 * Záměrně NEobsahuje "place" — backend ho v eventUpdate nepodporuje
 * (ověřeno v GraphiQL: "Field place is not defined").
 * Obsahuje obě varianty datumů (camelCase i lowercase) pro případ
 * že draft obsahuje data z eventInsert formuláře.
 *
 * @type {string[]}
 */
const EDITABLE_FIELDS = ["id", "lastchange", "name", "nameEn", "description", "startdate", "enddate", "startDate", "endDate"]

/**
 * stripToEditableFields — vyfiltruje draft objekt na pouze pole která mutace zná.
 *
 * Bez tohoto filtru by se posílal celý item objekt (subevents, rbacobject,
 * createdby...) do eventUpdate mutace → HTTP 400 nebo neočekávané chování.
 *
 * Zároveň přeloží camelCase varianty datumů na lowercase které eventUpdate očekává:
 *   startDate → startdate
 *   endDate   → enddate
 *
 * @param {Object|null} draft - lokální kopie item s úpravami uživatele
 * @returns {Object} objekt obsahující pouze EDITABLE_FIELDS s přeloženými klíči
 */
const stripToEditableFields = (draft) => {
    if (!draft) return {}
    const result = Object.fromEntries(
        Object.entries(draft).filter(([key]) => EDITABLE_FIELDS.includes(key))
    )
    if (result.startDate) { result.startdate = result.startDate; delete result.startDate }
    if (result.endDate) { result.enddate = result.endDate; delete result.endDate }
    return result
}

/**
 * LiveEditWrapper — propojí MediumEditableContent s handlery z useEditAction.
 *
 * onChange — přichází přímo z useEditAction, aktualizuje draft lokálně při psaní.
 *            Neodešle žádný HTTP request.
 *
 * handleBlur — sestaví newItem = { ...item, [id]: value } z event.target
 *              a předá ho do onBlur z useEditAction.
 *              Pokud se hodnota nezměnila (item[id] === value), nic se neodešle.
 *              onBlur pak zavolá mapDraftToVars (stripToEditableFields)
 *              a odešle UpdateAsyncAction na server.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - aktuální draft stav (lokální kopie entity)
 * @param {Function} props.onChange - handler pro změny inputů z useEditAction
 * @param {Function} props.onBlur - handler pro uložení při opuštění inputu
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah
 * @returns {JSX.Element}
 */
const LiveEditWrapper = ({ item, onChange, onBlur, children }) => {
    const handleBlur = useCallback(async (e) => {
        const { id, value } = e?.target || {}
        if (!id || value === undefined) return
        // Pokud se hodnota nezměnila, neodešli zbytečný request
        if (item?.[id] === value) return
        const newItem = { ...item, [id]: value }
        return await onBlur({ target: { value: newItem } })
    }, [item, onBlur])

    return (
        <MediumEditableContent item={item} onChange={onChange} onBlur={handleBlur}>
            {children}
        </MediumEditableContent>
    )
}

/**
 * LiveEdit — inline editace skalárních atributů události s okamžitým ukládáním.
 *
 * Na rozdíl od ConfirmEdit (kde uživatel klikne na "Uložit"), LiveEdit ukládá
 * změny automaticky při opuštění každého pole (onBlur).
 *
 * Tok dat:
 *   1. useEditAction drží lokální draft state (kopie item)
 *   2. onChange při psaní → draft se aktualizuje lokálně, žádný HTTP request
 *   3. onBlur při opuštění pole → commitNow(draft) → mapDraftToVars(stripToEditableFields)
 *      → odfiltruje na EDITABLE_FIELDS → UpdateAsyncAction odešle na server
 *   4. Server vrátí nové lastchange → Redux store se aktualizuje
 *      → komponenta se překreslí s novými daty
 *
 * Během ukládání (saving=true) zobrazí LoadingSpinner.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt s aktuálními hodnotami
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah
 * @param {Function} [props.asyncMutationAction=UpdateAsyncAction]
 *   Async akce pro uložení změn. Lze přepsat pro testování nebo customizaci.
 * @returns {JSX.Element}
 */
export const LiveEdit = ({
    item,
    children,
    asyncMutationAction = UpdateAsyncAction
}) => {
    const {
        draft,        // lokální kopie item s aktuálními (neuloženými) změnami
        loading: saving, // true pokud probíhá HTTP request na server
        onChange,     // handler pro změny inputů — aktualizuje draft bez HTTP
        onBlur,       // handler pro opuštění inputu — spustí uložení na server
    } = useEditAction(asyncMutationAction, item, {
        mode: "live",
        mapDraftToVars: stripToEditableFields,
    })

    return (
        <LiveEditWrapper item={draft || item} onChange={onChange} onBlur={onBlur}>
            {saving && <LoadingSpinner />}
            {children}
        </LiveEditWrapper>
    )
}