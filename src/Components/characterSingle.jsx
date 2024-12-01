// Importation des composants nécessaires
import Header from "./header.jsx" // Composant d'en-tête
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Icônes
import { faHeart } from '@fortawesome/free-solid-svg-icons' // Icône de cœur

import axios from "axios" // Bibliothèque pour les requêtes HTTP
import { useEffect, useState } from "react" // Hooks React
import { useParams } from "react-router-dom" // Récupère les paramètres de l'URL
import { useNavigate } from "react-router-dom" // Navigation entre pages
import { animated, useSpring } from "@react-spring/web" // Animation

// Définition du composant principal
const CharacterSingle = ({ user, setUser, Cookies, favoris, setFavoris }) => {

    const params = useParams() // Hook pour récupérer le paramètre `characterid` dans l'URL
    const navigate = useNavigate() // Hook pour naviguer vers d'autres pages

    // États locaux
    const [start, setStart] = useState(false); // Pour gérer l'animation d'entrée
    const [like, setLike] = useState([]); // Stocke les favoris de l'utilisateur
    const [data, setData] = useState([]); // Stocke les données des comics
    const [loading, setLoading] = useState(false); // Indique si les données sont en cours de chargement

    const id = params.characterid; // Récupère l'ID du personnage depuis les paramètres de l'URL

    // Fonction pour récupérer les données des comics et des favoris
    const fetchData = async () => {
        const response = await axios.get(`http://localhost:8000/comics/${id}`); // Requête pour récupérer les comics d'un personnage

        // Si l'utilisateur est connecté, récupérer ses favoris
        if (user.length > 0) {
            const idUser = user[1];
            const favoritesData = await axios.get(`http://localhost:8000/user?id=${idUser}`);
            const resultFav = favoritesData.data.favorites;
            setLike(resultFav); // Met à jour les favoris
        }

        // Si les données des comics sont disponibles, les enregistrer
        if (response.data) {
            const result = response.data.comics;
            setData(result);
        } else {
            alert("Le personnage n'existe pas");
        }

        setLoading(true); // Les données sont chargées
    };

    // Fonction pour liker/unliker un article (comics)
    const handleLike = async (id) => {
        if (user.length === 0) navigate('/login'); // Si non connecté, redirection vers la page de connexion
        else {
            console.log("favoris");
            const iscomics = true; // Indique que l'article est un comics
            const response = await axios.post('http://localhost:8000/favoris', { id, iscomics }, {
                headers: {
                    'Authorization': `Bearer ${user[0]}` // Autorisation avec le token utilisateur
                }
            });

            // Gestion de la réponse
            if (response.status === 200) {
                console.log("liked");
            } else if (response.status === 201) {
                console.log("unliked");
            } else {
                alert("Error");
            }
        }
    };

    // Utilisation de useEffect pour appeler fetchData lors du premier rendu
    useEffect(() => {
        fetchData();
    }, [like]); // Se déclenche également si la liste des favoris change

    // Animation avec react-spring
    const styles = useSpring({
        from: { opacity: 0, transform: "translateY(400px)" }, // État initial (invisible)
        to: { opacity: start ? 1 : 0, transform: start ? "translateY(0px)" : "translateY(400px)" }, // État final (visible)
        config: { duration: 100 }, // Durée de l'animation
    });

    // Démarrage de l'animation après le chargement
    useEffect(() => {
        if (!loading) setTimeout(() => setStart(true), 500);
        else setStart(true);
    }, []);

    // Vérifie si un article (comics) est déjà dans les favoris
    const isLike = (id) => {
        for (let i = 0; i < like.length; i++) {
            if (like[i].articleId === id) return true; // Si trouvé, retourne true
        }
        return false; // Sinon, retourne false
    };

    // Rendu du composant
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Composant Header */}
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>
            {/* Conteneur animé */}
            <animated.div className="animation" style={{ ...styles, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1>COMICS</h1>
                {loading ?
                    <div className="characterSingle-container">
                        {/* Parcourt les données des comics */}
                        {data.map((result, index) => {
                            if (data.length === 0) return "Rien à voir ici";
                            else {
                                return (
                                    <div className="charItemComics" key={index}>
                                        {/* Titre du comics et bouton de favoris */}
                                        <h2 className="charItemTitleComics">{result.title}
                                            {isLike(result._id) === true ?
                                                <FontAwesomeIcon onClick={() => { handleLike(result._id) }} icon={faHeart} className="heart-red" />
                                                :
                                                <FontAwesomeIcon onClick={() => { handleLike(result._id) }} icon={faHeart} className="heart" />
                                            }
                                        </h2>
                                        {/* Description et image */}
                                        <p className="charItemDescriptionComics">{result.description}</p>
                                        <div className="charItemImgComics-container">
                                            <img className="charItemImgComics" src={`${result.thumbnail.path}.${result.thumbnail.extension}`} alt={result.name} />
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    :
                    "loading..." // Affiche "loading..." si les données ne sont pas encore disponibles
                }
            </animated.div>
        </div>
    );
};

export default CharacterSingle;
