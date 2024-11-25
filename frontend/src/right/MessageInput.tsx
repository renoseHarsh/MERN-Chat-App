import { SubmitHandler, useForm } from "react-hook-form";
import { sendMessage } from "../api/conversationsApi";

interface MessageInputProps {
  conversationId: string;
}

interface Input {
  message: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const { register, handleSubmit, reset } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = async (data) => {
    const { message: content } = data;
    await sendMessage(conversationId, content);
    reset();
  };
  return (
    <form
      className="flex h-[13%] min-h-20 items-center justify-center bg-slate-900"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-[75%]">
        <input
          type="text"
          className="input input-bordered w-full grow rounded-full bg-gray-800 placeholder:text-gray-600 focus:outline-none"
          placeholder="Type your message..."
          autoComplete="off"
          {...register("message", { required: true })}
        />
      </div>
    </form>
  );
}
