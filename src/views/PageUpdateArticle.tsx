import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

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

const UpdateArticle = () => {
    let { articleSlug } = useParams();
    const [Article, setArticle] = useState<Iarticle | null>(null);

    useEffect(() => {
        fetch("https://api.realworld.io/api/articles/" + articleSlug)
            .then((res) => res.json())
            .then((json) => {
                setArticle(json.article);
            })
    }, [Article, articleSlug]);

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const onSubmit = (data: object) => {
        fetch("https://api.realworld.io/api/users/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: data }) // body data type must match "Content-Type" header
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.errors) {
                    const msg: string[] = [];
                    Object.keys(json.errors).forEach(key => {
                        msg.push(`${key} ${json.errors[key][0]}`)
                    })
                }
                else {
                    navigate("/")
                }
            })

    }
    return (
        <div className="editor-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-10 offset-md-1 col-xs-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input
                                        value={Article ? Article.title : ""}
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Article Title"
                                        {...register("title", { required: true })}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <input
                                        value={Article ? Article.description : ""}
                                        type="text"
                                        className="form-control"
                                        placeholder="What's this article about?"
                                        {...register("description", { required: true })}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <textarea
                                        value={Article ? Article.body : ""}
                                        className="form-control"
                                        rows={8}
                                        placeholder="Write your article (in markdown)"
                                        {...register("body", { required: true })}
                                    ></textarea>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input
                                        value={Article ? Article.tagList?.join(',') : ""}
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter tags"
                                        {...register("tags")}
                                    />
                                    <div className="tag-list"></div>
                                </fieldset>
                                <button
                                    className="btn btn-lg pull-xs-right btn-primary"
                                    type="button"
                                >
                                    Publish Article
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UpdateArticle;
