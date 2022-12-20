import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useAppSelector } from "../app/hooks";
import { getUser } from "../features/user/userSlice";

interface IfilterArticles {
    tag?: string;
    author?: string;
    favorited?: string;
    limit: string;
    offset: string;
}

interface Iarticle {
    slug?: string;
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
    createdAt: string;
    updatedAt: string;
    favorited?: boolean;
    favoritesCount?: number;
    author: {
        username?: string;
        bio?: string;
        image?: string;
        following?: boolean;
    };
}

const Home = () => {
    const user = useAppSelector(getUser);
    const [active, setActive] = useState("global");
    const [Tags, setTags] = useState({
        tags: [],
        DataisLoaded: false
    });

    const [Articles, setArticles] = useState<{
        articles: Iarticle[];
        DataisLoaded: boolean;
    }>({
        articles: [],
        DataisLoaded: false
    });

    const [filterArticles, setFilter] = useState<IfilterArticles>({
        limit: "20",
        offset: "0"
    });

    useEffect(() => {
        fetch(
            "https://api.realworld.io/api/tags")
            .then((res) => res.json())
            .then((json) => {
                setTags({
                    tags: json.tags,
                    DataisLoaded: true
                });
            })
    }, [Tags.DataisLoaded]);

    const rederTags = () => {
        return Tags.DataisLoaded ? Tags.tags.map((tag, i) => <Link key={i} to="" onClick={() => {
            if (filterArticles.tag !== tag) {
                setFilter(Object.assign(filterArticles, {
                    tag,
                    limit: "20",
                    offset: "0"
                }))
                setArticles({
                    articles: [],
                    DataisLoaded: false
                })
                setActive("tag")
            }
        }} className="tag-pill tag-default">{tag}</Link>) : <p>Loading tags...</p>
    }

    useEffect(() => {
        let articlesUrl = "";
        const filter = {};
        if (user.token && active === "user") articlesUrl = "https://api.realworld.io/api/articles/feed?"
        else articlesUrl = "https://api.realworld.io/api/articles?"

        Object.keys(filterArticles).forEach(key => {
            if (filterArticles[key as keyof IfilterArticles]) {
                Object.assign(filter, { [key]: filterArticles[key as keyof IfilterArticles] });
            }
        })

        fetch(
            articlesUrl + new URLSearchParams(filter), {
            method: 'GET',
            headers: {
                authorization: user.token ? `Token ${user.token}` : ""
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setArticles({
                    articles: json.articles,
                    DataisLoaded: true
                })
            })
    }, [Articles.DataisLoaded, filterArticles, user, active])

    const favoriteAction = (slug: string) => {
        const articleChecker = Articles.articles.find(article => article.slug === slug)
        fetch(
            `https://api.realworld.io/api/articles/${slug}/favorite`, {
            method: !articleChecker?.favorited ? 'POST' : 'DELETE',
            headers: {
                authorization: user.token ? `Token ${user.token}` : ""
            }
        }).then((res) => res.json())
            .then((json) => {
                Articles.articles.map((article, i) => article.slug === json.article.slug ? Articles.articles[i] = json.article : "")
                setArticles({
                    articles: Articles.articles,
                    DataisLoaded: true
                })
            })
    }

    const renderArticles = () => {
        return Articles.DataisLoaded ?
            (Articles.articles.length >= 1
                ? Articles.articles.map((article, i) => <div key={i} className="article-preview">
                    <div className="article-meta">
                        <Link to={`profile/${article.author.username}`}><img alt={article.author.username} src={article.author.image} /></Link>
                        <div className="info">
                            <Link to={`profile/${article.author.username}`} className="author">{article.author.username}</Link>
                            <span className="date">{(new Date(article.updatedAt)).toDateString()}</span>
                        </div>
                        <button className={"btn btn-sm pull-xs-right " + (article.favorited ? "btn-primary" : "btn-outline-primary")} onClick={() => { favoriteAction(article.slug as string) }}>
                            <i className="ion-heart"></i> {article.favoritesCount}
                        </button>
                    </div>
                    <Link to={`article/${article.slug}`} className="preview-link">
                        <h1>{article.title}</h1>
                        <p>{article.description}</p>
                        <span>Read more...</span>
                        <ul className="tag-list">
                            {article.tagList && article.tagList.map((tag, i) =>
                                <li key={i} className="tag-default tag-pill tag-outline">
                                    {tag}
                                </li>
                            )}
                        </ul>
                    </Link>
                </div>)
                : <div className="article-preview"><p>No articles are here... yet.</p></div>)
            : <div className="article-preview"><p>Loading Articles...</p></div>
    }

    return (
        <div className="home-page">

            <div className="banner">
                <div className="container">
                    <h1 className="logo-font">conduit</h1>
                    <p>A place to share your knowledge.</p>
                </div>
            </div>

            <div className="container page">
                <div className="row">

                    <div className="col-md-9">
                        <div className="feed-toggle">
                            <ul className="nav nav-pills outline-active">
                                {user.token && <li className="nav-item">
                                    <Link className={"nav-link " + (active === "user" ? "active" : "")} to="" onClick={() => {
                                        if (active !== "user") {
                                            setFilter({ limit: "20", offset: "0" })
                                            setArticles({
                                                articles: [],
                                                DataisLoaded: false
                                            })
                                            setActive("user")
                                        }
                                    }}>Your Feed</Link>
                                </li>}
                                <li className="nav-item">
                                    <Link className={"nav-link " + (active === "global" ? "active" : "")} to="" onClick={() => {
                                        if (active !== "global") {
                                            setFilter({ limit: "20", offset: "0" })
                                            setArticles({
                                                articles: [],
                                                DataisLoaded: false
                                            })
                                            setActive("global")
                                        }
                                    }}>Global Feed</Link>
                                </li>
                                {
                                    filterArticles.tag &&
                                    <li className="nav-item">
                                        <Link className={"nav-link " + (active === "tag" ? "active" : "")} to="">#{filterArticles.tag}</Link>
                                    </li>
                                }
                            </ul>
                        </div>

                        {renderArticles()}

                    </div>

                    <div className="col-md-3">
                        <div className="sidebar">
                            <p>Popular Tags</p>
                            <div className="tag-list">
                                {rederTags()}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Home
