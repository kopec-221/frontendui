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
const mutationAsyncAction = InsertAsyncAction;

/**
 * Oprávnění potřebná pro vytvoření události.
 * mode: "absolute" = kontrola přes globální role uživatele (/me query).
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * generateUUID — generuje UUID na klientovi.
 * Používáme Web Crypto API, fallback pro starší prostředí.
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
 * payloadBuilder vrací jen povinná pole pro insert:
 *   id            - nové UUID vygenerované na klientovi
 *   mastereventId - ID rodiče (aktuální entita na stránce)
 *
 * POZOR: BaseCreateDialog volá onOk(item) kde item je stávající entita,
 * ne formulářová data. Proto zde NESPREADUJEME currentItem —
 * formulářová data sbírá BaseCreateDialog sám přes svůj interní state.
 * onAttributeChange BaseCreateDialog nezná, proto ho neposíláme.
 */
export const CreateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    const payloadBuilder = () => ({
        id:            generateUUID(),
        mastereventId: item?.id,
    });

    return (
        <BaseCreateDialog
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

/**
 * CreateButton — tlačítko které otevře CreateDialog.
 * Zobrazuje se v InteractiveMutations jako "Vytvořit nový".
 */
export const CreateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = CreateDialog,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    const payloadBuilder = () => ({
        id:            generateUUID(),
        mastereventId: item?.id,
    });

    return (
        <BaseCreateButton
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            Dialog={Dialog}
            mutationAsyncAction={mutationAsyncAction_}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

/**
 * CreateBody — inline formulář pro vytvoření na stránce /create/
 */
export const CreateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    const payloadBuilder = () => ({
        id:            generateUUID(),
        mastereventId: item?.id,
    });

    return (
        <BaseCreateBody
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};