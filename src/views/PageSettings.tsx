import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUser, login, logout } from "../features/user/userSlice";

interface IUserForm {
    email: string, password: string, username: string, bio: string, image: string
}

const Settings = () => {
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<IUserForm>({
        defaultValues: {
            bio: user.bio,
            email: user.email,
            image: user.image,
            username: user.username,
        }
    });

    const logOut = () => {
        dispatch(logout())
        navigate("/")
    }

    const onSubmit = (data: IUserForm) => {
        fetch("https://api.realworld.io/api/user", {
            method: 'PUT',
            mode: 'cors',
            headers: {
                authorization: `Token ${user.token}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ user: data })
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.errors) {
                    console.log(json.errors)
                }
                else {
                    dispatch(login(json.user))
                    navigate("/")
                }
            })

    }

    return (
        <div className="settings-page">
            <div className="container page">
                <div className="row">

                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Your Settings</h1>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input {...register("image", { required: true })} className="form-control" type="text" placeholder="URL of profile picture" />
                                    {errors.image && <span>This field is required</span>}
                                </fieldset>
                                <fieldset className="form-group">
                                    <input {...register("username", { required: true })} className="form-control form-control-lg" type="text" placeholder="Your Name" />
                                    {errors.image && <span>This field is required</span>}
                                </fieldset>
                                <fieldset className="form-group">
                                    <textarea {...register("bio")} className="form-control form-control-lg" rows={8}
                                        placeholder="Short bio about you"></textarea>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input {...register("email", { required: true })} className="form-control form-control-lg" type="text" placeholder="Email" />
                                    {errors.image && <span>This field is required</span>}
                                </fieldset>
                                <fieldset className="form-group">
                                    <input {...register("password")} className="form-control form-control-lg" type="password" placeholder="Password" />
                                </fieldset>
                                <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                                    Update Settings
                                </button>
                            </fieldset>
                        </form>
                        <hr />
                        <button className="btn btn-outline-danger" onClick={() => logOut()}>Or click here to logout.</button>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Settings