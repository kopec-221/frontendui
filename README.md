# Kalendář — deníček vývoje

> Školní projekt: React + Redux + Apollo GraphQL kalendářová aplikace pro správu událostí.
>
> **Autoři: Matyáš Kopeček, Vladan Kořenek**   
> **Balíček:** `@kopec211/pck_kalendar`, `@kopec211/app_kalendar`  
> **Stack:** React 19, Redux, Apollo Federation, Bootstrap 5, React Router v7

---

## Časová posloupnost vývoje

### ✅ JSDoc — kompletní dokumentace
**Commit:** `f286c804` + `54b2e7a7` | **Datum:** 27. 7. 2026

Přidány JSDoc komentáře (`@component`, `@param`, `@returns`) ke všem exportovaným komponentám a funkcím. Nastaveno generování HTML dokumentace přes `npm run docs`.

**Pokryté soubory:** Components, Mutations, Pages, Queries, Scalars, Vectors, apps/app_kalendar/src

**Chyby při nastavování:**
```
Error: ENOENT: no such file or directory, open 'README.md'
```
→ `jsdoc.json` odkazoval na `README.md` který neexistoval. Odstraněno pole `"readme"` z konfigurace.

```
ERROR: Unable to find the source file or directory apps/packages/kalendar/src
```
→ Špatná relativní cesta z `apps/app_kalendar/` — opraveno z `../packages/kalendar/src` na `../../packages/kalendar/src`.

```
ERROR: Unable to parse a tag's type expression in uriroot.js
Invalid type expression "() => string"
```
→ `uriroot.js` obsahuje TypeScript-style type expressions které JSDoc neumí parsovat. Přidán `"excludePattern": "uriroot\\.js$"` do konfigurace.

```
npm error Missing script: "docs"
```
→ Chyběl script v `package.json`. Přidáno `"docs": "jsdoc -c jsdoc.json --verbose"` a `"jsdoc": "^4.0.0"` do devDependencies.

---

### ✅ Úpravy podle instrukcí z PD3
**Commit:** `64fbb596` | **Datum:** 13. 6. 2026

Implementace zpětné vazby z třetího projektového dne — SubeventsVector přepsán, LargeCard readonly, Filter s českými popisky.

**Chyby:**
```
Failed to resolve import "./CalendarView" from "Vectors/SubeventsVector.jsx"
```
→ `CalendarView` je v `Components/` ale `SubeventsVector` je ve `Vectors/`. Opraveno na `"../Components/CalendarView"`.

```
Nemáte dostatečná oprávnění
```
→ `UpdateButton` a `DeleteButton` byly importovány z `_template` kde mají roli `superadmin`. Přepsáno na import z vlastní `Mutations/` složky s rolí `plánovací administrátor`.

---

### ✅ verze 006
**Commit:** `073005da` | **Datum:** 1. 6. 2026

Propojení se sdílenou databází. Zjištěna správná hierarchie eventů.

**Chyby:**
```json
{ "msg": "data not found in database table", "masterevent_id": "74b5b32e..." }
{ "msg": "data not found in database table", "masterevent_id": "6cd9dd6d..." }
{ "msg": "data not found in database table", "masterevent_id": "bfe0b366..." }
```
→ Frontend posílal pokaždé jiné `mastereventId` z Redux store místo správného UUID z URL. Přidán `useParams()` fix — ID se bere přímo z URL.

Ověřené funkční UUID:
- `3e52a301-caad-46ba-8fe6-1a7e2f370866` — "2023/24 LS" ✅
- `a64871f8-2308-48ff-adb2-33fb0b0741f1` — "2023/24" ✅

---

### ✅ verze 005
**Commit:** `2bd6576c` | **Datum:** 1. 6. 2026

`SubeventsVector` — tabulka + kalendář vždy viditelné. `PageCalendar` odstraněna z routeru. Dropdown "Události" odstraněn z `AppNavbar`.

**Chyby:**
```
eventById vrátí { name: null, mastereventId: null }
```
→ Event vytvořený přes `eventCreatePlan` má prázdná data. Zjištěno že `eventCreatePlan` ignoruje pole `name` a ukládá do jiné DB tabulky — backend bug.

---

### ✅ Grafické úpravy pro PD3
**Commit:** `d9eb47ec` | **Datum:** 1. 6. 2026

