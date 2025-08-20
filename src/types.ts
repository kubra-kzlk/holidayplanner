export interface ListCountries {
    countries: Country[];
}

export interface Country {
    code:     string;
    name:     string;
    holidays: Holiday[];
}

export interface Holiday {
    id:   number;
    year: number;
    date: Date;
    name: string;
    type: string;
}
export interface OutputHoliday extends Holiday {
    countryCode: string;
  countryName: string;
}
// Handig alias voor de API response van /api/holidays/[year]
export type HolidaysByYearResponse = OutputHoliday[];

export interface HolidayDetailPageProps extends ListCountries {
    year: number;
    holidays: OutputHoliday[];
}