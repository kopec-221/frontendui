# Změny

## 12.5.2026

- úprava Queries, Mutations, Components pro projektový den
- zprovoznění edit/delete
- vyřešení problémů s permissions
- update README.md
- **Problémy/errory**: Nelze změnit "Místo konání", příliš pomalé zadávání změn vyhazuje Error 1, po zmáčknutí tlačítka "Aktulizovat" se ale změna uloží a error zmizí. Při "Create" po stisknutí tlačítka "OK" se nám vyhodí Error 2. -> vše bylo vyřešeno.


## 7.5.2026

- úprava Queries: DeleteAsyncAction.jsx, InsertAsyncAction.jsx, UpdateAsyncAction.jsx, Fragments.jsx
- úprava Mutations: Create.jsx, Delete.jsx, InteractiveMutations.jsx, Update.jsx
- úprava Components: MediumEditableContent.jsx
- **Problémy/errory**: chybějící role "Plánovací administrátor", problémy s permissions

## 28.4.2026

- publikace verze 0.0.3

## 12.4.2026

- úprava MediumContent
- příprava na projektový den 1
- zaručení propojení s EventGQLModel

## 9.4.2026

- vytvoření app_kalendar
- nastavení kalendar jako uri
- přidání package kalendar

## 3.4.2026

- script `createscalar.js`
- script `createvector.js`
- template `EmptyVectorsAttribute.jsx`



# Jak spustit konrétní app

```cmd
npm run dev -w @hrbolek/app_dynamic
```

# Jak sestavit konrétní app

```cmd
npm run build -w @hrbolek/app_dynamic
```
