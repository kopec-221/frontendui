import Nav from 'react-bootstrap/Nav'
import { Link, LinkURI } from '../Components'
import { ProxyLink } from '../../../../_template/src/Base/Components/ProxyLink';
import { NavDropdown } from 'react-bootstrap';
import { UpdateLink } from '../Mutations/Update';
import { CreateButton } from '../Mutations/Create';

/**
 * HashContainer — umožňuje použití hash fragmentu URL pro určení
 * které komponenty na stránce budou viditelné.
 *
 * Vkládá se ručně do TemplateLargeCard jako children.
 * Užitečné pro definici globálně aktivních "sekcí" jako jsou:
 * věda, administrace, výuka, rozvoj atd.
 *
 * Příklad použití:
 * <TemplateLargeCard>
 *     <HashContainer>
 *         <VectorA id="history"/>
 *         <VectorB id="roles"/>
 *         <VectorC id="graph"/>
 *     </HashContainer>
 * </TemplateLargeCard>
 */
// const TemplatePageSegments = [
//     { segment: 'education', label: 'Výuka' },
//     { segment: 'reaserach', label: 'Tvůrčí činnost' },
//     { segment: 'administration', label: 'Organizační činnost' },
//     { segment: 'development', label: 'Rozvoj' },
// ]

/**
 * TitleNavButton — navigační tlačítko které generuje URL na základě
 * id šablony a konkrétního segmentu.
 *
 * Tlačítko používá ProxyLink pro navigaci a zachovává hash a query parametry.
 *
 * Funkce:
 * - Dynamicky sestaví URL s hash fragmentem odkazujícím na zadaný segment
 * - Zobrazí label navigačního odkazu
 * - Bezproblémově se integruje s ProxyLink
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - objekt entity s detaily
 * @param {string|number} props.item.id - unikátní identifikátor entity
 * @param {string} props.segment - segment přidaný jako hash fragment do URL
 * @param {string} props.label - text zobrazený jako label navigačního tlačítka
 * @returns {JSX.Element} stylizované navigační tlačítko s odkazem na sestavené URL
 *
 * @example
 * <TitleNavButton item={{ id: 123 }} segment="details" label="Zobrazit detail" />
 * // Výsledná URL: `/ug/template/view/123#details`
 */
// const TitleNavButton = ({ item, segment, label, ...props }) => {
//     const urlbase = (segment) => `${LinkURI}${item?.id}#${segment}`;
//     return (
//         <Nav.Link as={"span"} {...props}>
//             {/* <ProxyLink to={urlbase(segment)}>{label}</ProxyLink> */}
//         </Nav.Link>
//     );
// };

/**
 * PageNavbar — navigační lišta pro detail stránku entity.
 *
 * Komponenta používá hook useHash() pro určení aktuálního hash fragmentu
 * a zvýraznění aktivního segmentu. Zobrazuje navigační lištu (MyNavbar)
 * s několika sekcemi (např. "history", "roles", "graph"), každá jako TitleNavButton.
 * Segmenty jsou hardcoded a renderují se pouze pokud je předán objekt entity.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - objekt entity poskytující kontext pro stránku
 * @param {string|number} props.item.id - unikátní identifikátor entity
 * @param {Function} props.onSearchChange - callback pro zpracování změn vyhledávání
 * @returns {JSX.Element} vykreslená PageNavbar komponenta
 *
 * @example
 * <PageNavbar item={{ id: 123 }} onSearchChange={handleSearchChange} />
 */
// export const PageNavbar = ({ item, children, onSearchChange }) => {
//     const currentHash = "da"
//     return (
//         <div className='screen-only'>
//             <MyNavbar onSearchChange={onSearchChange} >
//                 {item && TemplatePageSegments.map(({ segment, label }) => (
//                     <Nav.Item key={segment} >
//                         <TitleNavButton
//                             template={item}
//                             segment={segment}
//                             label={label}
//                             className={segment === currentHash ? "active" : ""}
//                             aria-current={segment === currentHash ? "page" : undefined}
//                         />
//                     </Nav.Item>
//                 ))}
//                 {children}
//             </MyNavbar>
//         </div>
//     );
// };

/**
 * MyNavDropdown — rozbalovací navigační menu pro správu skupin entity.
 *
 * Zobrazuje dropdown s položkami pro navigaci na seznam, role, podskupiny
 * a členy entity. Tlačítka pro editaci a vytvoření jsou dostupná pouze
 * pokud má entita správný typ (TemplateGQLModel).
 *
 * Poznámka: Tato komponenta je převzata ze šablony (_template) a slouží
 * jako základ pro případné rozšíření navigace EventGQLModel.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.item] - objekt entity
 * @param {string} [props.item.__typename] - GraphQL typ entity (musí být "TemplateGQLModel")
 * @param {string} [props.item.id] - UUID entity
 * @returns {JSX.Element} rozbalovací navigační menu
 */
export const MyNavDropdown = ({ item }) => {
    const { __typename } = item || {}
    const hasProperType = __typename === "TemplateGQLModel"
    return (
        <NavDropdown title="Skupiny">
            <NavDropdown.Item as={ProxyLink} to={VectorItemsURI}>
                Seznam všech 
            </NavDropdown.Item>
            
            <NavDropdown.Item as={Link} item={item} action="roles" disabled={!hasProperType}>
                Role<br/><Link item={item} />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} item={item} action="subgroups" disabled={!hasProperType}>
                Podskupiny<br/><Link item={item} />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} item={item} action="memberships" disabled={!hasProperType}>
                Členové<br/><Link item={item} />
            </NavDropdown.Item>
        
            <NavDropdown.Divider />
            
            <NavDropdown.Item 
                as={UpdateLink} 
                item={item}
                disabled={!hasProperType} 
            >
                Upravit<br/><Link item={item} />
            </NavDropdown.Item>
            <NavDropdown.Item 
                as={CreateButton} 
                item={item} 
                disabled={!hasProperType} 
                item={{
                    group: item,
                    groupId: item?.groupId
                }}
            >
                Nové<br/><Link item={item} />
            </NavDropdown.Item>
            
            <NavDropdown.Divider />
            <NavDropdown.Item 
                as={ProxyLink} 
                to={`/generic/${item?.__typename}/__def/${item?.id}`} 
                reloadDocument={false}
            >
                Definice
            </NavDropdown.Item>
        </NavDropdown>
    )
}