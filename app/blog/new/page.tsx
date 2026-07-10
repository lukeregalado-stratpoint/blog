import NewPostForm from "@/components/NewPostForm";
import { logoutAction } from "@/lib/actions/auth";

export default function NewPostPage() {
  return (
    <div>
      <div className="flex items-center justify-end px-4 md:px-8 pt-6">
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-gray-500 underline">
            Sign out
          </button>
        </form>
      </div>
      <NewPostForm />
    </div>
  );
}