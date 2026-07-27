import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

import { MediumEditableContent, UpdateItemURI } from "../Components";
import { UpdateAsyncAction } from "../Queries";

/**
 * DefaultContent — výchozí obsah editačního formuláře události.
 *
 * Renderuje MediumEditableContent která zobrazuje inputy pro všechna
 * editovatelná pole: name, nameEn, description, startdate, enddate.
 * Pole "place" není dostupné — backend EventUpdateGQLModel ho nepodporuje.
 *
 * @component
 * @param {Object} props - props předané do MediumEditableContent
 * @returns {JSX.Element}
 */
const DefaultContent = (props) => <MediumEditableContent {...props} />;

/**
 * mutationAsyncAction — výchozí GraphQL mutace pro update události.
 * Alias pro UpdateAsyncAction z Queries/.
 */
const mutationAsyncAction = UpdateAsyncAction;

/**
 * permissions — oprávnění potřebná pro zobrazení editačních komponent.
 *
 * oneOfRoles: uživatel musí mít alespoň jednu z uvedených rolí.
 * mode "absolute" = kontrolují se absolutní role uživatele přes /me query,
 * ne role na konkrétní entitě (per-entity RBAC).
 *
 * @type {{oneOfRoles: string[], mode: string}}
 */
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

/**
 * attributeTransformer — překládá názvy polí z formuláře na názvy
 * které očekává GraphQL mutace eventUpdate.
 *
 * Problém: HTML input pro datetime-local posílá hodnoty pod id "startDate"
 * (camelCase D — shodné s eventInsert), ale eventUpdate očekává "startdate"
 * (lowercase). Transformer zajistí správný překlad při každé změně inputu.
 *
 * Vše ostatní projde beze změny (id → id, name → name, atd.)
 *
 * @param {string} id - název atributu z formuláře (např. "startDate")
 * @param {any} value - nová hodnota atributu
 * @returns {Object} objekt s přeloženým názvem klíče (např. { startdate: value })
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
 * payloadBuilder — sestaví povinný payload pro GraphQL mutaci eventUpdate.
 *
 * Volá se těsně před odesláním mutace (onOk callback).
 * Obsahuje povinná pole:
 *   id         — identifikuje který záznam měníme
 *   lastchange — optimistický zámek; server odmítne update pokud se
 *                lastchange neshoduje (záznam byl mezitím změněn)
 *
 * @param {Object} item - EventGQLModel objekt
 * @param {string} item.id - UUID události
 * @param {string} item.lastchange - timestamp poslední změny
 * @returns {{id: string, lastchange: string}}
 */
const payloadBuilder = (item) => ({
    id:         item?.id,
    lastchange: item?.lastchange,
});

/**
 * UpdateLink — odkaz na editační stránku události.
 *
 * Generuje URL ve tvaru /kalendar/EventGQLModel/edit/:id.
 * Zobrazí se pouze pokud má uživatel roli "plánovací administrátor".
 *
 * @component
 * @param {Object} props
 * @param {string} [props.uriPattern=UpdateItemURI] - URL vzor pro editační stránku
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
 */
export const UpdateLink = ({ uriPattern = UpdateItemURI, item, ...props }) => {
    if (!item) return null;
    return <BaseUpdateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />;
};

/**
 * UpdateDialog — modální dialog s editačním formulářem události.
 *
 * Otevře se jako overlay nad aktuální stránkou.
 * Používá attributeTransformer pro překlad názvů polí a payloadBuilder
 * pro sestavení povinných polí před odesláním mutace.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - formulář
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction] - mutace
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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
 *
 * Typicky se zobrazuje v InteractiveMutations (panel NÁSTROJE na detail stránce).
 * Dialog, DefaultContent a mutationAsyncAction lze přepsat přes props.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - formulář
 * @param {React.ComponentType} [props.Dialog=UpdateDialog] - dialog komponenta
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction] - mutace
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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
 * UpdateBody — inline editační formulář přímo na stránce (bez dialogu).
 *
 * Používá ho PageUpdateItem na route /edit/:id kde je editace hlavním
 * účelem stránky. Na rozdíl od UpdateDialog se nezobrazuje jako overlay.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.DefaultContent=DefaultContent] - formulář
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction] - mutace
 * @param {Object} props.item - EventGQLModel objekt
 * @returns {JSX.Element|null} null pokud item není definován
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