import { DeleteItemURI, ListURI, MediumContent, VectorItemsURI } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import { 
    DeleteBody as BaseDeleteBody, 
    DeleteButton as BaseDeleteButton, 
    DeleteDialog as BaseDeleteDialog, 
    DeleteLink as BaseDeleteLink
} from "../../../../_template/src/Base/Mutations/Delete";

const DefaultContent = MediumContent;

// 🔗 OPRAVENÝ WRAPPER: Propouštíme payload i systémového GQL klienta
const SafeDeleteAsyncAction = (item, ...rest) => {
    const payload = {
        id: item?.id,
        lastchange: item?.lastchange
    };
    // Předáváme payload a všechny ostatní parametry (včetně klienta) dál
    return DeleteAsyncAction(payload, ...rest);
};

const MutationAsyncAction = SafeDeleteAsyncAction;

// Správná RBAC role vyžadovaná backendem
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

// ... (zbytek souboru s exporty DeleteLink, DeleteDialog atd. zůstává beze změny)

// Exportované komponenty s defenzivními pojistkami

export const DeleteLink = ({ 
    uriPattern = DeleteItemURI,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseDeleteLink 
            {...props} 
            item={item}
            uriPattern={uriPattern} 
            {...permissions}
        />
    );
};

export const DeleteDialog = ({
    mutationAsyncAction = MutationAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    vectorItemsURI = ListURI,
    item,
    ...props 
}) => {
    if (!item) return null;
    return (
        <BaseDeleteDialog 
            {...props} 
            item={item}
            DefaultContent={DefaultContent_} 
            mutationAsyncAction={mutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            // onOk je záměrně vynecháno, aby Base implementace nativně
            // přesměrovala uživatele na vectorItemsURI (seznam) po úspěšném smazání.
            {...permissions}
        />
    );
};

export const DeleteButton = ({
    mutationAsyncAction = MutationAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = DeleteDialog,
    vectorItemsURI = ListURI,
    item,
    ...props 
}) => {
    if (!item) return null;
    return (
        <BaseDeleteButton 
            {...props} 
            item={item}
            DefaultContent={DefaultContent_} 
            Dialog={Dialog}
            mutationAsyncAction={mutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            {...permissions}
        />
    );
};

export const DeleteBody = ({ 
    mutationAsyncAction = MutationAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    vectorItemsURI = ListURI,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseDeleteBody 
            {...props} 
            item={item}
            DefaultContent={DefaultContent_} 
            mutationAsyncAction={mutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            {...permissions}
        />
    );
};