import { CardCapsule, VectorItemsURI, ReadItemURI } from "../Components";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";
import { UpdateLink } from "./Update";
import { DeleteButton } from "./Delete";
import { useNavigate } from "react-router-dom";

/**
 * PageLink — odkaz na seznam všech událostí.
 *
 * Naviguje na VectorItemsURI (/kalendar/EventGQLModel/list/).
 * Zachovává hash a search parametry URL pokud není řečeno jinak.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - obsah odkazu
 * @param {boolean} [props.preserveHash=true] - zachovat hash část URL
 * @param {boolean} [props.preserveSearch=true] - zachovat query parametry URL
 * @returns {JSX.Element}
 */
export const PageLink = ({ children, preserveHash = true, preserveSearch = true, ...props }) => {
    return (
        <ProxyLink
            to={VectorItemsURI}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </ProxyLink>
    );
};

/**
 * BackToViewButton — tlačítko které naviguje zpět na readonly detail stránku.
 *
 * Používá useNavigate() pro programatickou navigaci na /view/:id.
 * Užitečné na editační stránce (/edit/:id) pro návrat bez ztráty dat ve store.
 * Renderuje null pokud item nemá id.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} props.item.id - UUID události (povinné pro navigaci)
 * @returns {JSX.Element|null} null pokud item.id není definováno
 */
const BackToViewButton = ({ item, ...props }) => {
    const navigate = useNavigate()
    if (!item?.id) return null

    const handleClick = () => {
        navigate(ReadItemURI.replace(":id", item.id))
    }

    return (
        <button onClick={handleClick} {...props}>
            Zobrazit
        </button>
    )
}

/**
 * InteractiveMutations — panel NÁSTROJE s akčními tlačítky pro správu události.
 *
 * Zobrazuje sadu tlačítek pro navigaci a CRUD operace nad událostí.
 * Renderuje se v levém sloupci detail stránky (LargeCard → LeftColumn).
 *
 * Pořadí tlačítek:
 *   Stránka     — odkaz na seznam všech událostí (/list/)
 *   Zobrazit    — návrat na readonly detail (/view/:id)
 *   Upravit     — odkaz na editační stránku (/edit/:id)
 *   Odstranit   — otevře DeleteDialog pro potvrzení smazání
 *   Aktualizovat — tvrdý refresh stránky (window.location.reload)
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} props.item.id - UUID události
 * @returns {JSX.Element}
 */
export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            <PageLink className="btn btn-sm btn-outline-secondary">
                Stránka
            </PageLink>

            <BackToViewButton
                className="btn btn-sm btn-outline-primary"
                item={item}
            />

            <UpdateLink className="btn btn-sm btn-outline-success" item={item}>
                Upravit
            </UpdateLink>

            <DeleteButton className="btn btn-sm btn-outline-danger" item={item}>
                Odstranit
            </DeleteButton>

            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => window.location.reload()}
            >
                Aktualizovat
            </button>
        </CardCapsule>
    )
}