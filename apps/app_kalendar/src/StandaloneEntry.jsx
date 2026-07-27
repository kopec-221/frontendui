// import React from "react"
import { createRoot } from "react-dom/client";
import { App } from "./App";

/**
 * mount — připojí React aplikaci do zadaného DOM elementu.
 *
 * Alternativní vstupní bod pro embedding aplikace do existující stránky
 * jako web component nebo micro-frontend. Na rozdíl od main.jsx
 * (který renderuje přímo do #root_), tato funkce přijme libovolný element.
 *
 * Používá se při IIFE buildu kdy je celá aplikace zabalena do jednoho JS souboru
 * a hostitelská stránka ji zavolá přes window.MyApp.mount(element, props).
 *
 * @param {HTMLElement} el - DOM element do kterého se aplikace připojí
 * @param {Object} [props={}] - props předané do App komponenty
 * @param {string} [props.GQLENDPOINT] - URL GraphQL endpointu (přepíše výchozí /api/gql)
 * @throws {Error} pokud el není definován
 *
 * @example
 * // Použití na hostitelské stránce
 * const container = document.getElementById('my-app-container')
 * window.MyApp.mount(container, { GQLENDPOINT: '/api/gql' })
 */
export function mount(el, props = {}) {
    if (!el) throw new Error("MyApp.mount: missing mount element");
    console.log("inside mount, doing to render")
    createRoot(el).render(<App {...props} />);
    console.log("inside mount, render finished")
}

/**
 * Registrace mount funkce na globální window objekt pro IIFE build.
 *
 * Podmínka typeof window !== "undefined" zajistí že kód funguje
 * i v SSR prostředí (Node.js) kde window neexistuje.
 *
 * Po načtení IIFE skriptu je funkce dostupná jako:
 *   window.MyApp.mount(element, props)
 */
if (typeof window !== "undefined") {
    window.MyApp = { mount };
}