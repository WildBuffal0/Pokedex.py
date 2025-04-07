document.addEventListener('DOMContentLoaded', () => {
    const pokemonListElement = document.getElementById('pokemon-list');
    const pokemonDetailsElement = document.getElementById('pokemon-details');
    const POKEMON_COUNT = 1025;
    const POKEAPI_LIST_URL = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`;

    let pokemonList = []; // To store fetched list data { name, url }

    // --- Fetch List of Pokémon (1-100) ---
    async function fetchPokemonList() {
        try {
            const response = await fetch(POKEAPI_LIST_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            pokemonList = data.results;
            displayPokemonList();
        } catch (error) {
            console.error("Could not fetch Pokémon list:", error);
            pokemonListElement.innerHTML = '<li class="error">Failed to load Pokémon list. Please try again later.</li>';
        }
    }

    // --- Display Pokémon Names in the List ---
    function displayPokemonList() {
        pokemonListElement.innerHTML = ''; // Clear loading/error message
        pokemonList.forEach((pokemon, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${pokemon.name}`;
            listItem.dataset.url = pokemon.url; // Store API URL for details
            listItem.dataset.index = index; // Store index for highlighting
            pokemonListElement.appendChild(listItem);
        });
    }

    // --- Fetch Detailed Data for a Single Pokémon ---
    async function fetchPokemonDetails(url) {
        // Show loading state in details pane
        pokemonDetailsElement.innerHTML = '<p>Loading details...</p>';
        try {
            const response = await fetch(url);
             if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const pokemonData = await response.json();

            // --- Play the cry ---
            const cryUrl = pokemonData.cries?.latest; // Get 'latest' cry URL using optional chaining

            if (cryUrl) {
                playCry(cryUrl); // Call the function if URL exists
            } else {
                console.log(`No 'latest' cry found for ${pokemonData.name}`); // Log if not found
            }
            // --- Display details ---
            displayPokemonDetails(pokemonData); // Now display details

        } catch (error) {
            console.error("Could not fetch Pokémon details:", error);
             pokemonDetailsElement.innerHTML = '<p class="error">Could not load details for this Pokémon.</p>';
        }
    }
    // ---play cry function--
    function playCry(url) {
        // Stop any previous cry that might still be playing (optional but cleaner)
        // Note: This requires storing the audio object if you want true stop functionality.
        // For simplicity, we'll just create a new one each time. Clicks are usually
        // spaced enough that overlap isn't a huge issue.
    
        const cryAudio = new Audio(url);
        cryAudio.volume = 0.2; // Adjust volume (0.0 to 1.0) - cries can be loud!
        cryAudio.play()
            .catch(error => {
                // Autoplay might be prevented by the browser if it wasn't triggered
                // directly by a user action *immediately* before, or other errors.
                console.error("Audio playback failed:", error);
                // You could potentially alert the user or just log it.
            });
    }
    // --- Display Pokémon Details in the Card ---
    function displayPokemonDetails(pokemon) {
        // Extract necessary data
        const name = pokemon.name;
        const id = pokemon.id;
        // Try to get the animated sprite first (Gen 5 style is common)
let imageUrl = pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;

// Fallback to official artwork if animated isn't found
if (!imageUrl) {
    imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default;
    console.log(`No animated sprite for ${name}, using official artwork.`);
}

// Final fallback to default sprite if others aren't found
if (!imageUrl) {
    imageUrl = pokemon.sprites.front_default;
    console.log(`No official artwork for ${name}, using default sprite.`);
}

// Handle cases where absolutely no image is available (unlikely for first 100)
if (!imageUrl) {
    imageUrl = ''; // Use an empty string or a placeholder image URL
    console.log(`NO IMAGE FOUND for ${name}`);
}
        const types = pokemon.types.map(typeInfo => typeInfo.type.name);
        const stats = pokemon.stats.map(statInfo => ({
            name: statInfo.stat.name,
            value: statInfo.base_stat
        }));

        // Create HTML structure
        let typesHtml = types.map(type =>
            `<span class="type-badge type-${type}">${type}</span>`
        ).join('');

        let statsHtml = stats.map(stat =>
            `<p><span>${stat.name.replace('-', ' ')}:</span> <span>${stat.value}</span></p>`
        ).join('');

        pokemonDetailsElement.innerHTML = `
            <img src="${imageUrl}" alt="Image of ${name}">
            <h3>${name}</h3>
            <p class="pokemon-id">#${id.toString().padStart(3, '0')}</p>
            <div class="types">
                ${typesHtml}
            </div>
            <div class="stats">
                <h4>Base Stats</h4>
                ${statsHtml}
            </div>
        `;
    }

     // --- Event Listener for Clicking on Pokémon List ---
    pokemonListElement.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI' && event.target.dataset.url) {
            const pokemonUrl = event.target.dataset.url;
            const selectedIndex = event.target.dataset.index;

            // Remove active class from previously selected item
            const currentlyActive = pokemonListElement.querySelector('li.active');
            if (currentlyActive) {
                currentlyActive.classList.remove('active');
            }

            // Add active class to the clicked item
            event.target.classList.add('active');

            // Fetch and display details
            fetchPokemonDetails(pokemonUrl);
        }
    });

    // --- Initial Load ---
    fetchPokemonList();
});