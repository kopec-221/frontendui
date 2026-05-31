import { CardCapsule, VectorItemsURI } from "../Components";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";
import { UpdateLink } from "./Update";
import { DeleteButton } from "./Delete";

/**
 * PageLink — odkaz na seznam všech událostí (VectorItemsURI = /kalendar/EventGQLModel/list/).
 * Používá ProxyLink který zachová query parametry (hash, search) z aktuální URL.
 *
 * Props jsou předány přímo do ProxyLink (className, children atd.)
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
 * InteractiveMutations — panel s akčními tlačítky pro správu události.
 *
 * Zobrazuje:
 *   Stránka    — odkaz na seznam všech událostí
 *   Upravit    — odkaz na editační stránku (/edit/:id)
 *   Odstranit  — dialog pro potvrzení smazání
 *   Aktualizovat — tvrdý refresh stránky (načte čerstvá data z DB)
 *
 * Proč zde NENÍ "Vytvořit nový":
 *   Vytvoření nového sub-eventu je dostupné přímo v SubeventsVector
 *   přes tlačítko "+ Přidat sub-event". Mít ho zde navíc by bylo
 *   matoucí — uživatel by nevěděl jestli vytváří sub-event nebo
 *   nový root event.
 *
 * Props:
 *   item - EventGQLModel objekt (potřebný pro UpdateLink a DeleteButton
 *          k získání id a rbacobject pro kontrolu oprávnění)
 */
export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            {/*
             * Stránka — naviguje na seznam /list/.
             * btn-outline-secondary = šedé tlačítko (neutrální akce)
             */}
            <PageLink className="btn btn-sm btn-outline-secondary">
                Stránka
            </PageLink>

            {/*
             * Upravit — naviguje na /edit/:id stránku.
             * UpdateLink zkontroluje rbacobject zda má uživatel oprávnění.
             * Pokud ne, tlačítko se zobrazí šedě (disabled styl).
             */}
            <UpdateLink className="btn btn-sm btn-outline-success" item={item}>
                Upravit
            </UpdateLink>

            {/*
             * Odstranit — otevře DeleteDialog s potvrzením.
             * DeleteButton zkontroluje oprávnění stejně jako UpdateLink.
             * Po potvrzení smaže entitu a přesměruje na seznam.
             */}
            <DeleteButton className="btn btn-sm btn-outline-danger" item={item}>
                Odstranit
            </DeleteButton>

            {/*
             * Aktualizovat — tvrdý reload stránky.
             * Použij když chceš načíst nejčerstvější data z databáze.
             * Normálně Redux store drží data v paměti a aktualizuje je
             * jen při mutacích — reload vynutí nové načtení všeho.
             */}
            <button
                className="btn btn-sm btn-outline-info"
                onClick={() => window.location.reload()}
                title="Načte čerstvá data z databáze"
            >
                Aktualizovat
            </button>
        </CardCapsule>
    );
};