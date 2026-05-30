import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

import { MediumEditableContent, UpdateItemURI } from "../Components";
import { UpdateAsyncAction } from "../Queries";

/**
 * Výchozí obsah formuláře — komponenta MediumEditableContent
 * zobrazuje inputy pro všechna editovatelná pole události
 * (name, nameEn, place, description, startdate, enddate).
 */
const DefaultContent = (props) => <MediumEditableContent {...props} />;

const mutationAsyncAction = UpdateAsyncAction;

/**
 * Oprávnění potřebná pro zobrazení editačních komponent.
 * mode: "absolute" znamená že se kontrolují absolutní role uživatele
 * (přes /me query), ne role na konkrétní entitě.
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * attributeTransformer — překládá názvy polí z formuláře na názvy
 * které očekává GraphQL mutace.
 *
 * Problém: HTML input pro datetime-local posílá hodnoty pod id "startdate"
 * (lowercase), ale GraphQL mutace eventInsert očekává "startDate" (camelCase).
 * U eventUpdate je to naopak — očekává "startdate" (lowercase).
 * Zde řešíme update variantu, proto překládáme jen pro jistotu opačný směr.
 *
 * Vše ostatní projde beze změny (id → id, name → name, atd.)
 */
const attributeTransformer = (id, value) => {
    const keyMap = {
        startDate: "startdate",
        endDate:   "enddate",
    };
    const key = keyMap[id] ?? id;
    return { [key]: value };
};

/**
 * payloadBuilder — sestaví základní payload který se vždy pošle spolu
 * s formulářovými daty. Obsahuje povinné pole pro update:
 *   id         - identifikuje který záznam měníme
 *   lastchange - optimistický zámek (viz UpdateAsyncAction)
 *
 * Volá se jako onOk(item) těsně před odesláním mutace.
 */
const payloadBuilder = (item) => ({
    id:         item?.id,
    lastchange: item?.lastchange,
});

/**
 * UpdateLink — odkaz na editační stránku entity.
 * Generuje URL ve tvaru /kalendar/EventGQLModel/edit/:id
 * Zobrazí se jen pokud má uživatel potřebnou roli.
 */
export const UpdateLink = ({ uriPattern = UpdateItemURI, item, ...props }) => {
    if (!item) return null;
    return <BaseUpdateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />;
};

/**
 * UpdateDialog — modální dialog s editačním formulářem.
 * Otevře se jako overlay nad aktuální stránkou.
 * Komponenty Dialog, DefaultContent a mutationAsyncAction lze přepsat
 * přes props pro customizaci chování.
 */
export const UpdateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateDialog
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

/**
 * UpdateButton — tlačítko které po kliknutí otevře UpdateDialog.
 * Typicky se zobrazuje v InteractiveMutations (panel nástrojů na detail stránce).
 */
export const UpdateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = UpdateDialog,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateButton
            {...props}
            item={item}
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
 * UpdateBody — inline formulář bez dialogu, přímo vložený do stránky.
 * Používá ho PageUpdateItem (/edit/:id route) kde je editace hlavním
 * účelem celé stránky, ne jen doplňková akce.
 */
export const UpdateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateBody
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};