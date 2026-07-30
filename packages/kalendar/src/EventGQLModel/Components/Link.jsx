import { URIRoot } from "../../uriroot";
import { registerLink } from "../../../../_template/src/Base/Components/Link";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

/**
 * modelURI — základní URL segment pro EventGQLModel.
 * Sestaví se z URIRoot (např. "/kalendar") + "/EventGQLModel".
 * ZŮSTÁVÁ LOKÁLNÍ, aby správně fungovalo načítání tabulek a listů.
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
 * @type {string}
 */
export const ReadItemURI = `${LinkURI}${idParam}`;

/**
 * UpdateItemURI — URL vzor pro editační stránku konkrétní události.
 * @type {string}
 */
export const UpdateItemURI = `${UpdateURI}${idParam}`;

/**
 * DeleteItemURI — URL vzor pro stránku smazání konkrétní události.
 * @type {string}
 */
export const DeleteItemURI = `${DeleteURI}${idParam}`;

/**
 * Link — odkaz na stránku EventGQLModel entity.
 *
 * Přesměrovává absolutně na port 33001 a do mikro-frontendu "event".
 */
export const Link = ({ item, action="view", children, ...props}) => {
    
    // Absolutní adresa vynutí správný port a opuštění kalendáře
    const targetURI = `http://localhost:33001/event/EventGQLModel/${action}/${item?.id}`;
    
    return (
        <a href={targetURI} {...props} style={{ textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span role="img" aria-label="událost">📅</span> 
                <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '8px' }}>
                    {children || item?.fullname || item?.name || item?.id || "Nevim"}
                </span>
            </span>
        </a>
    )
}

registerLink('EventGQLModel', Link)