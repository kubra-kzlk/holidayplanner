// CSR page: fetches /api/countries, shows Loading…
import { useEffect, useState } from 'react';                                                                                                                                                                                               
import { Country } from '@/types'

export default function CountriesPage() {
  // Set up state for regions
  const [countries, setCountries] = useState<Country[] | null>(null);

  // Load data from our own API when the page loads
  useEffect( () =>{
    fetch('/api/countries/index') // Fetch from our own API endpoint
      .then( res => res.json()) // Parse the JSON response
      .then(data =>{setCountries(data);// Set the regions state with the fetched data
      }) 
  }, []);

  // While loading
  if (countries === null) {
    return <p>Loading...</p>;
  }

  // When loaded successfully
  return (
    <div>
      <h1>COUNTRIES</h1>
      <ul>
        {countries.map(country =>( 
            <li key={country.code} >
              <p>{country.name}</p>
              <p>{country.code}</p>
            </li>
         ))}
      </ul>
    </div>
  );
}
