import clsx from "clsx";
import {
    FieldErrors,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";

interface InputProps {
    label: string,
    id: string,
    type?: string,
    required?: boolean | string,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors,
    disabled?: boolean,
}

export default function Input({ label, id, type, required, register, errors, disabled }: InputProps) {
    return (
        <div>
            <label htmlFor={id}
                   className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input type={type} id={id} autoComplete={id} disabled={disabled}
                       className={clsx("input input-bordered outline-none focus:outline-none w-full",
                           errors[ id ]?.message && "input-error",
                           disabled && "opacity-50 cursor-default",
                       )}
                       {...register(id, { required })}/>
                {errors[ id ] !== undefined && <p className="text-error text-sm pt-1">{errors[ id ]?.message?.toString()}</p>}
            </div>
        </div>
    )
}