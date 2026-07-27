import { Attribute } from "../../../../_template/src/Base/Components"
import { Link } from "./Link"

/**
 * MediumContent — readonly zobrazení základních atributů události.
 *
 * Zobrazuje skalární atributy události ve formátu štítek + hodnota:
 *   - Název (jako klikací odkaz na detail stránku)
 *   - Začátek (datum a čas)
 *   - Konec (datum a čas)
 *   - Místo konání
 *   - Popis
 *
 * Komponenta je záměrně pouze pro čtení — editace probíhá přes
 * MediumEditableContent na stránce /edit/:id (tlačítko Upravit v NÁSTROJE).
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} props.item.id - UUID události
 * @param {string} [props.item.name] - název události
 * @param {string} [props.item.startdate] - datum začátku (ISO string)
 * @param {string} [props.item.enddate] - datum konce (ISO string)
 * @param {string} [props.item.place] - místo konání
 * @param {string} [props.item.description] - popis události
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah
 * @returns {JSX.Element}
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