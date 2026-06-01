import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useGQLClient, selectAllItems } from "../../../../dynamic/src/Store"
import { CreatePlanAsyncAction } from "../Queries/CreatePlanAsyncAction"
import { ReadItemURI } from "../Components"

const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
}

/**
 * CreateRootEventButton — tlačítko pro vytvoření kořenového eventu.
 *
 * Jak získáme rbacobjectId:
 *   Strategie 1: UserGQLModel s isThisMe=true ze store (pokud byl načten)
 *   Strategie 2: rbacobjectId z existujícího EventGQLModel ve store
 *                (každý event má rbacobjectId — server to akceptuje)
 *   Strategie 3: createdbyId z existujícího eventu jako fallback
 *
 * Proč ne /me query:
 *   Přidalo by to komplexitu — museli bychom přidat nový AsyncAction.
 *   Existující eventy ve store mají rbacobjectId který funguje.
 */
export const CreateRootEventButton = () => {
    const dispatch = useDispatch()
    const gqlClient = useGQLClient()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const allItems = useSelector(selectAllItems)

    /**
     * rbacobjectId — hledáme v tomto pořadí:
     * 1. UserGQLModel s isThisMe (pokud je ve store)
     * 2. rbacobjectId z libovolného EventGQLModel ve store
     * 3. createdbyId z libovolného EventGQLModel (je to UUID uživatele)
     */
    const rbacobjectId = (
        allItems?.find(i => i.__typename === "UserGQLModel" && i.isThisMe)?.rbacobjectId
        || allItems?.find(i => i.__typename === "EventGQLModel" && i.rbacobjectId)?.rbacobjectId
        || allItems?.find(i => i.__typename === "EventGQLModel" && i.createdbyId)?.createdbyId
    )

    console.log("rbacobjectId found:", rbacobjectId)

    const handleCreate = async () => {
        if (!name.trim() || !rbacobjectId) return
        setSaving(true)
        setError(null)

        const newId = generateUUID()
        const payload = { rbacobjectId, id: newId, name: name.trim() }
        console.log("CreatePlan payload:", payload)

        try {
            await dispatch(CreatePlanAsyncAction(payload, gqlClient))
            navigate(ReadItemURI.replace(":id", newId))
        } catch (err) {
            console.log("CreatePlan error:", err)
            setError(err?.message || JSON.stringify(err))
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => { setOpen(false); setName(""); setError(null) }

    if (!open) {
        return (
            <button className="btn btn-success" onClick={() => setOpen(true)}>
                + Nová událost
            </button>
        )
    }

    return (
        <div className="card p-3" style={{ maxWidth: "400px" }}>
            <h6 className="mb-3">Nová událost</h6>

            {!rbacobjectId && (
                <div className="alert alert-warning py-2 small mb-3">
                    Nejprve otevřete detail libovolné existující události, 
                    pak se vraťte sem a zkuste znovu.
                </div>
            )}

            <div className="mb-3">
                <label className="form-label small">Název události</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Název..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCreate()}
                    autoFocus
                    disabled={!rbacobjectId}
                />
            </div>

            {error && (
                <div className="alert alert-danger py-2 small mb-3">{error}</div>
            )}

            <div className="d-flex gap-2">
                <button
                    className="btn btn-primary"
                    onClick={handleCreate}
                    disabled={!name.trim() || saving || !rbacobjectId}
                >
                    {saving ? "Vytvářím..." : "Vytvořit"}
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Zrušit
                </button>
            </div>
        </div>
    )
}