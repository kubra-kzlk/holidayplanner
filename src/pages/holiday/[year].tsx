// SSR home: list all countries with their holidays (links)
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type {
    ListCountries,
    HolidaysByYearResponse,
    OutputHoliday,
    HolidayDetailPageProps,
} from "@/types";

// -------- SSG --------
export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();

    const data: ListCountries = await jsonData.json();

    const years = new Set<number>();
    for (const c of data.countries) {
        for (const h of c.holidays) {
            if (Number.isInteger(h.year)) years.add(h.year);
        }
    }

    const paths = Array.from(years).map((y) => ({
        params: { year: String(y) },
    }));

    return {
        paths,
        fallback: false, // alleen jaren die in de dataset zitten
    };
};

function flattenHolidaysByYear(data: ListCountries, year: number): HolidaysByYearResponse {
    return data.countries
        .flatMap((country) =>
            (country.holidays ?? [])
                .filter((h) => h.year === year)
                .map<OutputHoliday>((h) => ({
                    ...h,
                    // dataset levert date als string; we casten naar Date voor je types
                    date: new Date(h.date) as unknown as Date,
                    countryCode: country.code,
                    countryName: country.name,
                }))
        )
        .sort((a, b) => new Date(a.date as unknown as string).getTime() - new Date(b.date as unknown as string).getTime());
}
export const getStaticProps: GetStaticProps<HolidayDetailPageProps> = async (ctx) => {
    const yearParam = ctx.params?.year;
    const yearNum = Number(Array.isArray(yearParam) ? yearParam[0] : yearParam);
    const response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/holidayplanner/main/dataset.json');
    const jsonData = await response.json();
    const data: ListCountries = await jsonData.json();
    const holidays = flattenHolidaysByYear(data, yearNum);

    return {
        props: {
            year: yearNum,
            holidays,
            countries: data.countries, // zit in HolidayDetailPageProps via ListCountries
        },
    };
};



interface PageProps {
    year: number;
    holidays: OutputHoliday[];
    countries: ListCountries["countries"];
}
export default function HolidaysByYearPage(props: PageProps) {
    const { year, holidays } = props;

    return (
        <>
            <Head>
                <title>Holidays {year} • Holiday Planner</title>
                <meta name="description" content={`All holidays for ${year} across all countries`} />
            </Head>

            <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
                <h1>Holidays in {year}</h1>
                <p style={{ opacity: 0.8 }}>
                    Found <strong>{holidays.length}</strong> holiday{holidays.length === 1 ? "" : "s"}.
                </p>

                {holidays.length === 0 ? (
                    <p>No holidays found for {year}.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                        {holidays.map((h) => {
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
                                    key={`${h.countryCode}-${h.id}`}
                                    style={{
                                        padding: "0.75rem 0",
                                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{h.name}</div>
                                    <div style={{ fontSize: "0.95rem" }}>
                                        {h.countryName} ({h.countryCode}) • {dateLabel} • {h.type}
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

