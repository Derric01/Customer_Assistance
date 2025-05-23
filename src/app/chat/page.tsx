import ChatComponent from "../../components/ChatComponent";
import AppNavigation from "../../components/AppNavigation";

export default function Page() {
  return (
    <div className="h-screen overflow-hidden">
      <AppNavigation />
      <main className="lg:pl-64">
        <ChatComponent />
      </main>
    </div>
  );
} 