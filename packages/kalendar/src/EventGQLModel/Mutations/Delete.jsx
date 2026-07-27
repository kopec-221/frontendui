import { DeleteItemURI, ListURI, MediumContent } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import {
    DeleteBody as BaseDeleteBody,
    DeleteButton as BaseDeleteButton,
    DeleteDialog as BaseDeleteDialog,
    DeleteLink as BaseDeleteLink
} from "../../../../_template/src/Base/Mutations/Delete";

/**
 * DefaultContent — výchozí obsah potvrzovacího dialogu pro smazání události.
 *
 * Zobrazí readonly detail události (MediumContent) a pokud má událost
 * pod-události, zobrazí červené varování se zákazem smazání.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt mazané události
 * @param {Array} [props.item.subevents] - seznam pod-událostí
 * @returns {JSX.Element}
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
 * SafeDeleteAsyncAction — bezpečný wrapper nad DeleteAsyncAction.
 *
 * Před odesláním požadavku na API zkontroluje zda událost nemá pod-události.
 * Pokud má, vrátí thunk který okamžitě hodí chybu — API se vůbec nezavolá.
 * Pokud nemá, sestaví payload { id, lastchange } a zavolá DeleteAsyncAction.
 *
 * Proč lastchange? — optimistický zámek. Server odmítne smazání pokud byl
 * záznam mezitím změněn někým jiným (lastchange se neshoduje).
 *
 * @param {Object} item - EventGQLModel objekt
 * @param {string} item.id - UUID události
 * @param {string} item.lastchange - timestamp poslední změny
 * @param {Array} [item.subevents] - seznam pod-událostí
 * @param {...any} rest - další argumenty předané do DeleteAsyncAction
 * @returns {Function} Redux thunk akce
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

/**
 * MutationAsyncAction — akce použitá pro smazání události.
 * Alias pro SafeDeleteAsyncAction — přidává ochranu před smazáním
 * události s pod-událostmi.
 */
const MutationAsyncAction = SafeDeleteAsyncAction;

/**
 * permissions — oprávnění potřebná pro smazání události.
 * Uživatel musí mít roli "plánovací administrátor".
 * mode "absolute" = kontrola přes globální role uživatele.
 *
 * @type {{oneOfRoles: string[], mode: string}}
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * DeleteLink — odkaz na stránku pro smazání události.
 * Generuje URL /kalendar/EventGQLModel/delete/:id
 *
 * @component
 * @param {Object} props
 * @param {string} [props.uriPattern=DeleteItemURI] - URL vzor pro stránku smazání
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
 */
export const DeleteLink = ({ uriPattern = DeleteItemURI, item, ...props }) => {
    if (!item) return null;
    return (
        <BaseDeleteLink {...props} item={item} uriPattern={uriPattern} {...permissions} />
    );
};

/**
 * DeleteDialog — modální potvrzovací dialog pro smazání události.
 *
 * Zobrazí DefaultContent (detail + případné varování o pod-událostech).
 * Po potvrzení zavolá SafeDeleteAsyncAction a přesměruje na seznam.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction] - akce pro smazání
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - obsah dialogu
 * @param {string} [props.vectorItemsURI=ListURI] - URL pro přesměrování po smazání
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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
 *
 * Zobrazuje se v InteractiveMutations (sekce NÁSTROJE) na detail stránce.
 * Před zobrazením dialogu zkontroluje oprávnění uživatele.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction] - akce pro smazání
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - obsah dialogu
 * @param {React.ComponentType} [props.Dialog=DeleteDialog] - dialog komponenta
 * @param {string} [props.vectorItemsURI=ListURI] - URL pro přesměrování po smazání
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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
 * DeleteBody — inline potvrzení smazání na stránce /delete/:id.
 *
 * Na rozdíl od DeleteDialog se nezobrazuje v modálním okně ale přímo
 * na stránce. Používá se v PageDeleteItem.
 * Po úspěšném smazání přesměruje na seznam událostí.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction] - akce pro smazání
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - obsah stránky
 * @param {string} [props.vectorItemsURI=ListURI] - URL pro přesměrování po smazání
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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