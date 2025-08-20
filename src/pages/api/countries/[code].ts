import { Country, Holiday, ListCountries } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
        const jsonData: ListCountries = await response.json();
        const codeParam = req.query.code;
        const countryCode = Array.isArray(codeParam) ? codeParam[0] : codeParam;
        if (!countryCode) {
            return res.status(400).json({ error: "Country code is required" });
        }
        const found = jsonData.countries.find(
            (c) => c.code.toLowerCase() === countryCode.toLowerCase()
        );
        // Guard voor found -> voorkomt access op mogelijk undefined
        if (!found) {
            return res.status(404).json({ error: `Country with code '${countryCode}' not found` });
        }

        // Converteer datum-string → Date om aan je types te voldoen (wordt als ISO-string geserialiseerd)
        const holidays: Holiday[] = (found.holidays ?? []).map((h) => ({
            ...h,
            date: new Date(h.date) as unknown as Date,
        }));

        const result: Country = { code: found.code, name: found.name, holidays }
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Failed to fetch countries' });
    }
}
