import { PageItemBase } from "./PageBase"
import { Tree } from "../../../../_template/src/Base/Vectors/VectorAttribute"
import { MediumCardScalars } from "../../../../_template/src/Base/Scalars/ScalarAttribute"
import { SubeventsVector } from "../Vectors/SubeventsVector"
import { useState } from "react"

/**
 * CollapsibleSection — sekce která se dá sbalit/rozbalit kliknutím na hlavičku.
 */
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="card mb-3">
            <div
                className="card-header py-2 d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer", userSelect: "none", fontSize: "13px", fontWeight: 600, background: "#f8f9fa" }}
                onClick={() => setOpen(prev => !prev)}
            >
                <span>{title}</span>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>{open ? "▼" : "▶"}</span>
            </div>
            {open && (
                <div className="card-body p-2">
                    {children}
                </div>
            )}
        </div>
    )
}

/**
 * EventSubPage — obsah MiddleColumn na detail stránce události.
 */
const EventSubPage = ({ item }) => {
    return (
        <>
            <SubeventsVector item={item} />
            <CollapsibleSection title="Data události">
                <Tree item={item} />
            </CollapsibleSection>
            <CollapsibleSection title="Skalární atributy">
                <MediumCardScalars item={item} />
            </CollapsibleSection>
        </>
    )
}

/**
 * PageReadItem — detail stránka jedné události.
 */
export const PageReadItem = ({
    SubPage = EventSubPage,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    )
}