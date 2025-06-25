
import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Country {
  country_name: string;
  country_code: string;
}

interface CountrySelectorProps {
  value: Country | null;
  onSelect: (country: Country) => void;
}

const countries: Country[] = [
  { "country_name": "Andorra", "country_code": "ad" },
  { "country_name": "United Arab Emirates", "country_code": "ae" },
  { "country_name": "Albania", "country_code": "al" },
  { "country_name": "Armenia", "country_code": "am" },
  { "country_name": "American Samoa", "country_code": "as" },
  { "country_name": "Austria", "country_code": "at" },
  { "country_name": "Azerbaijan", "country_code": "az" },
  { "country_name": "Bosnia and Herzegovina", "country_code": "ba" },
  { "country_name": "Belgium", "country_code": "be" },
  { "country_name": "Burkina Faso", "country_code": "bf" },
  { "country_name": "Bulgaria", "country_code": "bg" },
  { "country_name": "Burundi", "country_code": "bi" },
  { "country_name": "Benin", "country_code": "bj" },
  { "country_name": "Bahamas", "country_code": "bs" },
  { "country_name": "Bhutan", "country_code": "bt" },
  { "country_name": "Belarus", "country_code": "by" },
  { "country_name": "Canada", "country_code": "ca" },
  { "country_name": "Democratic Republic of the Congo", "country_code": "cg" },
  { "country_name": "Central African Republic", "country_code": "cf" },
  { "country_name": "Republic of the Congo", "country_code": "cg" },
  { "country_name": "Switzerland", "country_code": "ch" },
  { "country_name": "Ivory Coast", "country_code": "ci" },
  { "country_name": "Chile", "country_code": "cl" },
  { "country_name": "Cameroon", "country_code": "cm" },
  { "country_name": "Angola", "country_code": "ao" },
  { "country_name": "Botswana", "country_code": "bw" },
  { "country_name": "Cook Islands", "country_code": "ck" },
  { "country_name": "Costa Rica", "country_code": "cr" },
  { "country_name": "Indonesia", "country_code": "id" },
  { "country_name": "Israel", "country_code": "il" },
  { "country_name": "India", "country_code": "in" },
  { "country_name": "Japan", "country_code": "jp" },
  { "country_name": "Kenya", "country_code": "ke" },
  { "country_name": "South Korea", "country_code": "kr" },
  { "country_name": "Lesotho", "country_code": "ls" },
  { "country_name": "Morocco", "country_code": "ma" },
  { "country_name": "Mozambique", "country_code": "mz" },
  { "country_name": "New Zealand", "country_code": "nz" },
  { "country_name": "Thailand", "country_code": "th" },
  { "country_name": "Tanzania", "country_code": "tz" },
  { "country_name": "Uganda", "country_code": "ug" },
  { "country_name": "United Kingdom", "country_code": "uk" },
  { "country_name": "Uzbekistan", "country_code": "uz" },
  { "country_name": "Venezuela", "country_code": "ve" },
  { "country_name": "United States Virgin Islands", "country_code": "vi" },
  { "country_name": "South Africa", "country_code": "za" },
  { "country_name": "Zambia", "country_code": "zm" },
  { "country_name": "Zimbabwe", "country_code": "zw" },
  { "country_name": "United States", "country_code": "us" },
  { "country_name": "Afghanistan", "country_code": "af" },
  { "country_name": "Antigua and Barbuda", "country_code": "ag" },
  { "country_name": "Anguilla", "country_code": "ai" },
  { "country_name": "Argentina", "country_code": "ar" },
  { "country_name": "Australia", "country_code": "au" },
  { "country_name": "Bangladesh", "country_code": "bd" },
  { "country_name": "Bahrain", "country_code": "bh" },
  { "country_name": "Brunei", "country_code": "bn" },
  { "country_name": "Bolivia", "country_code": "bo" },
  { "country_name": "Brazil", "country_code": "br" },
  { "country_name": "Belize", "country_code": "bz" },
  { "country_name": "Colombia", "country_code": "co" },
  { "country_name": "Cuba", "country_code": "cu" },
  { "country_name": "Cyprus", "country_code": "cy" },
  { "country_name": "Dominican Republic", "country_code": "do" },
  { "country_name": "Ecuador", "country_code": "ec" },
  { "country_name": "Egypt", "country_code": "eg" },
  { "country_name": "Ethiopia", "country_code": "et" },
  { "country_name": "Fiji", "country_code": "fj" },
  { "country_name": "Ghana", "country_code": "gh" },
  { "country_name": "Gibraltar", "country_code": "gi" },
  { "country_name": "Guatemala", "country_code": "gt" },
  { "country_name": "Hong Kong", "country_code": "hk" },
  { "country_name": "Jamaica", "country_code": "jm" },
  { "country_name": "Cambodia", "country_code": "kh" },
  { "country_name": "Kuwait", "country_code": "kw" },
  { "country_name": "Lebanon", "country_code": "lb" },
  { "country_name": "Libya", "country_code": "ly" },
  { "country_name": "Myanmar", "country_code": "mm" },
  { "country_name": "Malta", "country_code": "mt" },
  { "country_name": "Mexico", "country_code": "mx" },
  { "country_name": "Malaysia", "country_code": "my" },
  { "country_name": "Namibia", "country_code": "na" },
  { "country_name": "Nigeria", "country_code": "ng" },
  { "country_name": "Nicaragua", "country_code": "ni" },
  { "country_name": "Nepal", "country_code": "np" },
  { "country_name": "Oman", "country_code": "om" },
  { "country_name": "Panama", "country_code": "pa" },
  { "country_name": "Peru", "country_code": "pe" },
  { "country_name": "Papua New Guinea", "country_code": "pg" },
  { "country_name": "Philippines", "country_code": "ph" },
  { "country_name": "Pakistan", "country_code": "pk" },
  { "country_name": "Puerto Rico", "country_code": "pr" },
  { "country_name": "Paraguay", "country_code": "py" },
  { "country_name": "Qatar", "country_code": "qa" },
  { "country_name": "Saudi Arabia", "country_code": "sa" },
  { "country_name": "Solomon Islands", "country_code": "sb" },
  { "country_name": "Singapore", "country_code": "sg" },
  { "country_name": "Sierra Leone", "country_code": "sl" },
  { "country_name": "El Salvador", "country_code": "sv" },
  { "country_name": "Tajikistan", "country_code": "tj" },
  { "country_name": "Turkey", "country_code": "tr" },
  { "country_name": "Taiwan", "country_code": "tw" },
  { "country_name": "Ukraine", "country_code": "ua" },
  { "country_name": "Uruguay", "country_code": "uy" },
  { "country_name": "Saint Vincent and the Grenadines", "country_code": "vc" },
  { "country_name": "Vietnam", "country_code": "vn" },
  { "country_name": "Cape Verde", "country_code": "cv" },
  { "country_name": "Czech Republic", "country_code": "cz" },
  { "country_name": "Germany", "country_code": "de" },
  { "country_name": "Djibouti", "country_code": "dj" },
  { "country_name": "Denmark", "country_code": "dk" },
  { "country_name": "Dominica", "country_code": "dm" },
  { "country_name": "Algeria", "country_code": "dz" },
  { "country_name": "Estonia", "country_code": "ee" },
  { "country_name": "Spain", "country_code": "es" },
  { "country_name": "Finland", "country_code": "fi" },
  { "country_name": "Micronesia, Federated States of", "country_code": "fm" },
  { "country_name": "France", "country_code": "fr" },
  { "country_name": "Gabon", "country_code": "ga" },
  { "country_name": "Georgia", "country_code": "ge" },
  { "country_name": "Greenland", "country_code": "gl" },
  { "country_name": "Gambia", "country_code": "gm" },
  { "country_name": "Guadeloupe", "country_code": "gp" },
  { "country_name": "Greece", "country_code": "gr" },
  { "country_name": "Guyana", "country_code": "gy" },
  { "country_name": "Honduras", "country_code": "hn" },
  { "country_name": "Croatia", "country_code": "hr" },
  { "country_name": "Haiti", "country_code": "ht" },
  { "country_name": "Hungary", "country_code": "hu" },
  { "country_name": "Ireland", "country_code": "ie" },
  { "country_name": "Iraq", "country_code": "iq" },
  { "country_name": "Iceland", "country_code": "is" },
  { "country_name": "Italy", "country_code": "it" },
  { "country_name": "Jordan", "country_code": "jo" },
  { "country_name": "Kyrgyzstan", "country_code": "kg" },
  { "country_name": "Kiribati", "country_code": "ki" },
  { "country_name": "Kazakhstan", "country_code": "kz" },
  { "country_name": "Laos", "country_code": "la" },
  { "country_name": "Liechtenstein", "country_code": "li" },
  { "country_name": "Sri Lanka", "country_code": "lk" },
  { "country_name": "Lithuania", "country_code": "lt" },
  { "country_name": "Luxembourg", "country_code": "lu" },
  { "country_name": "Latvia", "country_code": "lv" },
  { "country_name": "Moldova", "country_code": "md" },
  { "country_name": "Madagascar", "country_code": "mg" },
  { "country_name": "Macedonia", "country_code": "mk" },
  { "country_name": "Mali", "country_code": "ml" },
  { "country_name": "Mongolia", "country_code": "mn" },
  { "country_name": "Montserrat", "country_code": "ms" },
  { "country_name": "Mauritius", "country_code": "mu" },
  { "country_name": "Maldives", "country_code": "mv" },
  { "country_name": "Malawi", "country_code": "mw" },
  { "country_name": "Niger", "country_code": "ne" },
  { "country_name": "Netherlands", "country_code": "nl" },
  { "country_name": "Norway", "country_code": "no" },
  { "country_name": "Nauru", "country_code": "nr" },
  { "country_name": "Niue", "country_code": "nu" },
  { "country_name": "Poland", "country_code": "pl" },
  { "country_name": "Palestine", "country_code": "ps" },
  { "country_name": "Portugal", "country_code": "pt" },
  { "country_name": "Romania", "country_code": "ro" },
  { "country_name": "Serbia", "country_code": "rs" },
  { "country_name": "Russia", "country_code": "ru" },
  { "country_name": "Rwanda", "country_code": "rw" },
  { "country_name": "Seychelles", "country_code": "sc" },
  { "country_name": "Sweden", "country_code": "se" },
  { "country_name": "Saint Helena, Ascension and Tristan da Cunha", "country_code": "sh" },
  { "country_name": "Slovenia", "country_code": "si" },
  { "country_name": "Slovakia", "country_code": "sk" },
  { "country_name": "San Marino", "country_code": "sm" },
  { "country_name": "Senegal", "country_code": "sn" },
  { "country_name": "Somalia", "country_code": "so" },
  { "country_name": "Suriname", "country_code": "sr" },
  { "country_name": "Chad", "country_code": "td" },
  { "country_name": "Togo", "country_code": "tg" },
  { "country_name": "Tokelau", "country_code": "tk" },
  { "country_name": "Timor-Leste", "country_code": "tl" },
  { "country_name": "Turkmenistan", "country_code": "tm" },
  { "country_name": "Tunisia", "country_code": "tn" },
  { "country_name": "Tonga", "country_code": "to" },
  { "country_name": "Trinidad and Tobago", "country_code": "tt" },
  { "country_name": "British Virgin Islands", "country_code": "vg" },
  { "country_name": "Vanuatu", "country_code": "vu" },
  { "country_name": "Samoa", "country_code": "ws" }
];

export const CountrySelector = ({ value, onSelect }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredCountries = countries
    .filter((country) =>
      country.country_name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .slice(0, 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? `${value.country_name} (${value.country_code.toUpperCase()})`
            : "Select country..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search country..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.country_code}
                  value={country.country_name}
                  onSelect={() => {
                    onSelect(country);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.country_code === country.country_code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.country_name} ({country.country_code.toUpperCase()})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
