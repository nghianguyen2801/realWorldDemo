import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getUser } from "../features/user/userSlice";

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
    }
}

interface Icomment {
    id: number,
    createdAt: string,
    updatedAt: string,
    body: string,
    author: {
        username: string,
        bio: string,
        image: string,
        following: boolean
    }
}

interface icomments {
    comments: Icomment[],
    DataisLoaded: boolean
}

const Article = () => {
    const user = useAppSelector(getUser);
    const [Article, setArticle] = useState<Iarticle | null>(null);
    const [Comments, setComments] = useState<icomments>({ comments: [], DataisLoaded: false });

    let { articleSlug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://api.realworld.io/api/articles/" + articleSlug)
            .then((res) => res.json())
            .then((json) => {
                setArticle(json.article);
            })
    }, [Article, articleSlug]);

    useEffect(() => {
        fetch(
            "https://api.realworld.io/api/articles/" + articleSlug + "/comments")
            .then((res) => res.json())
            .then((json) => {
                setComments({ comments: json.comments, DataisLoaded: true });
            })
    }, [Comments.DataisLoaded, articleSlug]);

    const delArticle = () => {
        fetch(`https://api.realworld.io/api/articles/${Article?.slug}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                authorization: `Token ${user.token}`,
                'Content-Type': 'application/json'

            },
        })
            .then((res) => res.status < 400 ? navigate("/") : console.log("error"))

    }

    return (
        <div className="article-page">
            <div className="banner">
                <div className="container">
                    <h1>{Article?.title}</h1>

                    <div className="article-meta">
                        <Link to={`/profile/${Article?.author.username}`}>
                            <img alt={Article?.author.username} src={Article?.author.image} />
                        </Link>
                        <div className="info">
                            <Link to={`/profile/${Article?.author.username}`} className="author">
                                {Article?.author.username}
                            </Link>
                            <span className="date">{(new Date(Article?.createdAt || "")).toDateString()}</span>
                        </div>
                        {user.token && user.username === Article?.author.username && (<>
                            <Link className="btn btn-outline-secondary btn-sm" to={"/edit-article/" + Article?.slug}>
                                <i className="ion-edit"></i> Edit Article
                            </Link>
                            &nbsp;
                            <button className="btn btn-outline-danger btn-sm" onClick={() => delArticle()}>
                                <i className="ion-trash-a"></i> Delete Article
                            </button>
                        </>)}
                        {(!user.token || user.username !== Article?.author.username) && (<>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="ion-plus-round"></i>
                                &nbsp; Follow {Article?.author.username}
                            </button>
                            &nbsp;&nbsp;
                            <button className="btn btn-sm btn-outline-primary">
                                <i className="ion-heart"></i>
                                &nbsp; Favorite Post <span className="counter">({Article?.favoritesCount})</span>
                            </button>
                        </>)}
                    </div>
                </div>
            </div>

            <div className="container page">
                <div className="row article-content">
                    <div className="col-md-12">
                        <p>
                            {Article?.body}
                        </p>
                    </div>
                </div>

                <hr />

                <div className="article-actions">
                    <div className="article-meta">
                        <Link to={`/profile/${Article?.author.username}`}>
                            <img alt={Article?.author.username} src={Article?.author.image} />
                        </Link>
                        <div className="info">
                            <Link to={`/profile/${Article?.author.username}`} className="author">
                                {Article?.author.username}
                            </Link>
                            <span className="date">{(new Date(Article?.createdAt || "")).toDateString()}</span>
                        </div>
                        {user.token && user.username === Article?.author.username && (<>
                            <a className="btn btn-outline-secondary btn-sm" href={"/edit-article/" + Article?.slug}>
                                <i className="ion-edit"></i> Edit Article
                            </a>
                            &nbsp;
                            <button className="btn btn-outline-danger btn-sm">
                                <i className="ion-trash-a"></i> Delete Article
                            </button>
                        </>)}
                        {(!user.token || user.username !== Article?.author.username) && (<>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="ion-plus-round"></i>
                                &nbsp; Follow {Article?.author.username}
                            </button>
                            &nbsp;&nbsp;
                            <button className="btn btn-sm btn-outline-primary">
                                <i className="ion-heart"></i>
                                &nbsp; Favorite Post <span className="counter">({Article?.favoritesCount})</span>
                            </button>
                        </>)}
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-8 offset-md-2">
                        {user.token ? (<form className="card comment-form">
                            <div className="card-block">
                                <textarea
                                    className="form-control"
                                    placeholder="Write a comment..."
                                    rows={3}
                                ></textarea>
                            </div>
                            <div className="card-footer">
                                <img
                                    src="http://i.imgur.com/Qr71crq.jpg"
                                    className="comment-author-img"
                                />
                                <button className="btn btn-sm btn-primary">
                                    Post Comment
                                </button>
                            </div>
                        </form>) : (<p>
                            <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments on this article.
                        </p>)}

                        {Comments.DataisLoaded && Comments.comments.map((comment, id) =>
                            <div key={id} className="card">
                                <div className="card-block">
                                    <p className="card-text">
                                        {comment.body}
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/profile/${comment.author.username}`} className="comment-author">
                                        <img
                                            src={comment.author.image}
                                            className="comment-author-img"
                                        />
                                    </Link>
                                    &nbsp;
                                    <Link to={`/profile/${comment.author.username}`} className="comment-author">
                                        {comment.author.username}
                                    </Link>
                                    <span className="date-posted">{(new Date(comment.createdAt)).toDateString()}</span>
                                </div>
                            </div>
                        )}
                        {!Comments.DataisLoaded && <p>Loading comments...</p>}

                        {/* <div className="card">
                            <div className="card-block">
                                <p className="card-text">
                                    With supporting text below as a natural lead-in to
                                    additional content.
                                </p>
                            </div>
                            <div className="card-footer">
                                <Link to="" className="comment-author">
                                    <img
                                        src="http://i.imgur.com/Qr71crq.jpg"
                                        className="comment-author-img"
                                    />
                                </Link>
                                &nbsp;
                                <Link to="" className="comment-author">
                                    Jacob Schmidt
                                </Link>
                                <span className="date-posted">Dec 29th</span>
                                <span className="mod-options">
                                    <i className="ion-edit"></i>
                                    <i className="ion-trash-a"></i>
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Article