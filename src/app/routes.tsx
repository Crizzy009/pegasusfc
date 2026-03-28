
import { createBrowserRouter, Navigate } from "react-router-dom";
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
import { BasketballPage } from "./pages/BasketballPage";
import { TennisPage } from "./pages/TennisPage";
import { SwimmingPage } from "./pages/SwimmingPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLoginPage } from "./admin/AdminLoginPage";
import { ContentManagerPage } from "./admin/ContentManagerPage";
import { AdminAuditPage } from "./admin/AdminAuditPage";
import { AdminBackupPage } from "./admin/AdminBackupPage";
import { RegistrationsPage } from "./admin/RegistrationsPage";
import { TrialBookingsPage } from "./admin/TrialBookingsPage";
import { ContactMessagesPage } from "./admin/ContactMessagesPage";
import { ProtectedRoute } from "./admin/ProtectedRoute";

import { MediaHubPageAdmin } from "./admin/pages/MediaHubPage";
import { TrialPageAdmin } from "./admin/pages/TrialPage";
import { HallOfFamePageAdmin } from "./admin/pages/HallOfFamePage";
import { HallOfFameHome } from "./admin/pages/HallOfFameHome";
import { PartnersPageAdmin } from "./admin/pages/PartnersPage";
import { StarsPageAdmin } from "./admin/pages/StarsPage";
import { SquadPageAdmin } from "./admin/pages/SquadPage";
import { SquadHome } from "./admin/pages/SquadHome";
import { ProgramsPageAdmin } from "./admin/pages/ProgramsPage";
import { ProgramsHome } from "./admin/pages/ProgramsHome";
import { AboutPageFacilities } from "./admin/pages/AboutPageFacilities";
import { AboutHome } from "./admin/pages/AboutHome";
import { HomePageHighlights } from "./admin/pages/HomePageHighlights";
import { HomePageTeams } from "./admin/pages/HomePageTeams";
import { StarsPartnersHome } from "./admin/pages/StarsPartnersHome";
import { TrialsHome } from "./admin/pages/TrialsHome";
import { CoachesPageAdmin } from "./admin/pages/CoachesPage";
import { ManagersPageAdmin } from "./admin/pages/ManagersPage";
import { SportsPageAdmin } from "./admin/pages/SportsPage";

export const router = createBrowserRouter([
  { path: "/admin/login", element: <AdminLoginPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/content/home-teams" replace /> },
      { path: "about", element: <AboutHome /> },
      { path: "programs", element: <ProgramsHome /> },
      { path: "squad", element: <SquadHome /> },
      { path: "media", element: <MediaHubPageAdmin /> },
      { path: "coaches", element: <CoachesPageAdmin /> },
      { path: "managers", element: <ManagersPageAdmin /> },
      { path: "sports", element: <SportsPageAdmin /> },
      { path: "stars-partners", element: <StarsPartnersHome /> },
      { path: "trials", element: <TrialsHome /> },
      { path: "hall-of-fame", element: <HallOfFameHome /> },
      { path: "registrations", element: <RegistrationsPage /> },
      { path: "trial-bookings", element: <TrialBookingsPage /> },
      { path: "contact-messages", element: <ContactMessagesPage /> },
      { path: "content/home-teams", element: <HomePageTeams /> },
      { path: "content/home-highlights", element: <HomePageHighlights /> },
      { path: "content/about-facilities", element: <AboutPageFacilities /> },
      { path: "content/programs", element: <ProgramsPageAdmin /> },
      { path: "content/squad", element: <SquadPageAdmin /> },
      { path: "content/stars", element: <StarsPageAdmin /> },
      { path: "content/partners", element: <PartnersPageAdmin /> },
      { path: "content/hall-of-fame", element: <HallOfFamePageAdmin /> },
      { path: "content/media-hub", element: <MediaHubPageAdmin /> },
      { path: "content/trials", element: <TrialPageAdmin /> },
      { path: "content/:type", element: <ContentManagerPage /> },
      { path: "audit", element: <AdminAuditPage /> },
      { path: "backup", element: <AdminBackupPage /> },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "programs", element: <ProgramsPage /> },
      { path: "squad", element: <SquadPage /> },
      { path: "hall-of-fame", element: <HallOfFamePage /> },
      { path: "media", element: <MediaHubPage /> },
      { path: "stars-partners", element: <StarsPartnersPage /> },
      { path: "basketball", element: <BasketballPage /> },
      { path: "tennis", element: <TennisPage /> },
      { path: "swimming", element: <SwimmingPage /> },
      { path: "recruitment", element: <RecruitmentPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
