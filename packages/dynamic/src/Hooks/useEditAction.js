import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAsyncThunkAction } from "./useAsyncThunkAction";

const shallowEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (a[k] !== b[k]) return false;
    return true;
};

/**
 * Vrátí true, pokud je výsledek z backendu GQL chybový stav (Error union type).
 * Typicky: EventGQLModelUpdateError, EventGQLModelInsertError apod.
 */
const isGQLError = (result) => {
    if (!result || typeof result !== "object") return false;
    const typename = result.__typename ?? "";
    return typename.endsWith("Error") || result.failed === true;
};

export const useEditAction = (
    AsyncAction,
    item,
    options = {}
) => {
    const {
        mode = "confirm",
        delayMs = 600,
        mapDraftToVars,
        commitOnBlur = true,
        onCommit = (nextDraft, result) => null,
    } = options;

    if (typeof AsyncAction !== "function") {
        throw new Error("useEditAction: AsyncAction musí být funkce (thunk factory)");
    }

    const { entity, run, loading, error, data } = useAsyncThunkAction(
        AsyncAction,
        item,
        { deferred: true, network: true }
    );

    const [baseline, setBaseline] = useState(item || {});
    const [draft, setDraft] = useState(item || {});

    useEffect(() => {
        const next = item || {};
        setBaseline(next);
        setDraft(next);
    }, [entity, item]);

    const dirty = useMemo(() => !shallowEqual(draft, baseline), [draft, baseline]);

    const toVars = useCallback(
        (d) => {
            if (typeof mapDraftToVars === "function") {
                return mapDraftToVars(d, { entity, item });
            }
            return d;
        },
        [mapDraftToVars, entity, item]
    );

    // Serializace commitů – fix pro concurrent update / lastchange race condition
    const inFlightPromiseRef = useRef(null);
    const queuedDraftRef = useRef(null);

    // Vždy nejaktuálnější lastchange – aktualizuje se jen po ÚSPĚŠNÉM commitu
    const latestLastchangeRef = useRef(item?.lastchange ?? null);

    // Synchronizuj lastchange ref při změně item zvenku (např. první načtení entity)
    useEffect(() => {
        if (item?.lastchange) {
            latestLastchangeRef.current = item.lastchange;
        }
    }, [item?.lastchange]);

    const commitNow = useCallback((nextDraft) => {
        // Pokud letí request, zapamatuj nový draft a vrať stávající promise
        if (inFlightPromiseRef.current) {
            queuedDraftRef.current = nextDraft;
            setDraft(nextDraft);
            return inFlightPromiseRef.current;
        }

        const executeCommit = async (rawDraft) => {
            const draftToSend = {
                ...rawDraft,
                lastchange: latestLastchangeRef.current ?? rawDraft?.lastchange,
            };

            console.log("useEditAction.commitNow send lastchange:", draftToSend?.lastchange);

            const result = await run(toVars(draftToSend));

            console.log("useEditAction.commitNow receive:", result?.__typename, "lastchange:", result?.lastchange);

            // Pokud backend vrátil chybový stav, NEAKTUALIZUJ lastchange ani draft
            if (isGQLError(result)) {
                console.warn("useEditAction.commitNow: backend vrátil chybu, lastchange se nemění", result);
                throw Object.assign(
                    new Error(`GQL mutation error: ${result?.msg ?? result?.__typename}`),
                    { gqlError: result }
                );
            }

            const savedDraft = {
                ...draftToSend,
                ...result,
                lastchange: result?.lastchange ?? draftToSend?.lastchange,
            };

            // Aktualizuj lastchange až po úspěšném commitu
            latestLastchangeRef.current = savedDraft.lastchange;

            onCommit(savedDraft, result);
            setBaseline(savedDraft);
            setDraft(savedDraft);

            return result;
        };

        const promise = (async () => {
            let result = await executeCommit(nextDraft);

            // Zpracuj drafty, které přišly v průběhu in-flight requestu
            while (queuedDraftRef.current) {
                const queuedDraft = queuedDraftRef.current;
                queuedDraftRef.current = null;

                const nextQueuedDraft = {
                    ...queuedDraft,
                    lastchange: latestLastchangeRef.current,
                };

                result = await executeCommit(nextQueuedDraft);
            }

            return result;
        })().finally(() => {
            inFlightPromiseRef.current = null;
        });

        inFlightPromiseRef.current = promise;
        return promise;
    }, [run, toVars, onCommit]);

    // Debouncing pro live mode
    const timerRef = useRef(null);
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => () => clearTimer(), [clearTimer]);

    const scheduleCommit = useCallback(
        (nextDraft) => {
            clearTimer();
            timerRef.current = setTimeout(() => {
                commitNow(nextDraft).catch(() => {});
            }, delayMs);
        },
        [commitNow, delayMs, clearTimer]
    );

    const onChange = useCallback(
        (e) => {
            const fieldId = e?.target?.id;
            const value = e?.target?.value;

            let nextDraft;
            if (fieldId) {
                nextDraft = { ...(draft || {}), [fieldId]: value };
            } else if (value && typeof value === "object") {
                nextDraft = value;
            } else {
                nextDraft = draft;
            }

            setDraft(nextDraft);

            if (mode === "live") {
                scheduleCommit(nextDraft);
            }
        },
        [draft, mode, scheduleCommit]
    );

    const onBlur = useCallback(async () => {
        if (mode !== "live" || !commitOnBlur) return null;
        clearTimer();
        if (!dirty) return null;
        return commitNow(draft);
    }, [mode, commitOnBlur, dirty, draft, commitNow, clearTimer]);

    const onCancel = useCallback(() => {
        clearTimer();
        setDraft(baseline || {});
    }, [baseline, clearTimer]);

    const onConfirm = useCallback(async () => {
        clearTimer();
        if (!dirty) return null;
        return commitNow(draft);
    }, [dirty, draft, commitNow, clearTimer]);

    return {
        entity,
        baseline,
        draft,
        setDraft,

        dirty,
        loading,
        error,
        data,

        onChange,
        onBlur,
        onCancel,
        onConfirm,

        run,
        commitNow,
    };
};
