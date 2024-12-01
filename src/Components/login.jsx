import Header from "./header.jsx"; // Importation du composant Header pour la navigation
import { useState } from "react"; // Importation de hook useState pour la gestion de l'état local
import axios from "axios"; // Importation d'axios pour les requêtes HTTP
import { useNavigate } from "react-router-dom"; // Importation du hook useNavigate pour la navigation entre les pages

// Composant Login : pour la page de connexion
const Login = ({ user, setUser, Cookies, setFavoris }) => {

    // Hook pour la navigation
    const navigate = useNavigate();

    // États pour gérer les valeurs des champs de formulaire
    const [email, setEmail] = useState(""); // État pour stocker l'email
    const [password, setPassword] = useState(""); // État pour stocker le mot de passe

    // Fonction pour mettre à jour l'email dans l'état
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    // Fonction pour mettre à jour le mot de passe dans l'état
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async () => {
        // Vérification que l'email et le mot de passe sont remplis
        if (email && password) {
            const response = await axios.post("site--test-backend--7g4fljlbl5js.code.run/login", { email, password });
            if (response.status === 200) {
                // Si la réponse est OK, on enregistre le token et l'ID dans les cookies et dans l'état de l'application
                if (response.data) {
                    Cookies.set("token", response.data.token);
                    Cookies.set("id", response.data._id);
                    setUser([Cookies.get("token"), Cookies.get("id")]); // Mise à jour de l'état de l'utilisateur
                    navigate('/'); // Redirection vers la page d'accueil
                }
            } else {
                alert("Erreur lors de la connexion"); // Affichage d'une erreur en cas de problème
            }
        } else {
            alert("Veuillez remplir les champs"); // Si l'email ou le mot de passe sont vides
        }
    };

    return (
        <>
            {/* Affichage du Header avec les props nécessaires */}
            <Header user={user} setUser={setUser} Cookies={Cookies} setFavoris={setFavoris}></Header>
            
            {/* Conteneur du formulaire de connexion */}
            <div className="login-container">
                <div className="formLogin-container">
                    <h1>LOGIN</h1>
                    <input type="text" value={email} onChange={handleChangeEmail} placeholder="email" />
                    <input className="password" value={password} type="password" onChange={handleChangePassword} placeholder="password" />
                    <input type="submit" onClick={handleSubmit} />
                </div>
            </div>
        </>
    );
}

export default Login;
