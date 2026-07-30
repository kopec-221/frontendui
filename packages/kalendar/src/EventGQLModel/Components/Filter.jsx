import { DateTimeFilter, Filter as BaseFilter, StringFilter, UUIDFilter } from "../../../../_template/src/Base/FormControls/Filter"

export const Filter = ({ id, onChange: handleChange, children }) => {
    return (
        <BaseFilter id={id} onChange={handleChange} label="Filtr">
            <UUIDFilter id="id" />
            <StringFilter id="name" />
            {/* Zde vracíme podtržítka přesně podle požadavků GraphQL filtru */}
            <DateTimeFilter id="start_date" label="Začátek od" initialOp="_ge" />
            <DateTimeFilter id="end_date" label="Konec do" initialOp="_le" />
            {children}
        </BaseFilter>
    )
}