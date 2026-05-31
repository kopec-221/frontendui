import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";

import { MediumEditableContent, CreateURI } from "../Components";
import { InsertAsyncAction } from "../Queries";

/**
 * Výchozí obsah formuláře pro vytvoření nové události.
 */
const DefaultContent = (props) => <MediumEditableContent {...props} />;

/**
 * Oprávnění potřebná pro vytvoření události.
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * generateUUID — generuje UUID na klientovi.
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
 */
export const CreateLink = ({ uriPattern = CreateURI, item, ...props }) => {
    return <BaseCreateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />;
};

/**
 * CreateDialog — modální dialog pro vytvoření nové události.
 *
 * Předáváme item s předvyplněným id a mastereventId.
 * BaseCreateDialog použije tento item jako počáteční stav formuláře
 * a sloučí ho s tím co uživatel vyplní.
 * InsertAsyncAction se volá přímo — bez wrapperu.
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
 * CreateButton — tlačítko které otevře CreateDialog.
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
 * CreateBody — inline formulář pro vytvoření na stránce /create/
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