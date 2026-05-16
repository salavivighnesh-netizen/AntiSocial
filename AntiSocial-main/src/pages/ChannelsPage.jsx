import { Navigate } from "react-router-dom";

/** Alias route — same as Connected Platforms */
export default function ChannelsPage() {
  return <Navigate to="/connected-platforms" replace />;
}
