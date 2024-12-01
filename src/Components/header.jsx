import { useNavigate } from "react-router-dom"; // Importation du hook pour la navigation entre les pages

// Composant Header : barre de navigation principale
const Header = ({ user, setUser, Cookies, setFavoris }) => {
    const navigate = useNavigate(); // Initialisation du hook de navigation pour rediriger l'utilisateur

    return (
        <header>
            {/* Conteneur principal du header */}
            <div className="header-container">
                {/* Logo Marvel, redirige l'utilisateur vers la page d'accueil lorsqu'il clique dessus */}
                <div>
                    <img
                        className="logo"
                        src="/public/marvel-logo.png" // Source de l'image du logo
                        alt="marvel logo"
                        width="180px" // Largeur de l'image
                        onClick={() => { navigate('/'); }} // Redirection vers la page d'accueil au clic
                    />
                </div>

                {/* Conteneur des boutons de navigation */}
                <div className="button-container">
                    {/* Bouton pour rediriger vers la page des personnages */}
                    <button className="header-button" onClick={() => { navigate('/characters'); }}>Personnages</button>
                    {/* Bouton pour rediriger vers la page des comics */}
                    <button className="header-button" onClick={() => { navigate('/comics'); }}>Comics</button>
                    {/* Bouton pour rediriger vers la page des favoris ou demander la connexion si l'utilisateur n'est pas connecté */}
                    <button
                        className="header-button"
                        id="fav"
                        onClick={() => {
                            user.length === 0 ? navigate('/login') : navigate('/favoris');
                        }}
                    >
                        Favoris
                    </button>
                </div>

                {/* Conteneur des boutons de connexion / déconnexion */}
                <div className="connection-container">
                    {/* Si l'utilisateur n'est pas connecté, afficher les boutons de connexion et d'inscription */}
                    {user.length === 0 ? (
                        <>
                            <button className="connection-button" onClick={() => { navigate('/login'); }}>
                                Connexion
                            </button>
                            <button className="connection-button" onClick={() => { navigate('/signup'); }}>
                                Inscription
                            </button>
                        </>
                    ) : (
                        // Si l'utilisateur est connecté, afficher le bouton de déconnexion
                        <button
                            className="connection-button"
                            onClick={() => {
                                // Déconnexion de l'utilisateur : redirige vers la page de connexion et réinitialise l'état
                                navigate('/login');
                                setUser([]); // Efface les informations de l'utilisateur
                                Cookies.remove("token"); // Supprime le token d'authentification des cookies
                                Cookies.remove("id"); // Supprime l'ID utilisateur des cookies
                                setFavoris([]); // Réinitialise les favoris de l'utilisateur
                            }}
                        >
                            Déconnexion
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
