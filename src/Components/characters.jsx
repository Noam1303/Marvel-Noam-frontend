// Importation des icônes FontAwesome et des bibliothèques nécessaires
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useState, useEffect } from 'react'
import { animated, useSpring } from "@react-spring/web"

import Header from "./header.jsx"

// Composant Characters
const Characters = ({ data, setData, user, setUser, Cookies, favoris, setFavoris }) => {

    const navigate = useNavigate() // Hook pour naviguer entre les pages

    // États locaux
    const [like, setLike] = useState([]) // Stocke les favoris de l'utilisateur
    const [start, setStart] = useState(false) // Pour gérer l'animation d'entrée
    const [input, setInput] = useState("") // Gestion de la barre de recherche
    const [page, setPage] = useState(0) // Nombre total de pages
    const [auto, setAuto] = useState([]) // Suggestions d'auto-complétion
    const [currentPage, setCurrentPage] = useState(0) // Page actuelle
    const [loading, setLoading] = useState(false) // Indicateur de chargement

    // Fonction pour récupérer le nombre de pages disponibles
    const numberOfPages = async () => {
        const response = await axios.get('site--test-backend--7g4fljlbl5js.code.run/charPage?title=' + input)
        const result = response.data        
        setPage(result)        
        // Gestion des cas où l'utilisateur est en dehors des pages disponibles
        if (currentPage >= result - 1) {            
            if (result - 1 === -1 || result - 1 === 0) {
                setCurrentPage(0)
            } else {
                setCurrentPage(result - 1)
            }
        }
    }

    // Fonction pour récupérer les données des personnages
    const fetchData = async () => {
        const pageToSkip = currentPage * 20 // Calcul du décalage pour la pagination
        const response = await axios.get("site--test-backend--7g4fljlbl5js.code.run/characters?skip=" + pageToSkip + "&title=" + input)        
        const result = response.data 
        setData(result.results)

        // Si l'utilisateur est connecté, récupérer ses favoris
        if (user.length > 0) {
            const id = user[1]        
            const favoritesData = await axios.get('site--test-backend--7g4fljlbl5js.code.run/user?id=' + id)
            const resultFav = favoritesData.data.favorites        
            setLike(resultFav)
        }
        setLoading(true)
    }

    // useEffect pour mettre à jour les données lorsque certaines dépendances changent
    useEffect(() => {
        numberOfPages() // Met à jour le nombre de pages
        fetchData() // Récupère les personnages
        handleButton() // Gère les styles des boutons de pagination
    }, [currentPage, page, input, like]) // Dépendances

    // Gestion des styles pour les boutons de pagination (active/inactive)
    const handleButton = () => {
        const left = document.getElementById('plus');
        const right = document.getElementById('moins')
        if (left !== undefined && right !== undefined && left && right) {
            if (currentPage + 1 === 1) {
                left.classList.add("gray") // Désactiver le bouton gauche sur la première page
                left.classList.remove("white")
            } else {
                left.classList.remove("gray")
                left.classList.add("white")
            }
            if (currentPage + 1 >= page) {
                right.classList.add("gray") // Désactiver le bouton droit sur la dernière page
                right.classList.remove("white")
            } else {
                right.classList.remove("gray")
                right.classList.add("white")
            }
        }
    }

    // Animation d'entrée avec react-spring
    const styles = useSpring({
        from: { opacity: 0, transform: "translateY(400px)" },
        to: { opacity: start ? 1 : 0, transform: start ? "translateX(0px)" : "translateY(400px)" },
        config: { duration: 100 },
    });

    // Démarrer l'animation après le chargement
    useEffect(() => {
        if (!loading) setTimeout(() => setStart(true), 700);
        else setStart(true);        
    }, [])

    // Gestion des likes (ajout/suppression des favoris)
    const handleLike = async (id) => {
        if (user.length === 0) navigate('/login') // Si non connecté, redirection vers login
        else {
            const iscomics = false
            const response = await axios.post('site--test-backend--7g4fljlbl5js.code.run/favoris', { id, iscomics }, {
                headers: {
                    'Authorization': `Bearer ${user[0]}`
                }
            })
            if (response.status === 200) {
                console.log("liked");
            } else if (response.status === 201) {
                console.log("unliked");
            } else {
                alert("Error")
            }
        }
    }

    // Vérifie si un article est dans les favoris
    const isLike = (id) => {        
        for (let i = 0; i < like.length; i++) {            
            if (like[i].articleId === id) return true
        }
        return false
    }

    // Redirection vers les détails d'un personnage
    const handleClick = (id) => {
        navigate(`/characters/${id}`)
    }

    // Auto-complétion pour la barre de recherche
    const autoCompletion = async (value) => {
        if (value === "") {
            return setAuto([])
        }
        const pageToSkip = currentPage * 20
        const response = await axios.get("site--test-backend--7g4fljlbl5js.code.run/characters?skip=" + pageToSkip + "&title=" + value)  
        const result = response.data.results
        if (result.length === 0) {
            return setAuto([])
        }
        const newAuto = []
        for (let i = 0; i < 3; i++) {
            newAuto.push(result[i].name) // Garde les 3 premiers résultats pour suggestions
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

    // Rendu du composant
    return (
        <>
            {/* Composant Header */}
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>

            {/* Conteneur animé */}
            <animated.div className="animation" style={{ ...styles, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {loading ? 
                <>
                    <h1>CHARACTERS</h1>
                    {/* Barre de recherche */}
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
                        <div style={{ display: "flex" }}>
                            {/* Boutons de pagination */}
                            <button className='gray' id='plus' onClick={() => setCurrentPage(currentPage > 0 ? currentPage - 1 : currentPage)}>
                                <FontAwesomeIcon icon={faArrowLeft} className="heart" />
                            </button>
                            <button id='display'>{currentPage + 1 <= 0 ? 1 : currentPage + 1}</button>
                            <button id='moins' onClick={() => setCurrentPage(currentPage + 1 < page ? currentPage + 1 : currentPage)}>
                                <FontAwesomeIcon icon={faArrowRight} className="heart" />
                            </button>
                        </div>
                    }
                    <div className="characters-container">
                        {!data ? <p>Nothing found</p> :
                        data.map((result, index) => { 
                            if (result.name.toLowerCase().includes(input.toLowerCase())) {   
                                return (
                                    <div className="charItem" key={index}>
                                        <h2 className="charItemTitle">{result.name}  
                                            {/* Bouton Like/Unlike */}
                                            {isLike(result._id) ? 
                                            <FontAwesomeIcon onClick={() => handleLike(result._id)} icon={faHeart} className="heart-red" /> 
                                            :
                                            <FontAwesomeIcon onClick={() => handleLike(result._id)} icon={faHeart} className="heart" /> 
                                            } 
                                        </h2>
                                        {/* Description et image */}
                                        <p className="charItemDescription">{result.description}</p>
                                        <div className="charItemImg-container" onClick={() => handleClick(result._id)}>
                                            <img className="charItemImg" src={`${result.thumbnail.path}.${result.thumbnail.extension}`} alt={result.name} />
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </>
                : ""}
            </animated.div>
        </>
    )
}

export default Characters
