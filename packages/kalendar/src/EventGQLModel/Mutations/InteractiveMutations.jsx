import { CardCapsule, VectorItemsURI } from "../Components";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";
import { CreateButton } from "./Create";
import { UpdateLink } from "./Update";
import { DeleteButton } from "./Delete";

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

export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            {/* Odkaz na detailní stránku */}
            <PageLink className="btn btn-sm btn-outline-secondary">
                Stránka
            </PageLink>
            
            {/* Otevření editačního okna */}
            <UpdateLink className="btn btn-sm btn-outline-success" item={item}>
                Upravit
            </UpdateLink>
            
            {/* Vytvoření nové entity */}
            <CreateButton className="btn btn-sm btn-outline-primary" item={item}>
                Vytvořit nový
            </CreateButton>
            
            {/* Smazání entity */}
            <DeleteButton className="btn btn-sm btn-outline-danger" item={item}>
                Odstranit
            </DeleteButton>

            {/*  NOVÉ TLAČÍTKO PRO MANUÁLNÍ REFRESH */}
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