// Importation des hooks et des dépendances nécessaires
import { useState, useEffect } from 'react';
import './assets/css/reset.css';  // Import du fichier CSS pour réinitialiser les styles
import './assets/css/style.css';  // Import du fichier CSS principal pour l'application
import axios from "axios"; // Import de la bibliothèque axios pour les requêtes HTTP
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Import des outils de routage
import Cookies from "js-cookie";  // Import de la bibliothèque js-cookie pour gérer les cookies

// Import des composants de l'application
import Home from "./Components/home.jsx";
import Characters from "./Components/characters.jsx";
import CharacterSingle from "./Components/characterSingle.jsx";
import Comics from "./Components/comics.jsx";
import ComicsSingle from "./Components/comicsSingle.jsx";
import Signup from "./Components/signup.jsx";
import Login from "./Components/login.jsx";
import Favoris from "./Components/favoris.jsx";

// Définition du composant principal de l'application
function App() {
  // Définition des états pour stocker les données, l'utilisateur, et l'état de chargement
  const [dataComics, setDataComics] = useState(""); // Stocke les données des comics
  const [dataCharacters, setDataCharacters] = useState(""); // Stocke les données des personnages
  const [favoris, setFavoris] = useState(""); // Stocke les favoris de l'utilisateur
  const [user, setUser] = useState([]); // Stocke les informations de l'utilisateur (token, id)
  const [loading, setLoading] = useState(false); // Gère l'état de chargement

  // Fonction fetchData pour charger les données
  const fetchData = async () => {
    // Réinitialisation des données au début de chaque appel
    setDataComics([]);
    setDataCharacters([]);
    setLoading(true); // Déclenche le changement d'état de chargement
  }

  // useEffect pour exécuter le code une fois que le composant est monté
  useEffect(() => {
    // Récupération du token et de l'ID de l'utilisateur depuis les cookies
    const token = Cookies.get("token");
    const id = Cookies.get("id");

    // Si un utilisateur est trouvé (token et id existent), on met à jour l'état de l'utilisateur
    if (token && id) {
      setUser([token, id]); // Mise à jour de l'état de l'utilisateur avec le token et l'ID
      console.log([token, id]); // Affichage du token et ID dans la console (pour le debug)
    } else {
      console.log("no user found"); // Affichage d'un message si aucun utilisateur n'est trouvé
    }

    // Appel de la fonction fetchData pour charger les données
    fetchData();
  }, []); // [] en tant que dépendance signifie que l'effet ne s'exécutera qu'une seule fois au montage du composant

  return (
    // Structure de navigation avec Router, affichée si les données sont chargées
    <nav>
      {loading ?  // Vérification si les données sont en cours de chargement
        <Router>
          {/* Définition des routes de l'application */}
          <Routes>
            {/* Route pour la page d'accueil */}
            <Route path='/' element={<Home user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris} />}></Route>

            {/* Route pour la page des personnages */}
            <Route path='/characters' element={<Characters data={dataCharacters} setData={setDataCharacters} user={user} setUser={setUser} Cookies={Cookies} favoris={favoris} setFavoris={setFavoris} />}></Route>

            {/* Route pour afficher un personnage spécifique */}
            <Route path='/characters/:characterid' element={<CharacterSingle user={user} setUser={setUser} Cookies={Cookies} favoris={favoris} setFavoris={setFavoris} />}></Route>

            {/* Route pour la page des comics */}
            <Route path='/comics' element={<Comics data={dataComics} setData={setDataComics} user={user} setUser={setUser} Cookies={Cookies} favoris={favoris} setFavoris={setFavoris} />}></Route>

            {/* Route pour afficher un comic spécifique */}
            <Route path='/comic/:comicsid' element={<ComicsSingle user={user} setUser={setUser} Cookies={Cookies} favoris={favoris} setFavoris={setFavoris} />}></Route>

            {/* Route pour la page des favoris */}
            <Route path='/favoris' element={<Favoris user={user} setUser={setUser} Cookies={Cookies} favoris={favoris} setFavoris={setFavoris} />}></Route>

            {/* Route pour la page d'inscription */}
            <Route path='/signup' element={<Signup user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris} />}></Route>

            {/* Route pour la page de connexion */}
            <Route path='/login' element={<Login user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris} />}></Route>
          </Routes>
        </Router>
      :
        // Message de chargement si les données ne sont pas encore prêtes
        "loading..."
      }
    </nav>
  )
}

// Export du composant App pour qu'il soit utilisé ailleurs dans l'application
export default App;
