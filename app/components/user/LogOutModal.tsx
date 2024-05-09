"use client";

import {signOut} from "next-auth/react";
import { ForwardedRef, forwardRef, RefObject } from "react";

// eslint-disable-next-line react/display-name
const LogOutModal = forwardRef((props, ref: ForwardedRef<HTMLDialogElement>) =>  {
    return (
        <dialog ref={ref} className="modal" onClick={event => event.currentTarget.close()}>
            <div className="modal-box p-8">
                <h3 className="font-bold text-xl">Log out</h3>
                <p className="py-4">Are you sure want to log out?</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-ghost hover:bg-transparent uppercase opacity-60 hover:opacity-100 px-6">Cancel</button>
                    </form>
                    <button className="btn btn-warning uppercase px-6" onClick={() => signOut({callbackUrl: "/auth"})}>
                        Log out
                    </button>
                </div>
            </div>
        </dialog>
    )
});

export default LogOutModal;