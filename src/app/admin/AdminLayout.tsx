
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  Bell,
  Calendar,
  ClipboardList,
  Home,
  Image,
  Info,
  LogOut,
  Mail,
  Menu,
  Package,
  Package2,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { fetchAdminContent } from "../content/api";
import type { ContactMessage, Registration, TrialBooking } from "../content/types";
import { ScrollToTop } from "../components/ScrollToTop";
import { useAdminAuth } from "./auth";

type NotificationItem = {
  id: string;
  kind: "registration" | "trialBooking" | "contactMessage";
  title: string;
  subtitle: string;
  createdAt: number;
  href: string;
  unread: boolean;
};

export function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const lastUnreadRegistrationsRef = useRef(0);
  const lastUnreadTrialBookingsRef = useRef(0);
  const lastUnreadContactMessagesRef = useRef(0);
  const latestRegistrationCreatedAtRef = useRef(0);
  const latestTrialBookingCreatedAtRef = useRef(0);
  const latestContactMessageCreatedAtRef = useRef(0);
  const [unreadRegistrations, setUnreadRegistrations] = useState(0);
  const [unreadTrialBookings, setUnreadTrialBookings] = useState(0);
  const [unreadContactMessages, setUnreadContactMessages] = useState(0);
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const REG_LAST_SEEN_KEY = "registrations_last_seen";
    const TRIAL_LAST_SEEN_KEY = "trial_bookings_last_seen";
    const CONTACT_LAST_SEEN_KEY = "contact_messages_last_seen";

    const tick = async () => {
      try {
        const [registrations, trialBookings, contactMessages] = await Promise.all([
          fetchAdminContent<Registration>({ type: "registration" }),
          fetchAdminContent<TrialBooking>({ type: "trialBooking" }),
          fetchAdminContent<ContactMessage>({ type: "contactMessage" }),
        ]);

        const regLastSeen = Number(localStorage.getItem(REG_LAST_SEEN_KEY) ?? "0");
        const trialLastSeen = Number(localStorage.getItem(TRIAL_LAST_SEEN_KEY) ?? "0");
        const contactLastSeen = Number(localStorage.getItem(CONTACT_LAST_SEEN_KEY) ?? "0");

        latestRegistrationCreatedAtRef.current = Math.max(0, ...registrations.map((i) => i.createdAt));
        latestTrialBookingCreatedAtRef.current = Math.max(0, ...trialBookings.map((i) => i.createdAt));
        latestContactMessageCreatedAtRef.current = Math.max(0, ...contactMessages.map((i) => i.createdAt));

        const unread = registrations.filter((i) => i.createdAt > regLastSeen).length;
        const unreadTrials = trialBookings.filter((i) => i.createdAt > trialLastSeen).length;
        const unreadContacts = contactMessages.filter((i) => i.createdAt > contactLastSeen).length;
        if (cancelled) return;
        setUnreadRegistrations(unread);
        setUnreadTrialBookings(unreadTrials);
        setUnreadContactMessages(unreadContacts);

        const recent: NotificationItem[] = [
          ...registrations.slice(0, 12).map((i) => ({
            id: i.id,
            kind: "registration" as const,
            title: `${i.data.playerName} • ${i.data.programTitle}`,
            subtitle: `${i.data.phone} • ${i.data.email}`,
            createdAt: i.createdAt,
            href: "/admin/registrations",
            unread: i.createdAt > regLastSeen,
          })),
          ...trialBookings.slice(0, 12).map((i) => ({
            id: i.id,
            kind: "trialBooking" as const,
            title: `${i.data.playerName} • ${i.data.ageGroup}`,
            subtitle: `${i.data.phone} • ${i.data.email}`,
            createdAt: i.createdAt,
            href: "/admin/trial-bookings",
            unread: i.createdAt > trialLastSeen,
          })),
          ...contactMessages.slice(0, 12).map((i) => ({
            id: i.id,
            kind: "contactMessage" as const,
            title: `${i.data.name} • ${i.data.subject}`,
            subtitle: i.data.email,
            createdAt: i.createdAt,
            href: "/admin/contact-messages",
            unread: i.createdAt > contactLastSeen,
          })),
        ]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 12);
        setNotifications(recent);
      } catch {
        if (cancelled) return;
        setUnreadRegistrations(0);
        setUnreadTrialBookings(0);
        setUnreadContactMessages(0);
        setNotifications([]);
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), 15000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const prev = lastUnreadRegistrationsRef.current;
    lastUnreadRegistrationsRef.current = unreadRegistrations;
    if (unreadRegistrations > 0 && unreadRegistrations > prev) {
      const diff = unreadRegistrations - prev;
      setBannerText(`New program registration${diff === 1 ? "" : "s"} received (${diff})`);
      window.setTimeout(() => setBannerText(null), 5000);
    }
  }, [unreadRegistrations]);

  useEffect(() => {
    const prev = lastUnreadTrialBookingsRef.current;
    lastUnreadTrialBookingsRef.current = unreadTrialBookings;
    if (unreadTrialBookings > 0 && unreadTrialBookings > prev) {
      const diff = unreadTrialBookings - prev;
      setBannerText(`New trial booking${diff === 1 ? "" : "s"} received (${diff})`);
      window.setTimeout(() => setBannerText(null), 5000);
    }
  }, [unreadTrialBookings]);

  useEffect(() => {
    const prev = lastUnreadContactMessagesRef.current;
    lastUnreadContactMessagesRef.current = unreadContactMessages;
    if (unreadContactMessages > 0 && unreadContactMessages > prev) {
      const diff = unreadContactMessages - prev;
      setBannerText(`New contact message${diff === 1 ? "" : "s"} received (${diff})`);
      window.setTimeout(() => setBannerText(null), 5000);
    }
  }, [unreadContactMessages]);

  const totalUnread = unreadRegistrations + unreadTrialBookings + unreadContactMessages;

  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      isActive ? "bg-muted text-primary" : "text-muted-foreground"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
      isActive ? "bg-muted text-foreground" : "text-muted-foreground"
    }`;

  const confirmLogout = async () => {
    const ok = confirm("Logout from admin panel?");
    if (!ok) return;
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <ScrollToTop />
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/admin" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Admin Panel</span>
            </Link>
            <Dialog
              open={notifOpen}
              onOpenChange={(open) => {
                setNotifOpen(open);
                if (!open) return;
                const REG_LAST_SEEN_KEY = "registrations_last_seen";
                const TRIAL_LAST_SEEN_KEY = "trial_bookings_last_seen";
                const CONTACT_LAST_SEEN_KEY = "contact_messages_last_seen";

                if (latestRegistrationCreatedAtRef.current) {
                  localStorage.setItem(REG_LAST_SEEN_KEY, String(latestRegistrationCreatedAtRef.current));
                  setUnreadRegistrations(0);
                }
                if (latestTrialBookingCreatedAtRef.current) {
                  localStorage.setItem(TRIAL_LAST_SEEN_KEY, String(latestTrialBookingCreatedAtRef.current));
                  setUnreadTrialBookings(0);
                }
                if (latestContactMessageCreatedAtRef.current) {
                  localStorage.setItem(CONTACT_LAST_SEEN_KEY, String(latestContactMessageCreatedAtRef.current));
                  setUnreadContactMessages(0);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8 relative">
                  <Bell className="h-4 w-4" />
                  {totalUnread > 0 ? (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px]">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  ) : null}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-6 text-center">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          className="w-full text-left rounded-md px-3 py-2 hover:bg-accent transition"
                          onClick={() => {
                            navigate(`${n.href}?id=${encodeURIComponent(n.id)}`);
                            setNotifOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${n.unread ? "bg-primary" : "bg-muted-foreground/40"}`}
                            />
                            <span className="font-medium truncate flex-1">{n.title}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate pl-4">
                            {n.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate("/admin/registrations");
                      setNotifOpen(false);
                    }}
                  >
                    Registrations
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate("/admin/trial-bookings");
                      setNotifOpen(false);
                    }}
                  >
                    Trial Bookings
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate("/admin/contact-messages");
                      setNotifOpen(false);
                    }}
                  >
                    Messages
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                to="/admin/content/home-teams"
                className={desktopNavClass}
                end
              >
                <Home className="h-4 w-4" />
                Homescreen
              </NavLink>
              <NavLink
                to="/admin/about"
                className={desktopNavClass}
                end
              >
                <Info className="h-4 w-4" />
                About
              </NavLink>
              <NavLink
                to="/admin/programs"
                className={desktopNavClass}
                end
              >
                <Package className="h-4 w-4" />
                Programs
              </NavLink>
              <NavLink
                to="/admin/squad"
                className={desktopNavClass}
                end
              >
                <Users className="h-4 w-4" />
                Squad
              </NavLink>
              <NavLink
                to="/admin/media"
                className={desktopNavClass}
                end
              >
                <Image className="h-4 w-4" />
                Media
              </NavLink>
              <NavLink
                to="/admin/coaches"
                className={desktopNavClass}
                end
              >
                <Users className="h-4 w-4" />
                Coaches
              </NavLink>
              <NavLink
                to="/admin/managers"
                className={desktopNavClass}
                end
              >
                <Users className="h-4 w-4" />
                Managers
              </NavLink>
              <NavLink
                to="/admin/sports"
                className={desktopNavClass}
                end
              >
                <Trophy className="h-4 w-4" />
                Sports
              </NavLink>
              <NavLink
                to="/admin/stars-partners"
                className={desktopNavClass}
                end
              >
                <Star className="h-4 w-4" />
                Stars & Partners
              </NavLink>
              <NavLink
                to="/admin/trials"
                className={desktopNavClass}
                end
              >
                <Calendar className="h-4 w-4" />
                <span className="flex-1">Trials</span>
              </NavLink>
              <NavLink
                to="/admin/trial-bookings"
                className={desktopNavClass}
                end
              >
                <Calendar className="h-4 w-4" />
                <span className="flex-1">Trial Bookings</span>
                {unreadTrialBookings > 0 ? (
                  <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                    {unreadTrialBookings}
                  </span>
                ) : null}
              </NavLink>
              <NavLink
                to="/admin/registrations"
                className={desktopNavClass}
                end
              >
                <ClipboardList className="h-4 w-4" />
                <span className="flex-1">Registrations</span>
                {unreadRegistrations > 0 ? (
                  <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                    {unreadRegistrations}
                  </span>
                ) : null}
              </NavLink>
              <NavLink
                to="/admin/contact-messages"
                className={desktopNavClass}
                end
              >
                <Mail className="h-4 w-4" />
                <span className="flex-1">Contact Messages</span>
                {unreadContactMessages > 0 ? (
                  <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                    {unreadContactMessages}
                  </span>
                ) : null}
              </NavLink>
              <NavLink
                to="/admin/hall-of-fame"
                className={desktopNavClass}
                end
              >
                <Trophy className="h-4 w-4" />
                Hall Of Fame
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {bannerText ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-sm">
              {bannerText}
            </div>
          ) : null}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <NavLink
                  to="/admin/content/home-teams"
                  className={mobileNavClass}
                  end
                >
                  <Home className="h-5 w-5" />
                  Homescreen
                </NavLink>
                <NavLink
                  to="/admin/about"
                  className={mobileNavClass}
                  end
                >
                  <Info className="h-5 w-5" />
                  About
                </NavLink>
                <NavLink
                  to="/admin/programs"
                  className={mobileNavClass}
                  end
                >
                  <Package className="h-5 w-5" />
                  Programs
                </NavLink>
                <NavLink
                  to="/admin/squad"
                  className={mobileNavClass}
                  end
                >
                  <Users className="h-5 w-5" />
                  Squad
                </NavLink>
                <NavLink
                  to="/admin/media"
                  className={mobileNavClass}
                  end
                >
                  <Image className="h-5 w-5" />
                  Media
                </NavLink>
                <NavLink
                  to="/admin/coaches"
                  className={mobileNavClass}
                  end
                >
                  <Users className="h-5 w-5" />
                  Coaches
                </NavLink>
                <NavLink
                  to="/admin/managers"
                  className={mobileNavClass}
                  end
                >
                  <Users className="h-5 w-5" />
                  Managers
                </NavLink>
                <NavLink
                  to="/admin/sports"
                  className={mobileNavClass}
                  end
                >
                  <Trophy className="h-5 w-5" />
                  Sports
                </NavLink>
                <NavLink
                  to="/admin/stars-partners"
                  className={mobileNavClass}
                  end
                >
                  <Star className="h-5 w-5" />
                  Stars & Partners
                </NavLink>
                <NavLink
                  to="/admin/trials"
                  className={mobileNavClass}
                  end
                >
                  <Calendar className="h-5 w-5" />
                  <span className="flex-1">Trials</span>
                </NavLink>
                <NavLink
                  to="/admin/trial-bookings"
                  className={mobileNavClass}
                  end
                >
                  <Calendar className="h-5 w-5" />
                  <span className="flex-1">Trial Bookings</span>
                  {unreadTrialBookings > 0 ? (
                    <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                      {unreadTrialBookings}
                    </span>
                  ) : null}
                </NavLink>
                <NavLink
                  to="/admin/registrations"
                  className={mobileNavClass}
                  end
                >
                  <ClipboardList className="h-5 w-5" />
                  <span className="flex-1">Registrations</span>
                  {unreadRegistrations > 0 ? (
                    <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                      {unreadRegistrations}
                    </span>
                  ) : null}
                </NavLink>
                <NavLink
                  to="/admin/contact-messages"
                  className={mobileNavClass}
                  end
                >
                  <Mail className="h-5 w-5" />
                  <span className="flex-1">Contact Messages</span>
                  {unreadContactMessages > 0 ? (
                    <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs">
                      {unreadContactMessages}
                    </span>
                  ) : null}
                </NavLink>
                <NavLink
                  to="/admin/hall-of-fame"
                  className={mobileNavClass}
                  end
                >
                  <Trophy className="h-5 w-5" />
                  Hall Of Fame
                </NavLink>
              </nav>
              <div className="mt-auto pt-4">
                <Button variant="outline" className="w-full" onClick={() => void confirmLogout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="ml-auto hidden md:flex items-center">
            <Button variant="outline" onClick={() => void confirmLogout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
