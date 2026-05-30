import { DeleteItemURI, ListURI, MediumContent } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import {
    DeleteBody as BaseDeleteBody,
    DeleteButton as BaseDeleteButton,
    DeleteDialog as BaseDeleteDialog,
    DeleteLink as BaseDeleteLink
} from "../../../../_template/src/Base/Mutations/Delete";

/**
 * Výchozí obsah potvrzovacího dialogu.
 * Zobrazí detail události + varování pokud má pod-události.
 */
const DefaultContent = ({ item, ...props }) => {
    const subeventsCount = item?.subevents?.length ?? 0;

    return (
        <>
            <MediumContent item={item} {...props} />
            {subeventsCount > 0 && (
                <div className="alert alert-danger mt-3">
                    <strong>Nelze smazat!</strong> Tato událost má {subeventsCount} pod-událost{subeventsCount === 1 ? "" : subeventsCount < 5 ? "i" : "í"}.
                    Nejdřív smažte všechny pod-události.
                </div>
            )}
        </>
    );
};

/**
 * SafeDeleteAsyncAction — wrapper který:
 * 1. Zkontroluje zda událost nemá pod-události
 * 2. Pokud má, hodí chybu před odesláním na API
 * 3. Pokud nemá, pošle jen { id, lastchange }
 */
const SafeDeleteAsyncAction = (item, ...rest) => {
    const subeventsCount = item?.subevents?.length ?? 0;
    if (subeventsCount > 0) {
        // Vrátíme thunk který okamžitě hodí chybu — nedostane se na API
        return async () => {
            throw new Error(
                `Nelze smazat událost která má ${subeventsCount} pod-událostí. Nejdřív smažte pod-události.`
            );
        };
    }

    const payload = {
        id:         item?.id,
        lastchange: item?.lastchange,
    };
    return DeleteAsyncAction(payload, ...rest);
};

const MutationAsyncAction = SafeDeleteAsyncAction;

/**
 * Oprávnění — role potřebná pro smazání.
 * mode: "absolute" = kontrola přes globální role uživatele.
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * DeleteLink — odkaz na stránku pro smazání entity.
 * Generuje URL /kalendar/EventGQLModel/delete/:id
 */
export const DeleteLink = ({ uriPattern = DeleteItemURI, item, ...props }) => {
    if (!item) return null;
    return (
        <BaseDeleteLink {...props} item={item} uriPattern={uriPattern} {...permissions} />
    );
};

/**
 * DeleteDialog — modální potvrzovací dialog.
 * Zobrazí varování pokud má událost pod-události.
 * Po potvrzení přesměruje na seznam (vectorItemsURI).
 */
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
            {...permissions}
        />
    );
};

/**
 * DeleteButton — tlačítko které otevře DeleteDialog.
 * Zobrazuje se v InteractiveMutations na detail stránce.
 */
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

/**
 * DeleteBody — inline potvrzení smazání na stránce /delete/:id
 * Po úspěšném smazání přesměruje na seznam.
 */
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