import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Input } from "./Left";

interface SearchProps {
  register: UseFormRegister<Input>;
  onSubmit: (data: Input) => void;
  handleSubmit: UseFormHandleSubmit<Input>;
}

export default function Search({
  register,
  onSubmit,
  handleSubmit,
}: SearchProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="input input-bordered mt-6 flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          {...register("value")}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </form>
  );
}