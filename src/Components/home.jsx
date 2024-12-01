import Header from "./header.jsx"; // Importation du composant Header pour l'affichage de la barre de navigation

// Composant Home : la page d'accueil de l'application
const Home = ({ user, setUser, Cookies, setFavoris }) => {
    return (
        <>
            {/* Le composant Header est inclus ici, il recevra les props pour gérer l'utilisateur et les favoris */}
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>
            
            {/* Conteneur principal de la page d'accueil */}
            <div className="home-container">
                {/* Image de fond ou image principale sur la page d'accueil */}
                <img className="marvel-home" src="marvel-img.jpg" alt="marvel image" />
            </div>
        </>
    );
}

export default Home;
