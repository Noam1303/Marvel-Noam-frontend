import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Pour utiliser les icônes FontAwesome
import { faHeart, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons' // Import des icônes spécifiques
import Header from "./header.jsx" // Composant pour l'en-tête
import { useNavigate } from 'react-router-dom' // Hook pour naviguer entre les pages
import axios from "axios" // Librairie pour effectuer des requêtes HTTP
import { useState, useEffect } from 'react' // Hooks React pour gérer l'état et les effets
import { animated, useSpring } from "@react-spring/web" // Animation avec React Spring

const Comics = ({data, setData, user, setUser, Cookies, favoris, setFavoris}) => {

    // États locaux pour gérer les données et l'interaction utilisateur
    const [start, setStart] = useState(false); // Gérer le démarrage des animations
    const [input, setInput] = useState(""); // Gérer l'entrée de recherche
    const [like, setLike] = useState([]); // Liste des favoris de l'utilisateur
    const [page, setPage] = useState(0); // Nombre total de pages
    const [auto, setAuto] = useState([]) // Suggestions d'auto-complétion
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [loading, setLoading] = useState(false); // Indique si les données sont en cours de chargement

    const navigate = useNavigate(); // Permet de rediriger vers d'autres pages

    // Calculer le nombre total de pages disponibles pour les comics
    const numberOfPages = async() => {
        const response = await axios.get('https://site--test-backend--7g4fljlbl5js.code.run/comicsPage?title='+input);
        const result = response.data;
        setPage(result); // Mettre à jour l'état du nombre de pages
        if(currentPage >= result-1) { // Ajuster la page courante si elle dépasse le total
            setCurrentPage(Math.max(0, result - 1));
        }
    };

    // Récupérer les données des comics en fonction de la page et de la recherche
    const fetchData = async() => {        
        try {
            const pageToSkip = currentPage * 20; // Calcul de l'offset pour la pagination
            const response = await axios.get(`https://site--test-backend--7g4fljlbl5js.code.run/comics?skip=${pageToSkip}&title=${input}`);
            setData(response.data.results); // Mise à jour des données des comics
            if(user.length > 0) { // Si un utilisateur est connecté, récupérer ses favoris
                const id = user[1];        
                const favoritesData = await axios.get('https://site--test-backend--7g4fljlbl5js.code.run/user?id='+id);
                setLike(favoritesData.data.favorites); // Mise à jour des favoris
            }
            setLoading(true); // Indiquer que les données sont chargées
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false); // En cas d'erreur, gérer l'état de chargement
        }
    };

    // Effet pour mettre à jour les données lorsque certains états changent
    useEffect(() => {
        numberOfPages(); // Mise à jour du nombre de pages
        fetchData(); // Charger les comics
        handleButton(); // Mettre à jour l'état des boutons de navigation
    },[currentPage, page, input, like]);

    // Gérer l'état des boutons de pagination
    const handleButton = () => {
        const left = document.getElementById('plus');
        const right = document.getElementById('moins');
        if(left !== undefined && right !== undefined && left && right){
            if(currentPage+1 === 1) {
                left.classList.add("gray");
                left.classList.remove("white");
            } else {
                left.classList.remove("gray");
                left.classList.add("white");
            }
            if(currentPage+1 >= page) {
                right.classList.add("gray");
                right.classList.remove("white");
            } else {
                right.classList.remove("gray");
                right.classList.add("white");
            }
        }
    };

    // Configuration de l'animation avec React Spring
    const styles = useSpring({
        from: { opacity: 0, transform: "translateY(400px)" },
        to: { opacity: start ? 1 : 0, transform: start ? "translateX(0px)" : "translateY(400px)" },
        config: { duration: 100 },
    });

    // Effet pour démarrer l'animation
    useEffect(() => {
        if(!loading) setTimeout(() => setStart(true), 700);
        else setStart(true);        
    },[]);

    // Fonction pour gérer les favoris (ajout/suppression)
    const handleLike = async(id) => {
        if(user.length === 0) navigate('/login'); // Rediriger vers la page de connexion si non connecté
        else {
            const iscomics = true;
            const response = await axios.post('https://site--test-backend--7g4fljlbl5js.code.run/favoris', {id, iscomics}, {
                headers: { 'Authorization': `Bearer ${user[0]}` }
            });
            if(response.status === 200) console.log("liked");
            else if(response.status === 201) console.log("unliked");
            else alert("Error");
        }
    };

    // Vérifier si un article est dans les favoris
    const isLike = (id) => {
        return like.some(fav => fav.articleId === id);
    };

    // Fonction pour gérer le clic sur un comic (redirige vers sa page de détails)
    const handleClick = (id) => {
        navigate(`/comic/${id}`);
    };

    // Auto-complétion pour la barre de recherche
    const autoCompletion = async (value) => {
        if (value === "") {
            return setAuto([])
        }
        const pageToSkip = currentPage * 20
        const response = await axios.get("https://site--test-backend--7g4fljlbl5js.code.run/comics?skip=" + pageToSkip + "&title=" + value)  
        const result = response.data.results
        if(result !== undefined){
            if (result.length === 0) {
                return setAuto([])
            }
        }
            
        const newAuto = []
        for (let i = 0; i < 3; i++) {
            newAuto.push(result[i].title) // Garde les 3 premiers résultats pour suggestions
        }              
        setAuto(newAuto)
    }

    // Gestion de la saisie utilisateur dans la barre de recherche
    const handleInput = (e) => {
        autoCompletion(e.target.value) // Met à jour les suggestions
        setInput(e.target.value)
    }

    const handleSetInput = (result) => {
        setInput(result)
        setAuto([])
    }

    return (
        <>
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>
            <animated.div style={{...styles, display: "flex", flexDirection: "column", alignItems: "center"}}>
                {loading ?
                <>
                    <h1>COMICS</h1>
                    <input type="text" className='searchbar' placeholder="searchbar" value={input} onChange={handleInput} />
                    <div className="auto-suggestion-container">
                        {auto.length === 0 ? "" : 
                        auto.map((result, index) => {                    
                            return (
                                <div key={index} className="auto-suggestion" onClick={() => handleSetInput(result)}>
                                    {result}
                                </div>
                            )
                        })}
                    </div>
                    {page === 0 ? "" : 
                        <div style={{display: "flex"}}>
                            <button className='gray' id='plus' onClick={() => {                            
                                const plus = document.getElementById('plus');
                                let result = 0;
                                if(currentPage+1 > 1) result = currentPage - 1; 
                                else result = currentPage;                            
                                setCurrentPage(result);
                            }}>
                                <FontAwesomeIcon icon={faArrowLeft} className="heart" />
                            </button>
                            <button id='display' onClick={() => setCurrentPage(currentPage)}>
                                {currentPage+1 <= 0 ? 1 : currentPage + 1}
                            </button>
                            <button id='moins' onClick={() => {
                                let result = 0;
                                if(currentPage+1 < page) result = currentPage + 1; 
                                else result = currentPage;
                                setCurrentPage(result);
                            }}>
                                <FontAwesomeIcon icon={faArrowRight} className="heart" />
                            </button>
                        </div>
                    }
                    <div className="comics-container">
                        {!data  ? <p>Nothing found</p> :data.length === 0 ? <p>Nothing found</p>
                        : 
                        data.map((result, index) => {             
                            if(result.title.toLowerCase().includes(input.toLowerCase())){
                                return (
                                    <div className="comicsItem" key={index}>
                                        <h2 className="comicsItemTitle">{result.title} 
                                            {isLike(result._id) === true ?
                                                <FontAwesomeIcon onClick={() => {handleLike(result._id)}} icon={faHeart} className="heart-red" /> 
                                                :
                                                <FontAwesomeIcon onClick={() => {handleLike(result._id)}} icon={faHeart} className="heart" /> 
                                            }                            
                                        </h2>
                                        <p className="comicsItemDescription">{result.description}</p>
                                        <div className="comicsItemImg-container" onClick={() => {handleClick(result._id)}}>
                                            <img className="comicsItemImg" src={result.thumbnail.path + "." + result.thumbnail.extension} alt={result.title} />
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </>
                :
                ""
                }
            </animated.div>
        </>
    );
};

export default Comics;
