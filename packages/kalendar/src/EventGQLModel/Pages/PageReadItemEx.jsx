import { GeneratedContentBase } from "../../../../_template/src/Base/Pages/Page"
import { ReadItemURI } from "../Components"
import { ReadAsyncAction } from "../Queries"
import { PageReadItem } from "./PageReadItem"

/**
 * RolesOnURI — URL vzor pro stránku zobrazení rolí na entitě.
 *
 * Odvozena z ReadItemURI nahrazením segmentu "view" za "roleson".
 * Výsledek: /kalendar/EventGQLModel/roleson/:id
 *
 * @type {string}
 */
export const RolesOnURI = ReadItemURI.replace("view", "roleson")

/**
 * PageReadItemRolesOn — alternativní detail stránka s automaticky generovaným obsahem.
 *
 * URL: /kalendar/EventGQLModel/roleson/:id
 *
 * Na rozdíl od PageReadItem která zobrazuje SubeventsVector, tato stránka
 * zobrazuje GeneratedContentBase — automaticky generovaný obsah entity
 * (Tree + MediumCardScalars + MediumCardVectors se všemi atributy).
 *
 * Využívá PageItemBase který zajistí:
 *   - získání id z URL přes useParams()
 *   - načtení entity přes AsyncActionProvider pomocí queryAsyncAction
 *   - vložení navigace přes PageNavbar
 *
 * Primárně slouží pro debugování a zobrazení všech technických atributů entity
 * (id, lastchange, rbacobjectId, createdby...) bez filtrace.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 *   Async action (Redux thunk) pro načtení entity z GraphQL dle id z URL.
 * @param {React.ReactNode} [props.children] - volitelný dodatečný obsah
 * @returns {JSX.Element}
 */
export const PageReadItemRolesOn = ({ 
    queryAsyncAction=ReadAsyncAction, 
    children, 
    ...props 
}) => {
    return (
        <PageReadItem 
            queryAsyncAction={queryAsyncAction}
            SubPage={GeneratedContentBase} 
            {...props}
        />
    )
}