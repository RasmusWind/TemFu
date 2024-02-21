import { LogBox } from "react-native";
import { UserDataProvider } from "./context/UserContext";
import MainComponent from "./components/MainComponent";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

export default function App() {
  return (
    <UserDataProvider>
      <MainComponent />
    </UserDataProvider>
  );
}
