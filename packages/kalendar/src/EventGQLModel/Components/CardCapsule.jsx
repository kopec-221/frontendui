import { PersonFill } from "react-bootstrap-icons"
import { Link } from "./Link"
import { CardCapsule as CardCapsule_ } from "../../../../_template/src/Base/Components"

/**
 * CardCapsule — Bootstrap karta s dynamickou hlavičkou pro EventGQLModel.
 *
 * Rozšiřuje základní CardCapsule z _template o výchozí hlavičku
 * která kombinuje ikonu PersonFill a odkaz na detail události (Link).
 *
 * Pokud je předán prop title, použije se místo výchozí hlavičky —
 * to umožňuje zobrazit libovolný obsah v hlavičce karty
 * (např. prostý text "Detail", "Nástroje", "Kalendář").
 *
 * Používá se jako obal pro sekce na detail stránce:
 *   <CardCapsule item={item} title="Nástroje"> ... </CardCapsule>
 *   <CardCapsule item={item}> ... </CardCapsule>  // výchozí hlavička s odkazem
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.item] - EventGQLModel objekt (použit pro výchozí hlavičku s odkazem)
 * @param {string} [props.item.id] - UUID události
 * @param {string} [props.item.name] - název události zobrazený v odkazu
 * @param {React.ReactNode} [props.children] - obsah těla karty
 * @param {React.ReactNode|string|null} [props.title=null]
 *   Vlastní hlavička karty. Pokud je null, použije se výchozí (ikona + Link na událost).
 * @returns {JSX.Element}
 *
 * @example
 * // Výchozí hlavička — ikona + odkaz na událost
 * <CardCapsule item={event}>
 *   <MediumContent item={event} />
 * </CardCapsule>
 *
 * @example
 * // Vlastní hlavička
 * <CardCapsule item={event} title="Nástroje">
 *   <button>Upravit</button>
 * </CardCapsule>
 */
export const CardCapsule = ({ item, children, title=null}) => {
    
    if (!title) {
        title = <><PersonFill /> <Link item={item} /></>
    }
    return (
        <CardCapsule_ title={title}>
            {children}
        </CardCapsule_>
    )
}