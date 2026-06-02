# Změny

## 1.6.2026

- updates pro CalendarView.jsx (zobrazení více eventů)
- grafické úpravy
- publikace verze 0.0.5
- publikace verze 0.0.6
- **Problémy/errory**: Problém s vytváření Sub-eventů:
```
{
    "errors": {
        "__typename": "EventGQLModelInsertError",
        "msg": "data not found in database table",
        "failed": true,
        "code": "a8c2c427-681b-4d46-8d9f-4b833f0c0051",
        "location": "eventInsert",
        "input": {
            "masterevent_id": "bf92fe1a-98aa-4324-af8a-eb6fdc2b5fd5",
            "name": "Test",
            "name_en": null,
            "description": null,
            "start_date": null,
            "end_date": null,
            "id": "c3779157-91e4-49d7-8e2d-0cf4aa0f35c3",
            "subevents": [],
            "rbacobject_id": null,
            "createdby_id": null
        }
    }
}
```

## 31.5.2026

- vytvoření CalendarView.jsx a CreateRootEventButton.jsx

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
