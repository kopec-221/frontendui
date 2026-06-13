import { CardCapsule, VectorItemsURI, ReadItemURI } from "../Components";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";
import { UpdateLink } from "./Update";
import { DeleteButton } from "./Delete";
import { useNavigate } from "react-router-dom";

/**
 * PageLink — odkaz na seznam všech událostí (VectorItemsURI = /kalendar/EventGQLModel/list/).
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
 * BackToViewButton — tlačítko které naviguje zpět na /view/:id stránku.
 * Užitečné na editační stránce (/edit/:id) pro návrat na readonly detail.
 *
 * Props:
 *   item - EventGQLModel objekt (potřebný pro získání id)
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
 * InteractiveMutations — panel s akčními tlačítky pro správu události.
 *
 * Zobrazuje:
 *   Stránka    — odkaz na seznam všech událostí (/list/)
 *   Zobrazit   — návrat na readonly detail (/view/:id)
 *   Upravit    — odkaz na editační stránku (/edit/:id)
 *   Odstranit  — dialog pro potvrzení smazání
 *   Aktualizovat — tvrdý refresh stránky
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