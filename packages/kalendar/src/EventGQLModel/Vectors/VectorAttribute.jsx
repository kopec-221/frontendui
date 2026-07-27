import { CardCapsule } from "../Components/CardCapsule"
import { Table } from "../Components/Table"
import { Col } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"

/**
 * VectorAttributeFactory — továrna která vytvoří komponentu pro zobrazení
 * konkrétního vektorového atributu entity.
 *
 * Vrátí novou komponentu která přijme { item } a zobrazí
 * item[attribute_name] jako tabulku v CardCapsule.
 * Slouží pro dynamické generování komponent pro různé atributy.
 *
 * @param {string} attribute_name - název atributu v item objektu (např. "subevents", "roles")
 * @returns {React.ComponentType} komponenta přijímající { item } prop
 *
 * @example
 * const SubeventsAttribute = VectorAttributeFactory("subevents")
 * <SubeventsAttribute item={event} />
 */
export const VectorAttributeFactory = (attribute_name) => ({ item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <Row key={attribute_name}>
            <Col className="col-2"><b>{attribute_name}</b></Col>
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    )
}

/**
 * VectorAttribute_ — starší varianta zobrazení vektorového atributu ve dvousloupcovém layoutu.
 *
 * Zobrazí název atributu vlevo (tučně) a tabulku hodnot vpravo.
 * Používá Row/Col layout na rozdíl od novější VectorAttribute která
 * používá CardCapsule s title.
 *
 * @component
 * @param {Object} props
 * @param {string} props.attribute_name - název atributu (zobrazí se jako label vlevo)
 * @param {Object} props.item - entita obsahující vektorový atribut
 * @returns {JSX.Element}
 *
 * @example
 * <VectorAttribute_ attribute_name="subevents" item={event} />
 */
export const VectorAttribute_ = ({ attribute_name, item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <Row key={attribute_name}>
            <Col className="col-2"><b>{attribute_name}</b></Col>
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    )
}

/**
 * VectorAttribute — zobrazí jeden vektorový atribut entity jako CardCapsule s tabulkou.
 *
 * Novější varianta která používá CardCapsule s title místo Row/Col layoutu.
 * Title je ve formátu "attribute_name[]" aby bylo jasné že jde o pole.
 * Pokud atribut neexistuje nebo je prázdný, zobrazí prázdnou tabulku.
 *
 * @component
 * @param {Object} props
 * @param {string} props.attribute_name - název atributu v item objektu
 * @param {Object} props.item - entita obsahující vektorový atribut
 * @returns {JSX.Element}
 *
 * @example
 * <VectorAttribute attribute_name="subevents" item={event} />
 * // Zobrazí CardCapsule s title "subevents[]" a tabulkou sub-událostí
 */
export const VectorAttribute = ({ attribute_name, item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <CardCapsule item={item} title={attribute_name+'[]'}>
            <Table data={attribute_value} />
        </CardCapsule>
    )
}

/**
 * MediumCardVectors — zobrazí všechny vektorové (pole) atributy entity.
 *
 * Prochází všechny atributy entity a pro každý který je pole (Array)
 * vykreslí VectorAttribute komponentu. Skalární atributy jsou ignorovány.
 *
 * Používá se pro automatické zobrazení všech relačních polí entity
 * bez nutnosti explicitně vyjmenovat každý atribut.
 * Podobně jako MediumCardScalars ale pro pole místo objektů.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - entita jejíž vektorové atributy zobrazíme
 * @returns {JSX.Element} CardCapsule s VectorAttribute pro každé pole atributu
 *
 * @example
 * // Automaticky zobrazí subevents[], userInvitations[], facilityReservations[]...
 * <MediumCardVectors item={event} />
 */
export const MediumCardVectors = ({ item }) => {
    return (
        <CardCapsule item={item}>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) {
                    return <VectorAttribute key={attribute_name} attribute_name={attribute_name} item={item} />
                } else {
                    return null
                }
            })}
        </CardCapsule>
    )
}