import { useCallback, useMemo } from "react"
import { UpdateAsyncAction } from "../Queries"
import { LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { MediumEditableContent } from "./MediumEditableContent"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"

/**
 * LiveEditWrapper — vnitřní wrapper který propojuje item s onChange/onBlur handlery.
 *
 * Proč existuje separátně:
 *   useEditAction vrátí onChange a onBlur funkce které pracují s "draft" stavem.
 *   Ale MediumEditableContent posílá eventy ve formátu { target: { id, value } }.
 *   Tento wrapper zajistí že každá změna pole (např. name="Nový název") se
 *   správně propaguje do draft stavu a při onBlur se odešle na server.
 *
 * Props:
 *   item     - aktuální entita z Redux store
 *   onChange - callback z useEditAction pro aktualizaci draft stavu
 *   onBlur   - callback z useEditAction pro odeslání mutace
 *   children - volitelný obsah (spinner, chybová hláška)
 */
const LiveEditWrapper = ({ item, onChange, onBlur, children }) => {
    /**
     * handleEvent — HOF (higher-order function) která obalí handler.
     *
     * MediumEditableContent volá onChange s { target: { id, value } }.
     * useEditAction ale potřebuje { target: { id, value } } kde value
     * je přímo nová hodnota pole.
     *
     * Tato funkce:
     *   1. Přečte { id, value } z e.target
     *   2. Pokud id nebo value chybí, nic nedělá (ochrana)
     *   3. Pokud value je stejná jako aktuální item[id], nic nedělá (ochrana)
     *   4. Vytvoří nový item objekt s upraveným polem
     *   5. Zavolá handler s { target: { value: newItem } }
     */
    const handleEvent = useCallback((handler) => async (e) => {
        const { id, value } = e?.target || {}
        if (id === undefined || value === undefined) return
        if (item?.[id] === value) return
        const newItem = { ...item, [id]: value }
        const newEvent = { target: { value: newItem } }
        return await handler(newEvent)
    }, [item])

    /**
     * bindedOnChange — onChange obalený přes handleEvent.
     * Volá se při každém stisku klávesy v inputu.
     * Aktualizuje draft stav, ale neposílá request na server.
     */
    const bindedOnChange = useMemo(
        () => handleEvent(onChange),
        [onChange, handleEvent]
    )

    /**
     * bindedOnBlur — onBlur obalený přes handleEvent.
     * Volá se při opuštění inputu (klik jinam, Tab).
     * Odešle UpdateAsyncAction se všemi změnami z draft stavu.
     */
    const bindedOnBlur = useMemo(
        () => handleEvent(onBlur),
        [onBlur, handleEvent]
    )

    return (
        <MediumEditableContent
            item={item}
            onChange={bindedOnChange}
            onBlur={bindedOnBlur}
        >
            {children}
        </MediumEditableContent>
    )
}

/**
 * LiveEdit — komponenta pro inline editaci skalárních atributů události.
 *
 * Zobrazí všechna editovatelná pole (název, anglický název, místo, popis,
 * datum začátku, datum konce) jako inputy přímo na detail stránce.
 * Změny se ukládají automaticky při opuštění pole (onBlur) — uživatel
 * nemusí klikat na žádné tlačítko "Uložit".
 *
 * Jak funguje tok dat:
 *   1. useEditAction vytvoří lokální "draft" kopii item
 *   2. mode: "live" znamená ukládání při onBlur (ne manuálním potvrzení)
 *   3. Při psaní (onChange) → draft se aktualizuje lokálně
 *   4. Při opuštění pole (onBlur) → UpdateAsyncAction se odešle na server
 *   5. Server vrátí updatovanou entitu → Redux store se aktualizuje
 *   6. Komponenta se překreslí s novými daty ze store
 *
 * Props:
 *   item              - EventGQLModel objekt (celá entita ze store)
 *   children          - volitelný obsah vložený za inputy
 *   asyncMutationAction - async action pro update (default UpdateAsyncAction)
 */
export const LiveEdit = ({
    item,
    children,
    asyncMutationAction = UpdateAsyncAction
}) => {
    /**
     * useEditAction — hook který spravuje draft stav a odesílání mutací.
     *
     * Vrací:
     *   onChange  - aktualizuje draft stav při psaní
     *   onBlur    - odešle mutaci při opuštění pole
     *   saving    - true pokud právě probíhá HTTP request
     */
    const {
        loading: saving,
        onChange,
        onBlur,
    } = useEditAction(asyncMutationAction, item, {
        mode: "live",
    })

    return (
        <LiveEditWrapper item={item} onChange={onChange} onBlur={onBlur}>
            {/* Spinner zobrazí se během ukládání na server */}
            {saving && <LoadingSpinner />}
            {children}
        </LiveEditWrapper>
    )
}