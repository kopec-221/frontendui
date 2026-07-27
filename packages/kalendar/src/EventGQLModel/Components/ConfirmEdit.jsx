import { UpdateAsyncAction } from "../Queries";
import { MediumEditableContent } from "./MediumEditableContent";
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";
import { useCallback } from "react";
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

/**
 * ConfirmEdit — editační formulář s explicitním potvrzením změn.
 *
 * Na rozdíl od LiveEdit (který ukládá při každém onBlur), ConfirmEdit
 * drží změny lokálně jako "draft" dokud uživatel neklikne na "Uložit změny".
 * Tlačítko "Zrušit změny" zahodí všechny neuložené změny.
 *
 * Jak funguje:
 *   1. Uživatel edituje pole — onChange ukládá změny do lokálního draft stavu
 *   2. dirty=true jakmile existují neuložené změny (draft ≠ item)
 *   3. "Uložit změny" → handleConfirm → onConfirm → UpdateAsyncAction → contextOnChange
 *   4. "Zrušit změny" → onCancel → draft se resetuje na původní item
 *
 * Tlačítka jsou disabled pokud není dirty (žádné změny) nebo loading (ukládá se).
 *
 * useGQLEntityContext() poskytuje přístup ke kontextu AsyncActionProvider —
 * po uložení notifikujeme kontext aby aktualizoval svůj stav entity.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt s aktuálními hodnotami
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah formuláře
 * @returns {JSX.Element}
 */
export const ConfirmEdit = ({ item, children }) => {
    const { run, error, loading, entity, data, onChange: contextOnChange, onBlur: contextOnBlur } = useGQLEntityContext()
    
    /**
     * localOnMutationEvent — wrapper který před odesláním mutace
     * aktualizuje kontext s novými daty z formuláře.
     *
     * @param {Function} mutationHandler - handler pro odeslání mutace
     * @param {Function} notifyHandler - handler pro notifikaci kontextu
     * @returns {Function} async event handler
     */
    const localOnMutationEvent = useCallback((mutationHandler, notifyHandler) => async (e) => {
        const newItem = { ...item, [e.target.id]: e.target.value }
        const newEvent = { target: { value: newItem } }
        
        await notifyHandler(newEvent)
        return await mutationHandler(e)
    })

    const {
        draft,    // lokální kopie item s neuloženými změnami
        dirty,    // true pokud existují neuložené změny
        onChange, // handler pro změny inputů — aktualizuje draft
        onBlur,   // handler při opuštění inputu
        onCancel, // zahodí draft a resetuje na původní item
        onConfirm, // odešle UpdateAsyncAction s aktuálním draftem
    } = useEditAction(UpdateAsyncAction, item, {mode: "confirm"})

    /**
     * handleConfirm — odešle změny a notifikuje GQLEntityContext.
     *
     * Po úspěšném uložení předá výsledek do contextOnChange aby
     * AsyncActionProvider aktualizoval svůj stav entity s novými daty.
     *
     * @returns {Promise<Object|undefined>} výsledek UpdateAsyncAction nebo undefined při chybě
     */
    const handleConfirm = useCallback(async () => {
        const result = await onConfirm();
        console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
        if (result) {
            const event = { target: { value: result } };
            // Důležité: použij params z kontextu (provider si drží "poslední vars")
            await contextOnChange(event);
        }
        return result;
    }, [onConfirm, contextOnChange]);

    return (
        <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur} >
            {children}
            <hr />
            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
            <button 
                className="btn btn-warning form-control" 
                onClick={onCancel}
                disabled={!dirty || loading}
            >
                Zrušit změny
            </button>
            <button 
                className="btn btn-primary form-control" 
                onClick={handleConfirm}
                disabled={!dirty || loading}
            >
                Uložit změny
            </button>
        </MediumEditableContent>
    )
}