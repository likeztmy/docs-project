import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
// import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status = useStatus();

  const [value, setValue] = useState(title);

  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.updateById);

  // const debounceUpdate = useDebounce((newValue: string) => {
  //   if (newValue === title) return;

  //   setIsPending(true);
  //   mutate({ id, title: newValue })
  //     .then(() => {
  //       toast.success("Document title updated");
  //     })
  //     .catch(() => {
  //       toast.error("Something went wrong");
  //     })
  //     .finally(() => setIsPending(false));
  // });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success("Document title updated");
        setIsEditing(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
        setIsError(true);
      })
      .finally(() => setIsPending(false));
  };

  const showloader =
    isPending || status === "connecting" || status === "reconnecting";

  const showError = isError || status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>
          <input
            type="text"
            ref={inputRef}
            value={value}
            disabled={isPending}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      {isError && <BsCloudSlash className="size-4" />}
      {!showError && !showloader && <BsCloudCheck />}
      {showloader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};