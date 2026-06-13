import { PageItemBase } from "./PageBase"
import { SubeventsVector } from "../Vectors/SubeventsVector"

/**
 * EventSubPage — obsah MiddleColumn na detail stránce události.
 *
 * Zobrazuje pouze SubeventsVector (tabulka + kalendář sub-událostí).
 * Tree a MediumCardScalars byly odstraněny — zobrazovaly technická
 * data která nejsou relevantní pro uživatele.
 */
const EventSubPage = ({ item }) => {
    return (
        <SubeventsVector item={item} />
    )
}

/**
 * PageReadItem — detail stránka jedné události.
 *
 * @param {Object} props
 * @param {React.ComponentType} [props.SubPage=EventSubPage] - komponenta pro MiddleColumn
 */
export const PageReadItem = ({
    SubPage = EventSubPage,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    )
}