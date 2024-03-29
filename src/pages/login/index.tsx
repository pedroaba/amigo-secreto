import { useContext, useState } from "react";
import { api } from "../../api";
import { TailSpin } from "react-loader-spinner";
import { AuthContext } from "../../context/Auth";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { GetServerSideProps } from "next";
import { verify } from "jsonwebtoken";
import { parseCookies } from "nookies";

import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import Router from "next/router";
import Footer from "../../components/Footer";

export default function Login () {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);
    const [incorrectEmail, setIncorrectEmail] = useState<boolean>(false);
    
    const { register, handleSubmit } = useForm();
    const { saveInfo } = useContext(AuthContext);

    const handleSign = (data: any) => {
        setIsLoading(true);
        api.post("/api/auth/login", {
            email: data.email,
            password: data.password
        }).then((res) => {
            if (res.data.success) { 
                saveInfo({
                    email: data.email,
                    name: res.data.user.name,
                    id: res.data.user.id,
                    token: res.data.user.token,
                    avatarUrl: res.data.user.avatarUrl
                }, data.remember);

                Router.push("/");

            }

            setIncorrectPassword(res.data.incorrectPassword);
            setIncorrectEmail(res.data.incorrectEmail);

            setIsLoading(false);

        }).catch(() => {
            setIsLoading(false);
            
        });

    }

    return (
        <main className="relative h-img-back w-screen">
            <div className={classNames("z-10 h-full w-full flex justify-center items-center", {
                'backdrop-blur': isLoading,
                'absolute': isLoading
            })}>
                <TailSpin 
                    color="#F00" 
                    height={100} 
                    width={100}
                    visible={isLoading} 
                /> 
            </div>
            <Image 
                src={"/imgs/img-background.png"}
                layout="fill"
                objectFit="fill"
                alt="Background login page, team 7 of naruto"
                priority
            />
            <div className="py-10 font-istok-web bg-white absolute w-form-login rounded-nl flex flex-col items-center justify-center right-24 top-14">
                <span className="text-default font-istok-web">Crie seu grupo e</span>
                <span className="text-dark-orange-600 font-bold text-6xl mt-6 font-istok-web">Divirta-se</span>
                <span className="text-lg mt-4 font-normal font-istok-web">Já tem Cadastro? Então faça o seu Login!</span>
                <form onSubmit={handleSubmit(handleSign)} className="w-full px-12">
                    <div>
                        <input 
                            className={classNames(
                                "border-l-st border-l-dark-orange-600 w-full border-sm border-black border-solid pl-4 mt-6 rounded-nl placeholder:text-gray-400 h-in placeholder:align-middle",
                                { 'border-red-600': incorrectEmail }
                            )}
                            {...register('email')}
                            placeholder="Email..."
                            type={"email"}
                            id="email"
                            name="email"
                            required
                        />
                        <div 
                            className={classNames(
                                "flex items-center justify-start ml-2",
                                { 'hidden': !incorrectEmail }
                            )}
                        >
                            <HiOutlineExclamationCircle className="text-red-600 mr-1" />
                            <span className="mt-0.5 text-red-600">Não encontramos sua conta</span>
                        </div>
                    </div>
                    <div>
                        <input 
                            className={classNames(
                                "border-l-st border-l-dark-orange-600 w-full border-sm border-black border-solid pl-4 mt-6 rounded-nl placeholder:text-gray-400 h-in placeholder:align-middle",
                                { 'border-red-600': incorrectPassword }
                            )} 
                            placeholder="Senha..."
                            type={"password"}
                            {...register('password')}
                            id="password" 
                            name="password" 
                            required
                        />
                        <div 
                            className={classNames(
                                "flex items-center justify-start ml-2",
                                { 'hidden': !incorrectPassword }
                            )}
                        >
                            <HiOutlineExclamationCircle className="text-red-600 mr-1" />
                            <span className="mt-0.5 text-red-600 text-xs w-11/12">
                                Senha incorreta. Tente novamente ou clique em “Esqueci minha senha”
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center align-middle mt-6">
                        <input 
                            className="w-6 h-6 hover:cursor-pointer active:cursor-default" 
                            type={"checkbox"} 
                            {...register('remember')}
                            id="remember" 
                            name="remember" 
                        />
                        <label className="text-dark-orange-600 mt-1 ml-3">Lembre-se de mim</label>
                    </div>
                    <button 
                        className="w-full h-log bg-dark-blue-600 mt-3 rounded-nl text-2xl align-middle p-0 font-istok-web text-dark-orange-600 hover:opacity-90 active:scale-90"
                        type="submit"
                    >
                        LOGIN
                    </button>
                </form>
                <Link href="/">
                    <a className="text-base text-dark-orange-600 mt-6 font-istok-web">Esqueci minha senha</a>
                </Link>
                <Link href="/register">
                    <a className="text-dark-blue-600 font-istok-web font-bold text-2xl mt-4">Cadastrar</a>
                </Link>
            </div>
            <Footer />
        </main>
    );

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { 'nextauth.token': token } = await parseCookies(ctx);

    if (token)
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }

    return {
      props: {
      }
    }    

}
