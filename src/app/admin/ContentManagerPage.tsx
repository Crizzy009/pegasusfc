
import { useParams } from "react-router-dom";

export function ContentManagerPage() {
  const { type } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Content Manager</h1>
      <p>Managing content for: {type}</p>
      {/* Add content management UI here */}
    </div>
  );
}
