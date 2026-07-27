import { DateTimeFilter, Filter as BaseFilter, StringFilter, UUIDFilter } from "../../../../_template/src/Base/FormControls/Filter"

/**
 * Filter — filtrační panel pro seznam událostí (PageVector).
 *
 * Zobrazuje sadu filtračních polí pro omezení výsledků v tabulce.
 * Po kliknutí na FilterButton se where objekt uloží do URL parametru gr_where
 * a PageVector automaticky přenačte data s novým filtrem.
 *
 * Dostupné filtry:
 *   id      — přesná shoda UUID (UUIDFilter, operátor _eq)
 *   name    — fulltext hledání v názvu (StringFilter, operátor _ilike)
 *   created — datum vytvoření od (DateTimeFilter, operátor _gte)
 *
 * Jak funguje filtrování:
 *   1. Uživatel vyplní pole a klikne "Filtrovat"
 *   2. FilterButton sestaví where objekt a uloží ho do URL parametru gr_where
 *   3. PageVector načte where z URL a předá ho ReadPageAsyncAction
 *   4. Server vrátí pouze záznamy splňující podmínky
 *
 * @component
 * @param {Object} props
 * @param {string} [props.id] - id filtru pro vnořené filtry
 * @param {Function} [props.onChange] - callback při změně hodnoty filtru
 * @param {React.ReactNode} [props.children] - volitelné další filtry
 * @returns {JSX.Element}
 */
export const Filter = ({ id, onChange: handleChange, children }) => {
    return (
        <BaseFilter id={id} onChange={handleChange}>
            <UUIDFilter id="id" />
            <StringFilter id="name" />
            <DateTimeFilter id="created" emitUtcIso={false} />
            {/* <FloatFilter id="count" /> */}
            {children}
        </BaseFilter>
    )
}