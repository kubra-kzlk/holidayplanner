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

// ---------- Page ----------
export default function CountryDetailPage({ country }: PageProps) {
    return (
        <>
            <Head>
                <title>{country.name} ({country.code}) • Holiday Planner</title>
                <meta
                    name="description"
                    content={`Public holidays for ${country.name} (${country.code}).`}
                />
            </Head>

            <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
                <h1 style={{ marginBottom: "0.25rem" }}>{country.name}</h1>
                <p style={{ marginTop: 0, opacity: 0.8 }}>
                    Country code: <strong>{country.code}</strong>
                </p>

                <h2 style={{ marginTop: "2rem" }}>Holidays</h2>
                {country.holidays.length === 0 ? (
                    <p>No holidays found.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {country.holidays.map((h) => {
                            const d = new Date(h.date as unknown as string);
                            const dateLabel = isNaN(d.getTime())
                                ? String(h.date)
                                : d.toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                });
                            return (
                                <li
                                    key={h.id}
                                    style={{
                                        padding: "0.75rem 0",
                                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{h.name}</div>
                                    <div style={{ fontSize: "0.95rem" }}>
                                        {dateLabel} • {h.type} • {h.year}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </>
    );
}