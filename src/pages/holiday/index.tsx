// SSG list (direct from JSON) + search by holiday nameimport Head from "next/head";
import type { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import type { ListCountries, OutputHoliday, HolidaysByYearResponse } from "@/types";

export interface PageProps {
  holidays: OutputHoliday[]; // platte lijst: alle landen, alle feestdagen
}

// -------- helpers --------
function flattenAllHolidays(data: ListCountries): HolidaysByYearResponse {
  return data.countries
    .flatMap((country) =>
      (country.holidays ?? []).map<OutputHoliday>((h) => ({
        ...h,
        // dataset levert 'date' als string; types vereisen Date
        date: new Date(h.date) as unknown as Date,
        countryCode: country.code,
        countryName: country.name,
      }))
    )
    // optioneel sorteren: eerst alfabetisch op feestdagnaam, dan op land
    .sort((a, b) => {
      const byName = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      if (byName !== 0) return byName;
      return a.countryName.localeCompare(b.countryName, undefined, { sensitivity: "base" });
    });
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
  const jsonData: ListCountries = await response.json();
  const holidays = flattenAllHolidays(jsonData);

  return {
    props: { holidays },
  };
};

export default function HolidayListPage({ holidays }: PageProps) {
  const [query, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return holidays;
    return holidays.filter((h) => h.name.toLowerCase().includes(q));
  }, [holidays, query]);

  return (
    <main  >
      <h1>All Holidays </h1>
      < input
        type="text"
        placeholder="Search Holiday"
        value={query}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul >
        {filtered.map((h) => (
          <li
            key={`${h.countryCode}-${h.id}`}

          >
            {/* Alleen naam + land tonen */}
            <div >{h.name}</div>
            <div>
              {h.countryName} ({h.countryCode})
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


