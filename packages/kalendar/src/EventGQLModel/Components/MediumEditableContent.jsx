import { Input } from "../../../../_template/src/Base/FormControls/Input"

/**
 * A component that displays medium-level content for an event entity.
 *
 * This component renders editable inputs for the event object
 * and any additional child content. It is designed to handle and display information about an event entity object.
 *
 * @component
 * @param {Object} props - The properties for the MediumEditableContent component.
 * @param {Object} props.item - The object representing the event entity.
 * @param {string|number} props.item.id - The unique identifier for the event entity.
 * @param {string} props.item.name - The name or label of the event entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `item` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const eventEntity = { id: 123, name: "Sample Entity" };
 * * <MediumEditableContent item={eventEntity}>
 * <p>Additional information about the entity.</p>
 * </MediumEditableContent>
 */
export const MediumEditableContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Jméno"} className="form-control mb-3" value={item?.name || ""} onChange={onChange} onBlur={onBlur} />
            <Input id={"nameEn"} label={"Anglický název"} className="form-control mb-3" value={item?.nameEn || ""} onChange={onChange} onBlur={onBlur} />
            <Input id={"location"} label={"Místo"} className="form-control mb-3" value={item?.location || ""} onChange={onChange} onBlur={onBlur} />
            <Input id={"description"} label={"Popis"} className="form-control mb-3" value={item?.description || ""} onChange={onChange} onBlur={onBlur} />
            
            {/* type="datetime-local" zajistí, že se v prohlížeči zobrazí nativní kalendář pro výběr data a času */}
            <Input id={"startdate"} type={"datetime-local"} label={"Začátek"} className="form-control mb-3" value={item?.startdate || ""} onChange={onChange} onBlur={onBlur} />
            <Input id={"enddate"} type={"datetime-local"} label={"Konec"} className="form-control mb-3" value={item?.enddate || ""} onChange={onChange} onBlur={onBlur} />
            
            {children}
        </>
    )
}