// const accesskey = "GYmHFtBuw3IQIabtIy3GxB7VicCdRuYskHi_4XrGiKU"

let countries = ["Ghana", "Sout Africa", "Togo", "Nigeria", "United States"]
const country = document.querySelectorAll("p")


for (let j = 0; j < countries.length; j++) {
    const finalcountries = countries[j];
let countriesrandom = finalcountries[Math.floor(Math.random() * finalcountries.length)];

    console.log(countriesrandom);
    for (let i = 0; i < country.length; i++) {
        const mycountry = country[i];
        
        mycountry.textContent = finalcountries;
    
        
    }

    
}