Refaktoring `CalendarView` — nahrazení inline stylů Bootstrap třídami dle požadavku učitele (žádné CSS bez konzultace).

**Problém:**
→ Bootstrap nemá 7-sloupcový grid ani jednostranný border-radius. Zachovány inline styly pouze pro `gridTemplateColumns: "repeat(7, 1fr)"`, `borderRadius` u multi-day eventů a `overflow: hidden`.

---

### ✅ place delete
**Commit:** `a77691d9` | **Datum:** 1. 6. 2026

Odstraněno pole `place` z editačního formuláře.

**Chyba (ověřeno v GraphiQL):**
```
Field 'place' is not defined by type 'EventUpdateGQLModel'
```
→ Backend `EventUpdateGQLModel` pole `place` nepodporuje. Odstraněno z mutace i formuláře, zobrazuje se pouze jako readonly.

---

### ✅ Další updates
**Commit:** `78eb747e` | **Datum:** 1. 6. 2026

Přidán panel NÁSTROJE (`InteractiveMutations`), detail stránka přepnuta do readonly.

**Chyby:**
```
Unparsable error: "data not found in database table"
code: "a8c2c427-681b-4d46-8d9f-4b833f0c0051"
masterevent_id: "11ea3ac4..."
```
→ Eventy vytvořené přes `eventCreatePlan` nelze použít jako rodiče pro `eventInsert` — jsou v jiné DB tabulce.

---

### ✅ Přidání kalendáře, root event — ready na PD3
**Commit:** `d694a150` | **Datum:** 31. 5. 2026

Přidána `CalendarView` komponenta. Implementace barevného odlišení eventů podle hash z UUID.

**Chyby:**
```json
{ "msg": "data not found in database table", "code": "a8c2c427..." }
```
→ Eventy z `eventCreatePlan` nelze použít jako `mastereventId`. Hardcoded fallback:
```js
const ROOT_MASTEREVENT_ID = "3e52a301-caad-46ba-8fe6-1a7e2f370866"
```

**Ověřeno v GraphiQL:**
```graphql
mutation { eventInsert(event: { mastereventId: "3e52a301...", name: "Test" }) { ... } }
# → úspěch ✅
```

---

### ✅ Vše funkční krome create + useEditAction změna
**Commit:** `ebfdc06e` | **Datum:** 30. 5. 2026

Refaktoring na `LiveEdit` s ukládáním při `onBlur`.

**Chyby:**
```
TypeError: Expected value of type 'EventInvitationGQLModel' but got: <generator>
```
→ Backend mikroslužba "office" vrací Python `<generator>` místo pole pro `invitations`. Odstraněno z `LargeFragment` — nelze opravit na frontendu.

```
Field 'place' is not defined by type 'EventUpdateGQLModel'
```
→ Backend nepodporuje update pole `place`. Zjištěno a zdokumentováno.

---

### ✅ Bump version 0.0.3 → 0.0.4
**Commit:** `3520064e` | **Datum:** 13. 5. 2026

Aktualizace verze po funkčním CRUD cyklu. Publikace na npm.

**Chyba:**
```
npm cache stale — stará verze se zobrazuje i po publish
```
→ Nutné smazat `node_modules` a `package-lock.json` a spustit `npm install` znovu.

---

### ✅ create\_delete — CRUD operace
**Commit:** `3babcbaa` | **Datum:** 12. 5. 2026

Implementace `CreateButton`, `DeleteButton` a potvrzovacího dialogu.

**Chyby:**
```json
{ "__typename": "EventGQLModelInsertError", "msg": "data not found in database table",
  "code": "a8c2c427-681b-4d46-8d9f-4b833f0c0051" }
```
→ Backend bug — `eventInsert` vrací chybu ale data se přesto někdy vytvoří. Nelze opravit.

→ `DeleteButton` musí kontrolovat sub-události — `SafeDeleteAsyncAction` zabrání smazání pokud `item.subevents.length > 0`.

---

### ⚠️ upravaUpdateAsyncAction — nefunkční
**Commit:** `7a9dd940` | **Datum:** 12. 5. 2026

Pokus o opravu update mutace.

**Chyba:**
```
startDate vs startdate — camelCase nesoulad
eventInsert očekává: $startDate (camelCase D)
eventUpdate očekává: $startdate (lowercase)
```
→ Přidán `attributeTransformer` v `Update.jsx`:
```js
const keyMap = { startDate: "startdate", endDate: "enddate" }
```
Stále nefunkční v této verzi — opraveno v dalším commitu.

