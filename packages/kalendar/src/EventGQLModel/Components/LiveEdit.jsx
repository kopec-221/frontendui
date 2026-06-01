import { useCallback } from "react"
import { UpdateAsyncAction } from "../Queries"
import { LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { MediumEditableContent } from "./MediumEditableContent"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"

/**
 * EDITOVATELNÁ POLE — pouze ta která EventUpdateGQLModel podporuje.
 * place záměrně chybí — backend ho v eventUpdate nepodporuje.
 * startDate/endDate jsou zde pro případ že draft obsahuje camelCase variantu.
 */
const EDITABLE_FIELDS = ["id", "lastchange", "name", "nameEn", "description", "startdate", "enddate", "startDate", "endDate"]

/**
 * stripToEditableFields — vyfiltruje draft na jen pole která mutace zná.
 * Přeloží startDate → startdate a endDate → enddate (camelCase → lowercase).
 * Bez toho by se posílal celý item (subevents, rbacobject...) → HTTP 400.
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
 * LiveEditWrapper — propojí MediumEditableContent s useEditAction handlery.
 *
 * onChange jde přímo z useEditAction — aktualizuje draft lokálně při psaní.
 * handleBlur sestaví newItem = { ...item, [id]: value } a předá do onBlur.
 * mapDraftToVars pak odfiltruje na jen EDITABLE_FIELDS před odesláním.
 */
const LiveEditWrapper = ({ item, onChange, onBlur, children }) => {
    const handleBlur = useCallback(async (e) => {
        const { id, value } = e?.target || {}
        if (!id || value === undefined) return
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
 * LiveEdit — inline editace skalárních atributů události.
 *
 * Jak funguje:
 *   1. useEditAction drží lokální draft state (kopie item)
 *   2. onChange při psaní → draft se aktualizuje lokálně, žádný HTTP request
 *   3. onBlur při opuštění pole → commitNow(draft) → mapDraftToVars
 *      → odfiltruje na EDITABLE_FIELDS → UpdateAsyncAction odešle na server
 *   4. Server vrátí nové lastchange → Redux store se aktualizuje
 */
export const LiveEdit = ({
    item,
    children,
    asyncMutationAction = UpdateAsyncAction
}) => {
    const {
        draft,
        loading: saving,
        onChange,
        onBlur,
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