import { ReadAsyncAction } from "../Queries"
import { PageItemBase as PageItemBase_} from "../../../../_template/src/Base/Pages/Page"
import { LargeCard } from "../Components"

/**
 * PageItemBase — základní wrapper pro stránky pracující s jedním entity itemem.
 *
 * Komponenta:
 * - načte `id` z URL přes `useParams()`
 * - sestaví minimální `item` objekt `{ id }`
 * - poskytne jej přes `AsyncActionProvider`, který zajistí načtení entity
 *   pomocí `queryAsyncAction`
 * - vloží do stránky navbar přes `PlaceChild Component={PageNavbar}`
 * - vyrenderuje `SubPage` uvnitř `ItemLayout` (tj. v kontextu načtené entity)
 *
 * Typické použití je jako obálka routy typu `/.../:id`, kde vnořené komponenty
 * (detail, editace, akce) používají kontext z `AsyncActionProvider`.
 * Využívají ho PageReadItem, PageUpdateItem, PageCreateItem, PageDeleteItem.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 *   Async action (Redux thunk) použitá pro načtení entity z GraphQL endpointu.
 *   Dostane `item` s `id` z URL parametru.
 * @param {React.ComponentType} [props.PageNavbar=()=>null]
 *   Navbar komponenta vložená do stránky. Výchozí je prázdná komponenta.
 * @param {React.ComponentType} [props.ItemLayout=LargeCard]
 *   Layout komponenta která obalí SubPage. Výchozí je LargeCard (levý + pravý sloupec).
 * @param {React.ComponentType} [props.SubPage=null]
 *   Obsah stránky renderovaný uvnitř ItemLayout (např. SubeventsVector, UpdateBody...).
 * @returns {JSX.Element}
 */
export const PageItemBase = ({ 
    queryAsyncAction=ReadAsyncAction,
    PageNavbar=()=>null,
    ItemLayout=LargeCard,
    SubPage=null,
    ...props
}) => {
    return (
        <PageItemBase_ 
            queryAsyncAction={queryAsyncAction} 
            PageNavbar={PageNavbar}
            ItemLayout={ItemLayout}
            SubPage={SubPage}
            {...props} 
        />  
    )
}

/**
 * PageBase — základní wrapper pro stránky BEZ entity (seznam, kalendář).
 *
 * Na rozdíl od PageItemBase nepotřebuje `:id` v URL ani AsyncActionProvider.
 * Data si načítají children komponenty samy (např. přes useInfiniteScroll).
 * Vloží navbar a pak vykreslí children.
 *
 * Používá ho PageVector (seznam událostí).
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - obsah stránky
 * @param {React.ComponentType} [props.PageNavbar=()=>null]
 *   Navbar komponenta. Výchozí je prázdná komponenta.
 * @returns {JSX.Element}
 */
export const PageBase = ({ children, PageNavbar=()=>null }) => {
    return (
        <>
            <PageNavbar />
            {children}
        </>
    )
}