---

### ⚠️ p2\_editace — error verze
**Commit:** `eb21af9e` | **Datum:** 7. 5. 2026

Implementace editace událostí — tato verze obsahuje chyby.

**Chyba:**
```
datetime-local input posílá "2024-09-08T15:27" 
GraphQL očekává "2024-09-08T15:27:14.364590"
→ data se neukládají správně
```
→ Přidána funkce `formatForDateTimeLocal()` pro konverzi formátů:
```js
const offset = date.getTimezoneOffset() * 60000
return (new Date(date - offset)).toISOString().slice(0, 16)
```

---

### ✅ ver3 — První dist build
**Commit:** `e036e867` | **Datum:** 28. 4. 2026

Zprovoznění Vite buildu a dist složky. První publikace na npm.

---

### ✅ ver2 — Základ projektu
**Commit:** `0c34cc24` | **Datum:** 28. 4. 2026

Vytvoření základní struktury z šablony `_template`. Nastavení monorepa, první verze `EventGQLModel` se složkami Components, Mutations, Pages, Queries, Scalars, Vectors.

---

### ✅ json\_u + pjason — Konfigurace
**Commit:** `9c433d2e`, `f32606c2`, `73ff6137` | **Datum:** 28. 4. 2026

Úpravy konfiguračních JSON souborů, merge větví.

**Chyba:**
```
Could not find package.json — ENOENT
```
→ Terminál byl ve špatné složce. Nutno být v kořeni monorepa.

---

### ✅ zmena\_pd1 — První projektový den
**Commit:** `fe3366a1` | **Datum:** 12. 4. 2026

Změny po prvním projektovém dni, úpravy struktury projektu.

---

### ✅ kalendar — Přidání kalendářového modulu
**Commit:** `45ab3cdf` | **Datum:** 9. 4. 2026

Přidán balíček `packages/kalendar` do monorepa. Základní struktura `EventGQLModel`.

**Problémy k řešení:**
- Jak správně strukturovat EventGQLModel dle požadavků učitele (Components/Mutations/Pages/Queries/Scalars/Vectors)?
- Jak propojit GraphQL Apollo Federation s Redux store?

---

### ✅ index + npm install
**Commit:** `56c8598c`, `a66bd37f` | **Datum:** 30. 3. 2026

Nastavení vstupního bodu aplikace. Instalace závislostí.

---

### ✅ Počáteční nastavení — změna, zmena2, zmena nazvu
**Commit:** `18271b58`, `2f149e8d`, `51e56852` | **Datum:** 30. 3. 2026

Inicializace projektu — první commity, přejmenování souborů, základní nastavení monorepa.

---

## Přehled hlavních problémů a řešení

| Problém | Status | Řešení |
|---|---|---|
| `eventInsert` vrací chybu `a8c2c427` | ✅ Workaround | Data se vytvoří i přes chybu |
| `eventCreatePlan` ignoruje `name` a ukládá do jiné tabulky | ❌ Backend bug | Nepoužíváme `eventCreatePlan` |
| `place` chybí v `EventUpdateGQLModel` | ❌ Backend bug | Zobrazujeme readonly |
| `invitations` vrací Python generator | ✅ Opraveno | Odstraněno z `LargeFragment` |
| Sub-události nelze tvořit pod `eventCreatePlan` eventy | ✅ Workaround | `ROOT_MASTEREVENT_ID` hardcoded |
| `startDate` vs `startdate` camelCase nesoulad | ✅ Opraveno | `attributeTransformer` v Update.jsx |
| Špatné `mastereventId` z Redux store | ✅ Opraveno | `useParams()` bere ID z URL |
| Inline styly — porušení pravidel učitele | ✅ Opraveno | Přepsáno na Bootstrap třídy |
| `uriroot.js` TypeScript type expressions v JSDoc | ✅ Opraveno | `excludePattern` v jsdoc.json |

---

## Použité technologie

| Technologie | Verze | Účel |
|---|---|---|
| React | 19.2.1 | UI framework |
| Redux / RTK | 2.x | State management |
| Apollo Federation | 4.x | GraphQL klient |
| Bootstrap | 5.3.3 | Styling |
| React Router | 7.x | Routing |
| Vite | 6.x | Build tool |
| JSDoc | 4.x | Generování dokumentace |
