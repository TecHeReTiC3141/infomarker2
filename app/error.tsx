"use client"

import { useEffect } from 'react';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [ error ]);

    return (
        <main className="flex min-h-full flex-col items-center justify-center gap-4">
            <h2 className="text-center bg-error rounded-md p-2 alert-error">Что-то пошло не так</h2>
            <button
                className="btn btn-primary"
                onClick={
                    () => reset()
                }
            >
                Перезагрузить страницу
            </button>
        </main>
    );
}