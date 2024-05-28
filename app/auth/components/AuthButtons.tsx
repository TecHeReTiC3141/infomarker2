"use client"

import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaGithub, FaYandex, FaVk } from "react-icons/fa6";


export function GoogleSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("google", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via google");
        }
    };


    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaGoogle/>
            {/*<span className="ml-4">Continue with Google</span>*/}
        </button>
    );
}

export function YandexSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("yandex", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via github");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaYandex/>
            {/*<span className="ml-4">Continue with Github</span>*/}
        </button>
    );
}

export function VKSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("vk", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via github");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaVk/>
            {/*<span className="ml-4">Continue with Github</span>*/}
        </button>
    );
}

export function GithubSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("github", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via github");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaGithub/>
            {/*<span className="ml-4">Continue with Github</span>*/}
        </button>
    );
}