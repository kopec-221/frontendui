import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";

import { MediumEditableContent, CreateURI, ReadItemURI } from "../Components";
import { InsertAsyncAction } from "../Queries";

const DefaultContent = (props) => <MediumEditableContent {...props} />
const mutationAsyncAction = InsertAsyncAction

const permissions = {
    oneOfRoles: ["administrátor"],
    mode: "absolute",
}

// ALTERNATIVE, CHECK GQLENDPOINT
// const permissions = {
//     oneOfRoles: ["administrátor", "personalista"],
//     mode: "item",
// }


// Mapování políček z formuláře na formát, který očekává GQL (např. name -> event_name)
const attributeTransformer = (id, value) => ({ [`event_${id}`]: value });

// Příprava povinných parametrů pro vytvoření (Insert). 
// Backend vyžaduje, aby nová událost měla rodiče (mastereventId).
// Z 'item' (aktuální stránky) vezmeme ID a pošleme ho jako rodiče.
const payloadBuilder = (item) => ({ 
    event_mastereventId: item?.id 
});
// ----------------------------

/**
 * Link na create stránku / create route pro tvorbu nové entity.
 *
 * Wrapper nad `BaseCreateLink`. Nastavuje výchozí `uriPattern` a aplikuje RBAC
 * přes `permissions`. Vše ostatní přeposílá do Base komponenty.
 *
 * @param {Object} params
 * @param {string} [params.uriPattern=CreateURI]
 * URI pattern pro create route.
 * @param {Object} params.props
 * Další props přeposílané do `BaseCreateLink` (např. `children`, `className`,
 * `preserveSearch`, `preserveHash`, atd.).
 * @returns {JSX.Element}
 */
export const CreateLink = ({
    uriPattern = CreateURI,
    ...props
}) => {
    return <BaseCreateLink
        {...props}
        uriPattern={uriPattern}
        {...permissions}
    />
}

/**
 * Dialog pro vytvoření entity.
 *
 * Wrapper nad `BaseCreateDialog`. Dodává výchozí editovatelný obsah (`DefaultContent`)
 * a výchozí mutační akci (`mutationAsyncAction`) pro uložení. Aplikuje RBAC
 * přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta, která vykreslí formulář dialogu (typicky MediumEditableContent).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení (např. InsertAsyncAction). Použije se podle Base/General implementace.
 * @param {Object} params.props
 * Další props přeposílané do `BaseCreateDialog` (např. `title`, `oklabel`, `cancellabel`,
 * `item`, `onOk`, `onCancel`, atd.).
 * @returns {JSX.Element}
 */
export const CreateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseCreateDialog
            {...props}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

/**
 * Tlačítko, které otevře create dialog a provede uložení.
 *
 * Wrapper nad `BaseCreateButton`. Dodává výchozí `DefaultContent`, výchozí `Dialog`,
 * a výchozí `mutationAsyncAction`. Aplikuje RBAC přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta formuláře (typicky MediumEditableContent).
 * @param {React.ComponentType<Object>} [params.Dialog=CreateDialog]
 * Dialog komponenta použitá pro vytvoření (volá `onOk(draft)` / `onCancel()`).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení (např. InsertAsyncAction).
 * @param {Object} params.props
 * Další props přeposílané do `BaseCreateButton` (např. `children`, `className`, `title`,
 * `item`, `uriPattern`, `onOk`, `onCancel`, atd.).
 * @returns {JSX.Element}
 */
export const CreateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = CreateDialog,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseCreateButton
            {...props}
            DefaultContent={DefaultContent_}
            Dialog={Dialog}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

/**
 * “Page-level” create workflow (celá stránka pro vytváření).
 *
 * Wrapper nad `BaseCreateBody`. Typicky vykreslí formulář (`DefaultContent`)
 * a zajistí uložení přes `mutationAsyncAction` (dle Base/General implementace).
 * Aplikuje RBAC přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta formuláře (typicky MediumEditableContent).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení (např. InsertAsyncAction).
 * @param {Object} params.props
 * Další props přeposílané do `BaseCreateBody` (např. `title`, `oklabel`, `cancellabel`,
 * `item`, `onOk`, `onCancel`, `className`, atd.).
 * @returns {JSX.Element}
 */
export const CreateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseCreateBody
            {...props}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};