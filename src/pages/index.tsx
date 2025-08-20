import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import type { ListCountries, Country, Holiday } from "@/types";

interface PageProps {
    countries: Country[];
}

/** SSR: data rechtstreeks ophalen via fetch. */
export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();
    const data: ListCountries = await jsonData.json();

    // Map naar jouw types (Holiday.date -> Date) en sorteer optioneel
    const countries: Country[] = data.countries
        .map((c) => {
            const holidays: Holiday[] = (c.holidays ?? [])
                .map((h) => ({
                    ...h,
                    date: new Date(h.date) as unknown as Date,
                }))
                .sort(
                    (a, b) =>
                        new Date(a.date as unknown as string).getTime() -
                        new Date(b.date as unknown as string).getTime()
                );

            return {
                code: c.code,
                name: c.name,
                holidays,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return {
        props: { countries },
    };
};


export default function HomePage({ countries }: PageProps) {
    return (
        <>
            <Head>
                <title>Holiday Planner • Countries & Holidays</title>
                <meta name="description" content="All countries with their holidays" />
            </Head>

            <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
                <h1>Countries & Holidays</h1>
                <p style={{ opacity: 0.8 }}>
                    Showing {countries.length} countr{countries.length === 1 ? "y" : "ies"}.
                </p>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                    {countries.map((country) => (
                        <section
                            key={country.code}
                            style={{
                                border: "1px solid rgba(0,0,0,0.1)",
                                borderRadius: 8,
                                padding: "1rem",
                            }}
                        >
                            <header style={{ marginBottom: "0.5rem" }}>
                                <h2 style={{ margin: 0 }}>
                                    {country.name} <small>({country.code})</small>
                                </h2>
                            </header>

                            {country.holidays.length === 0 ? (
                                <p style={{ margin: 0, opacity: 0.7 }}>No holidays listed.</p>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                                                    padding: "0.5rem 0",
                                                    borderTop: "1px solid rgba(0,0,0,0.06)",
                                                }}
                                            >
                                                {/* Elke feestdag is een link naar de detailpagina van het land */}
                                                <Link
                                                    href={`/countries/${country.code}`}
                                                    style={{ textDecoration: "none" }}
                                                    aria-label={`View details for ${country.name}`}
                                                >
                                                    <div style={{ fontWeight: 600 }}>{h.name}</div>
                                                    <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                                                        {dateLabel} • {h.type} • {h.year}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </main>
        </>
    );
}