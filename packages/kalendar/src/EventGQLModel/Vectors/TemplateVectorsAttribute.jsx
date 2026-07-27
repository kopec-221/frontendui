import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * followUpTemplateVectorItemInsert — přidá VectorGQLModel položku do pole vectors entity.
 *
 * Zkontroluje __typename vkládané položky a pokud je "VectorGQLModel",
 * přidá ji na konec pole vectors a odešle aktualizaci přes dispatch.
 *
 * @param {Object} template - aktuální objekt entity obsahující pole vectors
 * @param {Object} vectorItem - položka k vložení (musí mít __typename === "VectorGQLModel")
 * @param {Function} dispatch - Redux dispatch funkce pro odeslání update akce
 */
const followUpTemplateVectorItemInsert = (template, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = template;
        const newTemplateVectorItems = [...vectors, vectorItem];
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        dispatch(ItemActions.item_update(newTemplate));
    }
};

/**
 * followUpTemplateVectorItemUpdate — nahradí existující VectorGQLModel položku v poli vectors.
 *
 * Najde položku se stejným id a nahradí ji novou verzí.
 * Ostatní položky zůstanou nezměněny.
 *
 * @param {Object} template - aktuální objekt entity obsahující pole vectors
 * @param {Object} vectorItem - aktualizovaná položka (musí mít __typename === "VectorGQLModel" a id)
 * @param {Function} dispatch - Redux dispatch funkce pro odeslání update akce
 */
const followUpTemplateVectorItemUpdate = (template, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = template;
        const newTemplateVectorItems = vectors.map(item =>
            item.id === vectorItem.id ? vectorItem : item
        );
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        dispatch(ItemActions.item_update(newTemplate));
    }
};

/**
 * followUpTemplateVectorItemDelete — odstraní VectorGQLModel položku z pole vectors podle id.
 *
 * Vyfiltruje položku se shodným id z pole vectors a odešle aktualizaci.
 *
 * @param {Object} template - aktuální objekt entity obsahující pole vectors
 * @param {Object} vectorItem - položka ke smazání (musí mít __typename === "VectorGQLModel" a id)
 * @param {Function} dispatch - Redux dispatch funkce pro odeslání update akce
 */
const followUpTemplateVectorItemDelete = (template, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = template;
        const newTemplateVectorItems = vectors.filter(
            item => item.id !== vectorItem.id
        );
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        dispatch(ItemActions.item_update(newTemplate));
    }
};

/**
 * TemplateVectorsAttributeQuery — GraphQL query pro načtení vectors atributu entity.
 *
 * Načte stránkovaný seznam vectors s volitelným where filtrem.
 * Výsledek se zpracuje přes processVectorAttributeFromGraphQLResult("vectors").
 *
 * @type {string}
 */
const TemplateVectorsAttributeQuery = `
query TemplateQueryRead($id: UUID!, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: templateById(id: $id) {
        __typename
        id
        vectors(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...VectorMedium
        }
    }
}
`

/**
 * TemplateVectorsAttributeAsyncAction — async akce pro načtení vectors atributu.
 * Zpracuje výsledek přes processVectorAttributeFromGraphQLResult který
 * extrahuje pole vectors a uloží položky do Redux store.
 */
const TemplateVectorsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(TemplateVectorsAttributeQuery,
        //VectorMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("vectors")
)

/**
 * TrivialVisualiserDiv — základní vizualizér pro jednu vector položku.
 *
 * Zobrazí placeholder zprávu a JSON reprezentaci položky.
 * Slouží jako výchozí Visualiser dokud není implementována
 * skutečná VectorMediumCard komponenta.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.vector - vector položka k zobrazení
 * @param {React.ReactNode} [props.children] - volitelný obsah
 * @returns {JSX.Element}
 */
const TrivialVisualiserDiv = ({vector, children}) => <div>
    Probably {'<VectorMediumCard vector={vector} />'} <br />
    <pre>{JSON.stringify(vector, null, 4)}</pre>
    {children}
</div>

/**
 * TemplateVectorsAttribute_old — starší verze komponenty pro zobrazení vectors atributu.
 *
 * Zkontroluje zda vectors atribut existuje na objektu template.
 * Pokud vectors není definován nebo je prázdný po filtraci, vrátí null.
 * Jinak mapuje přes (volitelně filtrované) pole vectors a renderuje
 * každou položku přes Visualiser komponentu.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - objekt entity obsahující pole vectors
 * @param {Array<Object>} [props.template.vectors] - pole vector položek
 * @param {Function} [props.filter=Boolean] - funkce pro filtrování vectors před renderováním
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - komponenta pro vizualizaci
 * @returns {JSX.Element|null} seznam vectors nebo null pokud atribut neexistuje nebo je prázdný
 *
 * @example
 * <TemplateVectorsAttribute_old
 *   template={{ vectors: [{ id: 1 }, { id: 2 }] }}
 *   filter={v => v.active}
 * />
 */
