const db = require('./config/db');


const movies = [
    {
        title: "Inception",
        genre: ["Action", "Sci-Fi", "Thriller"],
        duration: "2h 28m",
        rating: 8.8,
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg"
    },
    {
        title: "The Dark Knight",
        genre: ["Action", "Crime", "Drama"],
        duration: "2h 32m",
        rating: 9.0,
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        poster: "https://upload.wikimedia.org/wikipedia/id/8/8a/Dark_Knight.jpg"
    },
    {
        title: "Interstellar",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        duration: "2h 49m",
        rating: 8.6,
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
    },
    {
        title: "Parasite",
        genre: ["Dark Comedy", "Drama", "Thriller"],
        duration: "2h 12m",
        rating: 8.5,
        director: "Bong Joon Ho",
        cast: ["Kang-ho Song", "Sun-kyun Lee", "Yeo-jeong Cho"],
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png"
    },
    {
        title: "Avengers: Endgame",
        genre: ["Action", "Adventure", "Drama"],
        duration: "3h 1m",
        rating: 8.4,
        director: "Anthony Russo, Joe Russo",
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
    },
    {
        title: "The Matrix",
        genre: ["Action", "Sci-Fi", "Cyberpunk"],
        duration: "2h 16m",
        rating: 8.7,
        director: "Lana Wachowski, Lilly Wachowski",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        poster: "https://upload.wikimedia.org/wikipedia/id/c/c1/The_Matrix_Poster.jpg"
    },
    {
        title: "Saving Private Ryan",
        genre: ["War", "Drama", "Tragedy"],
        duration: "2h 49m",
        rating: 8.6,
        director: "Steven Spielberg",
        cast: ["Tom Hanks", "Matt Damon", "Tom Sizemore"],
        description: "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose comrades have been killed in action.",
        poster: "https://upload.wikimedia.org/wikipedia/en/a/ac/Saving_Private_Ryan_poster.jpg"
    },
    {
        title: "Spider-Man: Into the Spider-Verse",
        genre: ["Animation", "Action", "Adventure"],
        duration: "1h 57m",
        rating: 8.4,
        director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
        cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
        description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
        poster: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png"
    },
    {
        title: "Oppenheimer",
        genre: ["biographical", "drama", "history"],
        duration: "3h 0m",
        rating: 8.2,
        director: "Christopher Nolan",
        cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
        description: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bombs that brought an end to World War II.",
        poster: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg"
    },
    {
        title: "The Shawshank Redemption",
        genre: ["Drama", "Prison Drama", "Period Drama"], 
        duration: "2h 22m",
        rating: 9.3,
        director: "Frank Darabont",
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg"
    },
    {
        title: "Forest Gump",
        genre: ["Drama", "Romance", "Epic"],
        duration: "2h 22m",
        rating: 8.8,
        director: "Robert Zemeckis",
        cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
        description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
        poster: "https://upload.wikimedia.org/wikipedia/id/6/67/Forrest_Gump_poster.jpg"
    },
    {
        title: "The Witch",
        genre: ["psychological Horror", "Dark Fantasy", "supernatural Horror"],
        duration: "1h 32m",
        rating: 7.0,
        director: "Robert Eggers",
        cast: ["Anna Taylor-Joy", "Ralph Ineson", "Kate Dickie"],
        description: "An isolated Puritan family in 1630s New England comes unraveled by the forces of witchcraft and possession.",
        poster: "https://upload.wikimedia.org/wikipedia/id/b/bf/The_Witch_poster.png"
    },
    {
        title: "Iron Lung",
        genre: ["psychological Horror", "Sci-Fi", "Thriller"],
        duration: "2h 5m",
        rating: 6.6,
        director: "Mark Fischbach",
        cast: ["Mark Fischbach", "Carroline Kaplan", "Troy Baker"],
        description: "In a post-apocalyptic future after 'The Quiet Rapture' event, a convict explores a blood ocean on a desolate moon using a submarine called the 'Iron Lung' to search for missing stars/planets.",
        poster: "https://en.wikipedia.org/wiki/File:Iron_Lung_(film)_poster.jpg"
    },
    {
        title: "Five Night at Freddy's",
        genre: ["Supernatural Horror", "Thriller", "Mystery"],
        duration: "1h 50m",
        director: "Emma Tammi",
        rating: 5.4,
        cast: ["Josh Hutcherson", "Piper Rubio", "Elizabeth Lail"],
        description: "A troubled security guard begins working at Freddy Fazbear's Pizza. During his five nights on the job, he realizes that something is wrong with the pizzeria and pretty soon finds the truth about its animatronics.",
        poster: "https://id.wikipedia.org/wiki/Berkas:Five_Nights_At_Freddy's_poster.jpeg"
    },
    {
        title: "Spirited Away",
        genre: ["Anime", "Adventure", "Fairy Tale"],
        duration: "2h 5m",
        director: "Hayao Miyazaki",
        rating: 8.6,
        cast: ["Miyu Irino", "Rumi Hiiragi", "Mari Natsuki"],
        description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.",
        poster: "https://id.wikipedia.org/wiki/Berkas:Spirited_Away_Japanese_poster.png"
    },
    {
        title: "Jumanji: Welcome to the Jungle",
        genre: ["Advanture", "Comedy", "Action"],
        duration: "2h",
        director: "Jake Kasdan",
        rating: 6.9,
        cast: ["Dwayne Johnson", "Kevin Hart", "Karen Gillan"],
        description: "Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.",
        poster: "https://en.wikipedia.org/wiki/File:Jumanji_Welcome_to_the_Jungle.png"
    }
];

const seed = async () => {
    try {
        console.log('Seeding database...');

        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE schedules');
        await db.query('TRUNCATE TABLE movies');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        for (const movie of movies) {
            const [result] = await db.query(
                'INSERT INTO movies (title, description, poster, duration, genre, rating, director, cast) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    movie.title,
                    movie.description,
                    movie.poster,
                    movie.duration,
                    movie.genre.join(', '),
                    movie.rating,
                    movie.director,
                    movie.cast.join(', ')
                ]
            );
            const movieId = result.insertId;
            console.log(`Inserted movie: ${movie.title}`);


            const theaters = [1, 2, 3];
            const possibleTimes = ['14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];

            const selectedTimes = possibleTimes
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            for (const time of selectedTimes) {
                const theaterId = theaters[Math.floor(Math.random() * theaters.length)];

                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dateStr = tomorrow.toISOString().split('T')[0];
                const fullTime = `${dateStr} ${time}:00`;

                const basePrice = 35000;
                const randomPremium = Math.floor(Math.random() * 6) * 5000; 
                const price = basePrice + randomPremium;

                await db.query(
                    'INSERT INTO schedules (movie_id, theater_id, start_time, price) VALUES (?, ?, ?, ?)',
                    [movieId, theaterId, fullTime, price]
                );
                console.log(`  Added schedule: ${fullTime} at Theater ${theaterId}`);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Seeding failed:', err);
        throw err;
    }
};

module.exports = seed;

if (require.main === module) {
    seed()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

