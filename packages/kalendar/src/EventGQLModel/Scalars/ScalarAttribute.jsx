import { useSelector } from "react-redux";

// import { selectItemById } from "../Store/ItemSlice"; // uprav cestu

import { CardCapsule } from "../Components/CardCapsule"
import { MediumCard } from "../Components/MediumCard"
import { Col } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { selectItemById } from "../../../../dynamic/src/Store";
import { useMemo } from "react";

/**
 * ScalarAttributeCapsule — layout wrapper pro zobrazení jednoho skalárního atributu.
 *
 * Vykreslí dvousloupcový řádek kde vlevo je název atributu (tučně)
 * a vpravo je obsah (children).
 *
 * @component
 * @param {Object} props
 * @param {string} props.attribute_name - název atributu zobrazený vlevo (např. "type", "facility")
 * @param {Object} props.item - EventGQLModel objekt (předáván dál do children)
 * @param {React.ReactNode} props.children - obsah pravého sloupce
 * @returns {JSX.Element}
 */
export const ScalarAttributeCapsule = ({ attribute_name, item, children }) => {
    return (
        <Row>
            <Col className="col-2"><b>{attribute_name}</b></Col>
            <Col className="col-10">
                {children}
            </Col>
        </Row>
    )
}

/**
 * ScalarAttributeBase — zobrazí jeden skalární atribut jako MediumCard.
 *
 * Kombinuje ScalarAttributeCapsule (layout) a MediumCard (zobrazení entity).
 * Předpokládá že item je již načtená entita (ne jen reference s id).
 *
 * @component
 * @param {Object} props
 * @param {string} props.attribute_name - název atributu (zobrazí se jako label)
 * @param {Object} props.item - entita k zobrazení v MediumCard
 * @returns {JSX.Element}
 */
export const ScalarAttributeBase = ({ attribute_name, item }) => {
    return (
        <ScalarAttributeCapsule attribute_name={attribute_name} item={item}>
            <MediumCard item={item} />
        </ScalarAttributeCapsule>
    )
}

/**
 * ScalarAttributeBind — načte entitu ze Redux store a zobrazí ji jako ScalarAttributeBase.
 *
 * Přijme item s vnořeným objektem pod klíčem attribute_name (např. item.type),
 * z něj vytáhne id, načte plná data ze store přes selectItemById
 * a předá je do ScalarAttributeBase pro vykreslení.
 *
 * Tím se zajistí že se zobrazí vždy nejnovější data ze store,
 * ne jen ta která přišla jako součást nadřazené entity.
 *
 * @component
 * @param {Object} props
 * @param {string} props.attribute_name - název atributu (klíč v item objektu)
 * @param {Object} props.item - nadřazená entita obsahující vnořený objekt pod attribute_name
 * @returns {JSX.Element}
 */
export const ScalarAttributeBind = ({ attribute_name, item }) => {
    const id = item?.[attribute_name]?.id
    const storedItem = useSelector((rootState) => {
        const result = id != null ? selectItemById(rootState, id) : null
        return result
    })
    return (
        <ScalarAttributeBase attribute_name={attribute_name} item={storedItem} />
    )
}

/**
 * MediumCardScalars — zobrazí všechny skalární relační atributy entity.
 *
 * Prochází všechna pole entity a vybere pouze ta která jsou:
 *   - objekty (ne primitivní hodnoty)
 *   - nejsou pole (Array)
 *   - mají vlastní id (jde o vnořenou entitu, ne jen pomocný objekt)
 *
 * Pro každý nalezený atribut vykreslí ScalarAttributeBind v CardCapsule.
 * useMemo zajistí že filtrování se neprovádí při každém renderu.
 *
 * Používá se např. pro zobrazení relací jako type (EventTypeGQLModel),
 * facility (FacilityGQLModel), createdby (UserGQLModel) atd.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt jehož skalární atributy zobrazíme
 * @returns {JSX.Element}
 */
export const MediumCardScalars = ({ item }) => {
    const sureitem = item || {}
    const noArrays = useMemo(() => Object.fromEntries(
        Object.entries(sureitem).filter(([_, v]) => v && typeof v === "object" && !Array.isArray(v) && v.id != null)
    ), [item]);
    return (
        <CardCapsule item={sureitem}>
            {Object.keys(noArrays).map(
                (attribute_name) => <ScalarAttributeBind key={attribute_name} item={item} attribute_name={attribute_name} />
            )}
        </CardCapsule>
    )
}