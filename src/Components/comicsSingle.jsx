import Header from "./header.jsx"; // Import du composant Header
import axios from "axios"; // Librairie pour effectuer des requêtes HTTP
import { useEffect, useState } from "react"; // Hooks React pour gérer l'état et les effets
import { useParams, useNavigate } from "react-router-dom"; // Hooks pour accéder aux paramètres de l'URL et naviguer entre les pages
import { animated } from "@react-spring/web"; // Animation avec React Spring

const comicsSingle = ({ user, setUser, Cookies, favoris, setFavoris }) => {
    // Accéder aux paramètres de l'URL pour obtenir l'ID du comic
    const params = useParams();
    const navigate = useNavigate();

    // États locaux
    const [data, setData] = useState([]); // Stocker les données du comic
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const [start, setStart] = useState(0); // État pour gérer les animations

    const id = params.comicsid; // Récupération de l'ID du comic depuis les paramètres

    // Fonction pour gérer l'ajout aux favoris
    const handleLike = async (id) => {
        if (user.length === 0) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
            navigate("/login");
        } else {
            console.log("favoris");
            const iscomics = true;
            const response = await axios.post(
                "site--test-backend--7g4fljlbl5js.code.run/favoris",
                { id, iscomics },
                {
                    headers: {
                        Authorization: `Bearer ${user[0]}`, // Ajouter le token d'utilisateur pour l'autorisation
                    },
                }
            );
            if (response.status === 200) {
                // Si l'ajout est réussi, mettre à jour l'état des favoris
                const result = [...favoris];
                response.data.iscomics = true;
                result.push(response.data);
                console.log(result);
                setFavoris(result);
            } else if (response.status === 401) {
                // Si l'article est déjà dans les favoris
                alert("already in favoris");
            } else {
                alert("Error"); // En cas d'erreur
            }
        }
    };

    // Fonction pour récupérer les données du comic spécifique
    const fetchData = async () => {
        const response = await axios.get("site--test-backend--7g4fljlbl5js.code.run/comic/" + id); // Requête GET pour obtenir les détails du comic
        if (response.data) {
            const data = response.data;
            setData(data); // Mise à jour de l'état avec les données du comic
        } else {
            alert("Pas d'information sur le comics"); // Si aucune donnée n'est trouvée
        }
        setLoading(true); // Indiquer que le chargement est terminé
    };

    // Effet pour charger les données dès que le composant est monté
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* Inclusion du Header */}
            <Header
                user={user}
                setUser={setUser}
                Cookies={Cookies}
                setFavoris={setFavoris}
            ></Header>
            {/* Animation */}
            <animated.div
                className="animation"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <div className="comicsSingle-container">
                        {data.length === 0 ? (
                            "rien à voir ici"
                        ) : (
                            <div className="comicsSingleItem">
                                {/* Titre du comic */}
                                <h2 className="comicsSingleItemTitle">
                                    {data.title}
                                </h2>
                                {/* Image du comic */}
                                <div className="comicsSingleItemImg-container">
                                    <img
                                        className="comicsSingleItemImg"
                                        src={
                                            data.thumbnail.path +
                                            "." +
                                            data.thumbnail.extension
                                        }
                                        alt={data.title}
                                    />
                                </div>
                                {/* Description du comic */}
                                <p className="comicsSingleItemDescription">
                                    {data.description}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    "loading" // Afficher "loading" tant que les données ne sont pas chargées
                )}
            </animated.div>
        </>
    );
};

export default comicsSingle;
