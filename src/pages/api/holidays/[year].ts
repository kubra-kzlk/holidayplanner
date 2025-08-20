import type { NextApiRequest, NextApiResponse } from "next";
import type { ListCountries, HolidaysByYearResponse } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
  const jsonData = await response.json();
  const data: ListCountries = jsonData.holidays;

  const { year } = req.query;
  const yearNum = Number(Array.isArray(year) ? year[0] : year);

  if (!year || Number.isNaN(yearNum) || !Number.isInteger(yearNum)) {
    return res.status(400).json({ error: "Invalid or missing year parameter" });
  }

  // Filter alle landen -> holidays van het gevraagde jaar -> vlakke lijst
  const flat: HolidaysByYearResponse = data.countries.flatMap((country) =>
    (country.holidays ?? [])
      .filter((h) => h.year === yearNum)
      .map((h) => ({
        ...h,
        // Let op: jouw Holiday.date is van type Date; we casten naar Date-object.
        date: new Date(h.date),
        countryCode: country.code,
        countryName: country.name,
      }))
  );

  // geef een lijst terug 
  return res.status(200).json(flat);
}