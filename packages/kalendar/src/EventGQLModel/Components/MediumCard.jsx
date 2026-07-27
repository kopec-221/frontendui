import { PersonFill } from "react-bootstrap-icons"
import { CardCapsule } from "./CardCapsule"
import { MediumContent } from "./MediumContent"
import { Link } from "./Link"

/**
 * MediumCard — karta pro kompaktní zobrazení přehledu události.
 *
 * Kombinuje CardCapsule a MediumContent do kartového layoutu s hlavičkou.
 * Hlavička obsahuje ikonu PersonFill a odkaz na detail stránku události.
 * Tělo karty zobrazuje children (volitelný obsah) a základní atributy
 * události přes MediumContent (název, začátek, konec, místo, popis).
 *
 * Používá se v seznamových pohledech kde potřebujeme zobrazit
 * více událostí najednou v kartovém layoutu (ne v tabulce).
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} [props.item.id] - UUID události (použito v odkazu v hlavičce)
 * @param {string} [props.item.name] - název události (zobrazí se jako text odkazu)
 * @param {React.ReactNode} [props.children] - volitelný obsah renderovaný před MediumContent
 * @returns {JSX.Element}
 *
 * @example
 * <MediumCard item={event}>
 *   <p>Dodatečné informace o události.</p>
 * </MediumCard>
 */
export const MediumCard = ({ item, children }) => {
    return (
        <CardCapsule title={<><PersonFill /> <Link item={item} /></>}>
            {children}
            <MediumContent item={item}>
            </MediumContent>
        </CardCapsule>
    )
}