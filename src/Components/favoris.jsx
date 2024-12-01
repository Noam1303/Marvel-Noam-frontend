import Header from "./header.jsx"; // Import du composant Header
import { useEffect, useState } from "react"; // Hooks React pour gérer l'état et les effets
import axios from "axios"; // Librairie pour effectuer des requêtes HTTP
import { useNavigate } from "react-router-dom"; // Hook pour naviguer entre les pages
import { animated, useSpring } from "@react-spring/web"; // Librairie pour ajouter des animations

// Composant Favoris : affiche les articles ou comics favoris de l'utilisateur
const Favoris = ({ user, setUser, Cookies, favoris, setFavoris }) => {
    const navigate = useNavigate(); // Initialisation de la navigation

    // États locaux
    const [start, setStart] = useState(false); // Gère le démarrage des animations
    const [loading, setLoading] = useState(false); // Indicateur de chargement des données
    const [data, setData] = useState([]); // Stocke les données des favoris
    const [input, setInput] = useState(""); // Stocke la valeur de la barre de recherche

    // Fonction pour récupérer les données des favoris
    const fetchData = async () => {
        if (!user || user.length === 0) return; // Si l'utilisateur n'est pas connecté, ne rien faire

        const token = user[0]; // Récupérer le token utilisateur
        const response = await axios.get("https://site--test-backend--7g4fljlbl5js.code.run/favoris", {
            headers: {
                Authorization: `Bearer ${token}`, // Autorisation via le token
            },
        });

        const newFavoris = response.data;

        // Si les favoris ne sont pas encore initialisés dans l'état global
        if (!favoris || favoris.length === 0) {
            setFavoris(newFavoris); // Initialiser les favoris globaux
        }

        // Récupérer les détails des articles ou comics à partir de leur ID
        const articles = await Promise.all(
            newFavoris.map((favori) =>
                favori.iscomics && favori.iscomics === true
                    ? axios
                          .get(`https://site--test-backend--7g4fljlbl5js.code.run/comic/${favori.articleId}`)
                          .then((res) => res.data) // Récupérer les détails si c'est un comic
                    : axios
                          .get(`https://site--test-backend--7g4fljlbl5js.code.run/comics/${favori.articleId}`)
                          .then((res) => res.data) // Récupérer les détails si c'est un autre type d'article
            )
        );

        setData(articles); // Stocker les articles dans l'état local
        setLoading(true); // Indiquer que le chargement est terminé
    };

    // Fonction pour mettre à jour la barre de recherche
    const handleInput = (e) => {
        setInput(e.target.value); // Met à jour la valeur de recherche
    };

    // Charger les favoris lorsque le composant est monté
    useEffect(() => {
        fetchData();
    }, []);

    // Configuration des animations via React Spring
    const styles = useSpring({
        from: { opacity: 0, transform: "translateY(400px)" }, // Début de l'animation
        to: { opacity: start ? 1 : 0, transform: start ? "translateX(0px)" : "translateY(400px)" }, // Fin de l'animation
        config: { duration: 100 }, // Durée de l'animation
    });

    // Gérer le démarrage de l'animation au chargement du composant
    useEffect(() => {
        if (!loading) setTimeout(() => setStart(true), 500);
        else setStart(true);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Inclusion du Header */}
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>
            <animated.div
                style={{ ...styles, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <h1>Favoris</h1>
                {/* Barre de recherche */}
                <input
                    type="text"
                    className="searchbar"
                    placeholder="searchbar"
                    value={input}
                    onChange={handleInput}
                />
                {/* Vérification si l'utilisateur est connecté */}
                {user.length === 0
                    ? navigate("/login") // Rediriger vers la page de connexion si non connecté
                    : loading ? ( // Affichage des favoris une fois les données chargées
                        <div className="favoris-container">
                            {/* Si aucun favori, afficher un message */}
                            {data.length === 0 ? (
                                <p>rien à voir ici</p>
                            ) : (
                                // Affichage des favoris filtrés par la recherche
                                data.map((result, index) => {
                                    if (result.title === undefined) result.title = "";
                                    if (result.name === undefined) result.name = "";
                                    if (
                                        result.title.toLowerCase().includes(input) ||
                                        result.name.toLowerCase().includes(input) ||
                                        result.description.toLowerCase().includes(input)
                                    ) {
                                        return (
                                            <div className="favorisItem" key={index}>
                                                {/* Titre */}
                                                <h2 className="favorisItemTitle">
                                                    {result.name || result.title}{" "}
                                                </h2>
                                                {/* Description */}
                                                <p className="favorisItemDescription">
                                                    {result.description}
                                                </p>
                                                {/* Image */}
                                                <div className="favorisItemImg-container">
                                                    <img
                                                        className="favorisItemImg"
                                                        src={
                                                            result.thumbnail.path +
                                                            "." +
                                                            result.thumbnail.extension
                                                        }
                                                        alt={result.name}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            )}
                        </div>
                    ) : (
                        "loading..." // Message de chargement
                    )}
            </animated.div>
        </div>
    );
};

export default Favoris;
