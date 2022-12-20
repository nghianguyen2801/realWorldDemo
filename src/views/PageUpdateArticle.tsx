import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
interface IarticleForm {
    title: string, description: string, body: string, tagList: string
}

const UpdateArticle = () => {
    let { articleSlug } = useParams();
    const [Article, setArticle] = useState<Iarticle | null>(null);
    const user = useAppSelector(getUser);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IarticleForm>();
    const navigate = useNavigate();

    useEffect(() => {
        if (articleSlug)
            fetch("https://api.realworld.io/api/articles/" + articleSlug)
                .then((res) => res.json())
                .then((json) => {
                    setArticle(json.article);
                })
    }, []);

    useEffect(() => {
        // reset form with user data
        const dataForm = {
            title: Article?.title, description: Article?.description, body: Article?.body, tagList: Article?.tagList?.join(",")
        }
        reset(dataForm);
    }, [Article]);

    const onSubmit = (data: IarticleForm) => {
        const dataPost = { ...data, tagList: data.tagList.split(",") }
        const url = Article ? `https://api.realworld.io/api/articles/${Article.slug}` : "https://api.realworld.io/api/articles"
        fetch(url, {
            method: Article ? 'PUT' : 'POST',
            mode: 'cors',
            headers: {
                authorization: `Token ${user.token}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ article: dataPost })
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.errors) {
                    console.log(json.errors)
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
                            <fieldset className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Article Title"
                                    {...register("title", { required: true })}
                                    {...errors.title && <span>This field is required</span>}
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="What's this article about?"
                                    {...register("description", { required: true })}
                                    {...errors.description && <span>This field is required</span>}
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <textarea
                                    className="form-control"
                                    rows={8}
                                    placeholder="Write your article (in markdown)"
                                    {...register("body", { required: true })}
                                    {...errors.body && <span>This field is required</span>}
                                ></textarea>
                            </fieldset>
                            <fieldset className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter tags"
                                    {...register("tagList")}
                                />
                                <div className="tag-list"></div>
                            </fieldset>
                            <button
                                className="btn btn-lg pull-xs-right btn-primary"
                                type="submit"
                            >
                                Publish Article
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UpdateArticle;
