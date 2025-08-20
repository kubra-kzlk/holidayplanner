import { ListCountries } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();
    const data: ListCountries = jsonData.countries;

    const countries = data.countries.map((c) => ({
        code: c.code,
        name: c.name,
    }));
    res.status(200).json(countries);
}