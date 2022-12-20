import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { login } from "../features/user/userSlice";


const Register = () => {
    const [Msg, setMsg] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: object) => {
        setMsg([])
        fetch("https://api.realworld.io/api/users", {
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
                    setMsg(msg)
                }
                else {
                    console.log(json.user)
                    dispatch(login(json.user))
                    navigate("/")
                }
            })

    }

    return (
        <div className="auth-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Sign up</h1>
                        <p className="text-xs-center">
                            <Link to="/login">Have an account?</Link>
                        </p>

                        {Msg.length > 0 && <ul className="error-messages">
                            {Msg.map((msg, i) => <li key={i}>{msg}</li>)}

                        </ul>}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <fieldset className="form-group">
                                <input {...register("username", { required: true })} id="username" name="username" className="form-control form-control-lg" type="text" placeholder="Your Name" />
                                {errors.username && <span>This field is required</span>}
                            </fieldset>
                            <fieldset className="form-group">
                                <input {...register("email", { required: true })} id="email" name="email" className="form-control form-control-lg" type="text" placeholder="Email" />
                                {errors.email && <span>This field is required</span>}
                            </fieldset>
                            <fieldset className="form-group">
                                <input {...register("password", { required: true })} id="password" name="password" className="form-control form-control-lg" type="password" placeholder="Password" />
                                {errors.password && <span>This field is required</span>}
                            </fieldset>
                            <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                                Sign up
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Register