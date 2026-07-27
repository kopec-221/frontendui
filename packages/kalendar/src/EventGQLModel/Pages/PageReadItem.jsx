import { PageItemBase } from "./PageBase"
import { SubeventsVector } from "../Vectors/SubeventsVector"

/**
 * EventSubPage — obsah MiddleColumn na readonly detail stránce události.
 *
 * Zobrazuje SubeventsVector který obsahuje:
 *   - tabulku sub-událostí s CRUD operacemi (Editovat, Odstranit)
 *   - kalendářový pohled zobrazující pouze sub-události této události
 *
 * Tree a MediumCardScalars byly záměrně odstraněny — zobrazovaly technická
 * data (id, lastchange, rbacobjectId...) která nejsou relevantní pro uživatele.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt načtený z Redux store
 * @param {Array} [props.item.subevents] - seznam pod-událostí
 * @returns {JSX.Element}
 */
const EventSubPage = ({ item }) => {
    return (
        <SubeventsVector item={item} />
    )
}

/**
 * PageReadItem — readonly detail stránka jedné události.
 *
 * URL: /kalendar/EventGQLModel/view/:id
 *
 * Layout stránky (zajišťuje LargeCard přes PageItemBase):
 *   LeftColumn  — MediumContent (základní atributy) + InteractiveMutations (NÁSTROJE)
 *   MiddleColumn — SubeventsVector (tabulka + kalendář sub-událostí)
 *
 * Stránka je pouze pro čtení — editace probíhá přes tlačítko Upravit
 * v sekci NÁSTROJE které naviguje na /edit/:id.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.SubPage=EventSubPage]
 *   Komponenta renderovaná v MiddleColumn. Výchozí je EventSubPage se SubeventsVector.
 * @returns {JSX.Element}
 */
export const PageReadItem = ({
    SubPage = EventSubPage,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    )
}