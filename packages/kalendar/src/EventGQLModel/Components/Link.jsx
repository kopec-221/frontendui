import { URIRoot } from "../../uriroot";
import { registerLink } from "../../../../_template/src/Base/Components/Link";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

/**
 * modelURI — základní URL segment pro EventGQLModel.
 * Sestaví se z URIRoot (např. "/kalendar") + "/EventGQLModel".
 *
 * @type {string}
 */
const modelURI = `${URIRoot}/EventGQLModel`

/**
 * ListURI — URL pro seznam všech událostí.
 * @type {string}
 */
export const ListURI = `${modelURI}/list/`;

/**
 * CreateURI — URL pro stránku vytvoření nové události.
 * @type {string}
 */
export const CreateURI = `${modelURI}/create/`;

/**
 * ReadURI — základní URL pro detail stránku (bez :id).
 * @type {string}
 */
export const ReadURI = `${modelURI}/view/`;

/**
 * UpdateURI — základní URL pro editační stránku (bez :id).
 * @type {string}
 */
export const UpdateURI = `${modelURI}/edit/`;

/**
 * DeleteURI — základní URL pro stránku smazání (bez :id).
 * @type {string}
 */
export const DeleteURI = `${modelURI}/delete/`;

/**
 * LinkURI — alias pro ReadURI, používá se jako výchozí cíl odkazu na událost.
 * @type {string}
 */
export const LinkURI = ReadURI;

/**
 * VectorItemsURI — alias pro ListURI, používá se v PageLink a routách.
 * @type {string}
 */
export const VectorItemsURI = ListURI;

/** Název URL parametru pro id entity v dynamických routách. */
const idParam = ":id"

/**
 * ReadItemURI — URL vzor pro detail stránku konkrétní události.
 * Např. "/kalendar/EventGQLModel/view/:id"
 * @type {string}
 */
export const ReadItemURI = `${LinkURI}${idParam}`;

/**
 * UpdateItemURI — URL vzor pro editační stránku konkrétní události.
 * Např. "/kalendar/EventGQLModel/edit/:id"
 * @type {string}
 */
export const UpdateItemURI = `${UpdateURI}${idParam}`;

/**
 * DeleteItemURI — URL vzor pro stránku smazání konkrétní události.
 * Např. "/kalendar/EventGQLModel/delete/:id"
 * @type {string}
 */
export const DeleteItemURI = `${DeleteURI}${idParam}`;

/**
 * Link — odkaz na stránku EventGQLModel entity.
 *
 * Dynamicky sestaví cílovou URL z LinkURI a item.id.
 * Prop action umožňuje přepnout cíl na jinou akci (edit, delete...).
 *
 * Fallback pro text odkazu (v pořadí priority):
 *   children → item.fullname → item.name → item.id → "Nevim"
 *
 * Registruje se do globálního registru odkazů přes registerLink
 * aby ji ostatní komponenty mohly použít přes název typu "EventGQLModel".
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {string} [props.item.id] - UUID události (použije se v URL)
 * @param {string} [props.item.name] - název události (výchozí text odkazu)
 * @param {string} [props.item.fullname] - plný název (prioritní před name)
 * @param {string} [props.LinkURI=LinkURI] - základní URL vzor (výchozí je ReadURI)
 * @param {string} [props.action="view"] - akce která nahradí "view" v URL
 * @param {React.ReactNode} [props.children] - vlastní text odkazu
 * @returns {JSX.Element} ProxyLink komponenta s odkazem na stránku události
 *
 * @example
 * // Odkaz na detail stránku
 * <Link item={event} />
 * // Výsledná URL: /kalendar/EventGQLModel/view/uuid
 *
 * @example
 * // Odkaz na editační stránku
 * <Link item={event} action="edit">Upravit</Link>
 * // Výsledná URL: /kalendar/EventGQLModel/edit/uuid
 */
export const Link = ({ item, LinkURI: LinkURI_ = LinkURI, action="view", children, ...props}) => {
    const targetURI = LinkURI_.replace('view', action);
    return <ProxyLink to={targetURI + item?.id} {...props}>{children || item?.fullname || item?.name || item?.id || "Nevim"}</ProxyLink>
}

/**
 * Registrace Link komponenty do globálního registru odkazů.
 * Umožňuje ostatním komponentám (např. Table) dynamicky renderovat
 * správný odkaz pro typ "EventGQLModel" bez přímé závislosti.
 */
registerLink('EventGQLModel', Link)