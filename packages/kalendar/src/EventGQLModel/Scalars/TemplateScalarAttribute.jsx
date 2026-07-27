import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * TemplateScalarAttribute — zobrazí skalární atribut entity.
 *
 * Zkontroluje zda atribut scalar existuje na objektu template.
 * Pokud scalar není definován, komponenta vrátí null a nic nevykreslí.
 * Jinak zobrazí placeholder zprávu a JSON reprezentaci atributu scalar.
 *
 * Poznámka: Tato komponenta je šablona (_template) pro generování
 * skalárních atributů. Pro produkční použití nahraďte JSON výpis
 * komponentou ScalarMediumCard nebo ScalarLink.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - objekt reprezentující entitu
 * @param {*} [props.template.scalar] - skalární atribut entity k zobrazení
 * @returns {JSX.Element|null} JSX element zobrazující scalar atribut nebo null pokud atribut neexistuje
 *
 * @example
 * const entity = { scalar: { id: 1, name: "Ukázkový scalar" } };
 * <TemplateScalarAttribute template={entity} />
 */
export const TemplateScalarAttribute = ({template}) => {
    const {scalar} = template
    if (typeof scalar === 'undefined') return null
    return (
        <>
            {/* <ScalarMediumCard scalar={scalar} /> */}
            {/* <ScalarLink scalar={scalar} /> */}
            Probably {'<ScalarMediumCard scalar={scalar} />'} <br />
            <pre>{JSON.stringify(scalar, null, 4)}</pre>
        </>
    )
}

/**
 * TemplateScalarAttributeQuery — GraphQL query pro načtení scalar atributu entity.
 *
 * Načte jen id a __typename scalar atributu — minimální data
 * potřebná pro lazy loading. Plná data se načtou až po rozbalení.
 *
 * @type {string}
 */
const TemplateScalarAttributeQuery = `
query TemplateQueryRead($id: UUID!) {
    result: templateById(id: $id) {
        __typename
        id
        scalar {
            __typename
            id
        }
    }
}
`

/**
 * TemplateScalarAttributeAsyncAction — Redux thunk akce pro lazy načtení scalar atributu.
 * Sestavena z TemplateScalarAttributeQuery pomocí createAsyncGraphQLAction.
 */
const TemplateScalarAttributeAsyncAction = createAsyncGraphQLAction(
    TemplateScalarAttributeQuery
)

/**
 * TemplateScalarAttributeLazy — lazy-loading verze TemplateScalarAttribute.
 *
 * Asynchronně načte scalar atribut entity přes TemplateScalarAttributeAsyncAction.
 * Během načítání zobrazí LoadingSpinner, při chybě ErrorHandler.
 * Po načtení předá data do TemplateScalarAttribute pro vykreslení.
 *
 * Lazy loading znamená že data scalar atributu se načtou až když
 * je komponenta skutečně vykreslena — šetří zbytečné HTTP requesty.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - entita nebo query proměnné pro načtení entity
 * @param {string} props.template.id - UUID entity (povinné pro query)
 * @returns {JSX.Element} vykreslený scalar atribut nebo loading/error stav
 *
 * @example
 * // Základní použití
 * <TemplateScalarAttributeLazy template={{ id: "abc123" }} />
 */
export const TemplateScalarAttributeLazy = ({template}) => {
    const {loading, error, entity, fetch} = useAsyncAction(TemplateScalarAttributeAsyncAction, template)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <TemplateScalarAttribute template={entity} />    
}