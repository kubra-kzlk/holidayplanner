// SSG detail per country (direct from JSON)
import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { ListCountries, Country, Holiday } from "@/types";

//Props voor deze pagina
interface PageProps {
    country: Country;
}

// ---------- SSG ----------
export const getStaticPaths: GetStaticPaths = async () => {
    
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();
    const data: ListCountries = await jsonData.json();

    const paths = data.countries.map((c) => ({
        params: { code: c.code },
    }));

    return {
        paths,
        fallback: false, // enkel landcodes die in de dataset voorkomen
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
    const codeParam = ctx.params?.code;
    const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

    if (!code) {
        return { notFound: true };
    }
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();

    const data: ListCountries = await jsonData.json();

    const found = data.countries.find(
        (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!found) {
        return { notFound: true };
    }

    // Converteer datum-string -> Date om aan jouw types te voldoen en sorteer op datum
    const holidays: Holiday[] = [...(found.holidays ?? [])]
        .map((h) => ({ ...h, date: new Date(h.date) as unknown as Date }))
        .sort(
            (a, b) =>
                new Date(a.date as unknown as string).getTime() -
                new Date(b.date as unknown as string).getTime()
        );

    const country: Country = {
        code: found.code,
        name: found.name,
        holidays,
    };

    return {
        props: { country }
    };
};