export const TemplateVectorsAttribute_old = ({template, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { vectors: unfiltered } = template
    if (typeof unfiltered === 'undefined') return null
    const vectors = unfiltered.filter(filter)
    if (vectors.length === 0) return null
    return (
        <>
            {vectors.map(
                vector => <Visualiser id={vector.id} key={vector.id} vector={vector} />
            )}
        </>
    )
}

/**
 * VectorsVisualiser — wrapper komponent pro zobrazení pole vectors přes TemplateVectorsAttribute_old.
 *
 * Přijme items jako pole vectors a předá je jako syntetický template objekt
 * do TemplateVectorsAttribute_old. Všechny ostatní props jsou přeposílány.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.items - pole vector položek k vizualizaci
 * @returns {JSX.Element|null} seznam vectors nebo null
 *
 * @example
 * <VectorsVisualiser items={[{ id: 1 }, { id: 2 }]} filter={v => v.active} />
 */
const VectorsVisualiser = ({ items, ...props }) => 
    <TemplateVectorsAttribute_old {...props} template={{ vectors: items }} />

/**
 * TemplateVectorsAttributeInfinite — infinite scroll verze pro vectors atribut.
 *
 * Používá generický InfiniteScroll komponent pro postupné načítání,
 * slučování a zobrazování pole vectors spojené s entitou template.
 * VectorsVisualiser zajišťuje renderování položek.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - objekt entity obsahující pole vectors
 * @param {Array<Object>} [props.template.vectors] - předem načtené položky
 * @param {Object} [props.actionParams={}] - volitelné extra parametry pro fetch akci
 * @returns {JSX.Element} infinite scroll seznam vectors
 *
 * @example
 * <TemplateVectorsAttributeInfinite template={{ id: "abc123", vectors: [] }} />
 */
export const TemplateVectorsAttributeInfinite = ({template, actionParams={}, ...props}) => { 
    const {vectors} = template

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={VectorsVisualiser} 
            preloadedItems={vectors}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={TemplateVectorsAttributeAsyncAction}
        />
    )
}

/**
 * TemplateVectorsAttributeLazy — lazy-loading verze pro zobrazení vectors atributu.
 *
 * Asynchronně načte vectors data přes TemplateVectorsAttributeAsyncAction.
 * Během načítání zobrazí LoadingSpinner, při chybě ErrorHandler.
 * Volitelná filter funkce odstraní nepotřebné položky před renderováním.
 *
 * useEffect zajistí opětovné načtení při změně template objektu.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - entita nebo query proměnné pro načtení
 * @param {string} props.template.id - UUID entity (povinné pro query)
 * @param {Function} [props.filter=Boolean] - funkce pro filtrování vectors
 * @returns {JSX.Element} seznam vectors nebo loading/error stav
 *
 * @example
 * <TemplateVectorsAttributeLazy template={{ id: "abc123" }} />
 * <TemplateVectorsAttributeLazy template={{ id: "abc123" }} filter={v => v.active} />
 */
export const TemplateVectorsAttributeLazy = ({template, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(TemplateVectorsAttributeAsyncAction, template, {deferred: true})
    useEffect(() => {
        fetch(template)
    }, [template])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <TemplateVectorsAttribute_old template={entity} filter={filter} {...props}/>    
}

/**
 * TemplateVectorsAttribute — hlavní komponenta pro zobrazení vectors atributu entity.
 *
 * Aplikuje volitelnou filter funkci na pole vectors před renderováním.
 * Podporuje dva režimy zobrazení:
 *   infinite=true  — InfiniteScroll pro postupné načítání dalších položek
 *   infinite=false — statický seznam všech (filtrovaných) položek najednou
 *
 * Prop Layout slouží jako wrapper komponenta pro každou renderovanou položku
 * a je konzistentně použit v obou režimech.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.template - objekt entity obsahující pole vectors
 * @param {Array<Object>} [props.template.vectors] - pole vector položek k renderování
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv]
 *   Komponenta pro renderování každé vector položky. Přijímá prop vector.
 * @param {boolean} [props.infinite=true] - zda použít infinite scroll
 * @param {React.ComponentType|string} [props.Layout=Col]
 *   Wrapper komponenta pro každou položku. Použita konzistentně v obou režimech.
 * @param {Function} [props.filter=Boolean] - filter funkce aplikovaná na vectors před renderováním
 * @returns {JSX.Element|null} seznam nebo infinite scroll, nebo null pokud nejsou vectors
 *
 * @example
 * <TemplateVectorsAttribute
 *   template={template}
 *   Visualiser={VectorMediumCard}
 *   Layout={Col}
 *   filter={v => v.active}
 *   infinite={true}
 * />
 */
export const TemplateVectorsAttribute = ({
    template,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col,
    filter = Boolean,
    ...props
}) => {

    const { vectors: unfiltered } = template
    if (typeof unfiltered === 'undefined') return null
    const vectors = unfiltered.filter(filter)
    if (vectors.length === 0) return null

    if (infinite) {
        /**
         * VisualiserWrapper — interní wrapper který předá Visualiser komponentě
         * items pole správně přes TemplateVectorsAttribute rekurzivně.
         */
        const VisualiserWrapper = ({ items }) => ( 
            <TemplateVectorsAttribute 
                {...props}    
                template={{vectors: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...template, skip: 0, limit: 10 }}
                asyncAction={TemplateVectorsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={vectors}
            />
        );
    }

    return (
        <>
        {vectors.map((vector) => (
            <Layout key={vector.id}>
                {vector && <Visualiser {...props} vector={vector} />}
            </Layout>
        ))}
        </>
    );
};