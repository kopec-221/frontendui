import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";

import { MediumEditableContent, CreateURI } from "../Components";
import { InsertAsyncAction } from "../Queries";

/**
 * DefaultContent — výchozí obsah formuláře pro vytvoření nové události.
 * Renderuje MediumEditableContent s předanými props.
 *
 * @component
 * @param {Object} props - props předané do MediumEditableContent
 * @returns {JSX.Element}
 */
const DefaultContent = (props) => <MediumEditableContent {...props} />;

/**
 * permissions — oprávnění potřebná pro vytvoření události.
 * Uživatel musí mít roli "plánovací administrátor".
 * mode "absolute" znamená že se role kontroluje globálně.
 *
 * @type {{oneOfRoles: string[], mode: string}}
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * generateUUID — generuje náhodné UUID v4 na klientovi.
 *
 * Primárně používá crypto.randomUUID() (Web Crypto API).
 * Fallback na Math.random() implementaci pro starší prohlížeče.
 *
 * @returns {string} UUID ve formátu "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
 */
const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * CreateLink — odkaz na stránku pro vytvoření nové události.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.uriPattern=CreateURI] - URL vzor pro stránku vytvoření
 * @param {Object} [props.item] - EventGQLModel objekt (pro kontext)
 * @returns {JSX.Element}
 */
export const CreateLink = ({ uriPattern = CreateURI, item, ...props }) => {
    return <BaseCreateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />;
};

/**
 * CreateDialog — modální dialog pro vytvoření nové události.
 *
 * Před renderováním sestaví newItem s vygenerovaným UUID a mastereventId
 * z předaného item.id. BaseCreateDialog použije newItem jako počáteční
 * stav formuláře a sloučí ho s tím co uživatel vyplní.
 * Po potvrzení zavolá InsertAsyncAction.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - komponenta formuláře
 * @param {Object} [props.item] - nadřazená událost; item.id se použije jako mastereventId
 * @returns {JSX.Element}
 */
export const CreateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    item,
    ...props
}) => {
    const newItem = {
        id:            generateUUID(),
        mastereventId: item?.id,
    };

    return (
        <BaseCreateDialog
            {...props}
            item={newItem}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={InsertAsyncAction}
            {...permissions}
        />
    );
};

/**
 * CreateButton — tlačítko které otevře CreateDialog pro vytvoření nové události.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - komponenta formuláře
 * @param {React.ComponentType} [props.Dialog=CreateDialog] - dialog komponenta
 * @param {Object} [props.item] - nadřazená událost; item.id se použije jako mastereventId
 * @param {React.ReactNode} [props.children] - obsah tlačítka
 * @returns {JSX.Element}
 */
export const CreateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = CreateDialog,
    item,
    ...props
}) => {
    const newItem = {
        id:            generateUUID(),
        mastereventId: item?.id,
    };

    return (
        <BaseCreateButton
            {...props}
            item={newItem}
            DefaultContent={DefaultContent_}
            Dialog={Dialog}
            mutationAsyncAction={InsertAsyncAction}
            {...permissions}
        />
    );
};

/**
 * CreateBody — inline formulář pro vytvoření nové události na stránce /create/.
 *
 * Na rozdíl od CreateDialog se nezobrazuje v modálním okně ale přímo na stránce.
 * Používá se v PageCreateItem.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - komponenta formuláře
 * @param {Object} [props.item] - nadřazená událost; item.id se použije jako mastereventId
 * @returns {JSX.Element}
 */
export const CreateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    item,
    ...props
}) => {
    const newItem = {
        id:            generateUUID(),
        mastereventId: item?.id,
    };

    return (
        <BaseCreateBody
            {...props}
            item={newItem}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={InsertAsyncAction}
            {...permissions}
        />
    );
};