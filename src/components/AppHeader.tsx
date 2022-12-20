import { useState } from "react";
import { Link } from "react-router-dom"
import { useAppSelector } from "../app/hooks";
import { getUser } from "../features/user/userSlice";

const AppHeader = () => {
    const user = useAppSelector(getUser);
    const [active, setActive] = useState("home");

    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <Link className="navbar-brand" to="/" onClick={() => setActive("home")}>conduit</Link>
                <ul className="nav navbar-nav pull-xs-right">
                    <li className="nav-item">
                        <Link className={"nav-link " + (active === "home" ? "active" : "")} to="/" onClick={() => setActive("home")}>Home</Link>
                    </li>
                    {user.token && <>
                        <li className="nav-item">
                            <Link className={"nav-link " + (active === "article" ? "active" : "")} to="/create-article" onClick={() => setActive("article")}> <i className="ion-compose"></i>&nbsp;New Article</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (active === "settings" ? "active" : "")} to="/settings" onClick={() => setActive("settings")}> <i className="ion-gear-a"></i>&nbsp;Settings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (active === "user" ? "active" : "")} to={`/profile/${user.username}`} onClick={() => setActive("user")}>
                                <img alt={`${user.username}`} className="user-pic" src={`${user.image}`} />
                                {user.username}
                            </Link>
                        </li>
                    </>
                    }
                    {!user.token && <>
                        <li className="nav-item">
                            <Link className={"nav-link " + (active === "login" ? "active" : "")} to="login" onClick={() => setActive("login")}>Sign in</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (active === "register" ? "active" : "")} to="register" onClick={() => setActive("register")}>Sign up</Link>
                        </li>
                    </>}
                </ul>
            </div>
        </nav>
    )
}

export default AppHeader
