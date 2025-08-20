 **Holiday Planner**

We werken met een dataset die bestaat uit **landen** en hun **feestdagen**.
De dataset is groter en genest, zodat de studenten meer moeten nadenken over filtering en dynamische routing.

**Dataset (voorbeeld):**

```json
{
  "countries": [
    {
      "code": "BE",
      "name": "Belgium",
      "holidays": [
        {
          "id": 1,
          "year": 2025,
          "date": "2025-01-01",
          "name": "Nieuwjaar",
          "type": "Public"
        },
        {
          "id": 2,
          "year": 2025,
          "date": "2025-05-01",
          "name": "Dag van de Arbeid",
          "type": "Public"
        }
      ]
    },
    {
      "code": "FR",
      "name": "France",
      "holidays": [
        {
          "id": 3,
          "year": 2025,
          "date": "2025-07-14",
          "name": "Fête nationale",
          "type": "Public"
        },
        {
          "id": 4,
          "year": 2025,
          "date": "2025-11-11",
          "name": "Armistice",
          "type": "Public"
        }
      ]
    },
    {
      "code": "US",
      "name": "United States",
      "holidays": [
        {
          "id": 5,
          "year": 2025,
          "date": "2025-07-04",
          "name": "Independence Day",
          "type": "Federal"
        },
        {
          "id": 6,
          "year": 2025,
          "date": "2025-11-27",
          "name": "Thanksgiving",
          "type": "Federal"
        }
      ]
    }
  ]
}
```

---

## API Routes

1. **GET /countries**
   Geef een lijst van alle landen (code en naam).

2. **GET /countries/\[code]**
   Geef de details van een land, inclusief alle feestdagen.

3. **GET /holidays/\[year]**
   Geef alle feestdagen van alle landen voor een bepaald jaar.

---

## Client Side Rendering

* **/countries**
  Toon een lijst met alle landen.
  Tijdens het laden: toon “Loading…”.
  Data moet komen van je eigen API route `/countries`.

---

## Static Site Generation

* **/holidays**
  Toon een lijst van alle feestdagen van alle landen (alleen naam + land).
  Voorzie een **zoekveld** zodat de gebruiker kan filteren op feestdagnaam (case-insensitive).
  Data rechtstreeks ophalen uit de JSON (niet via je eigen API).

* **/holidays/\[year]**
  Toon alle feestdagen voor een bepaald jaar.
  Gebruik dynamische SSG routes: `/holidays/2025`, `/holidays/2026`, …

* **/countries/\[code]**
  Toon detailpagina van een land, met de **naam, code en lijst van feestdagen**.
  Data rechtstreeks ophalen uit de JSON.

---

## Server Side Rendering

* **/** (homepagina)
  Toon alle landen. Onder elk land moet een lijst van feestdagen staan die in dat land voorkomen.
  Elke feestdag moet een **link** zijn naar de detailpagina van dat land.
  Data rechtstreeks ophalen via `fetch` (dus niet via je eigen API).

---

⚡️ Dit is moeilijker omdat:

* Er is een **geneste dataset** (landen → feestdagen).
* Studenten moeten werken met **meerdere dynamische routes** (`/holidays/[year]`, `/countries/[code]`).
* Filtering op **zoekvelden** komt terug.
* Zowel **API routes**, **CSR**, **SSG** als **SSR** worden gecombineerd, net als in je labo’s.

---

