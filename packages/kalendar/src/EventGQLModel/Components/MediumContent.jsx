import { Attribute } from "../../../../_template/src/Base/Components"
import { Link } from "./Link"

/**
 * Komponenta pro zobrazení základních (Medium) informací o události.
 */
export const MediumContent = ({ item, children }) => {
    return (
        <>
            <Attribute label="Název">
                <Link item={item} />
            </Attribute>

            <Attribute label="Začátek">
                {item?.startdate ? new Date(item.startdate).toLocaleString() : 'Není určeno'}
            </Attribute>
            
            <Attribute label="Konec">
                 {item?.enddate ? new Date(item.enddate).toLocaleString() : 'Není určeno'}
            </Attribute>

            <Attribute label="Místo">
                {item?.place || 'Není určeno'}
            </Attribute>

            <Attribute label="Popis">
                {item?.description || ''}
            </Attribute>

            {children}
        </>
    )
}