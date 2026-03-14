import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { SquadPage } from "./pages/SquadPage";
import { HallOfFamePage } from "./pages/HallOfFamePage";
import { MediaHubPage } from "./pages/MediaHubPage";
import { StarsPartnersPage } from "./pages/StarsPartnersPage";
import { RecruitmentPage } from "./pages/RecruitmentPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "programs", Component: ProgramsPage },
      { path: "squad", Component: SquadPage },
      { path: "hall-of-fame", Component: HallOfFamePage },
      { path: "media", Component: MediaHubPage },
      { path: "stars-partners", Component: StarsPartnersPage },
      { path: "recruitment", Component: RecruitmentPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
