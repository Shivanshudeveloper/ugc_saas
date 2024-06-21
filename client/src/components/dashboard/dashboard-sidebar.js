import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Calendar as CalendarIcon } from "../../icons/calendar";
import { Cash as CashIcon } from "../../icons/cash";
import { ChartBar as ChartBarIcon } from "../../icons/chart-bar";
import { ChartPie as ChartPieIcon } from "../../icons/chart-pie";
import { ChatAlt2 as ChatAlt2Icon } from "../../icons/chat-alt2";
import { ClipboardList as ClipboardListIcon } from "../../icons/clipboard-list";
import { CreditCard as CreditCardIcon } from "../../icons/credit-card";
import { Home as HomeIcon } from "../../icons/home";
import { LockClosed as LockClosedIcon } from "../../icons/lock-closed";
import { Mail as MailIcon } from "../../icons/mail";
import { MailOpen as MailOpenIcon } from "../../icons/mail-open";
import { Newspaper as NewspaperIcon } from "../../icons/newspaper";
import { OfficeBuilding as OfficeBuildingIcon } from "../../icons/office-building";
import { ReceiptTax as ReceiptTaxIcon } from "../../icons/receipt-tax";
import { Selector as SelectorIcon } from "../../icons/selector";
import { Share as ShareIcon } from "../../icons/share";
import { ShoppingBag as ShoppingBagIcon } from "../../icons/shopping-bag";
import { ShoppingCart as ShoppingCartIcon } from "../../icons/shopping-cart";
import { Truck as TruckIcon } from "../../icons/truck";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import { Users as UsersIcon } from "../../icons/users";
import { XCircle as XCircleIcon } from "../../icons/x-circle";
import { Logo } from "../logo";
import { Scrollbar } from "../scrollbar";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { OrganizationPopover } from "./organization-popover";
import { useAuth } from "../../hooks/use-auth";
import { API_SERVICE } from "../../config";

export const DashboardSidebar = (props) => {
  const { user } = useAuth();
  console.log(user);
  const { onClose, open } = props;
  const [amount, setAmount] = useState(user?.userData?.funds?.amount);
  const [currency, setCurrency] = useState(user?.userData?.funds?.currency);

  const router = useRouter();
  const { t } = useTranslation();

  const brandSections = (t) => [
    {
      title: t("General"),
      items: [
        {
          title: t("Dashboard"),
          path: "/dashboard",
          icon: <HomeIcon fontSize="small" />,
        },
        {
          title: t("Campaigns"),
          path: "/dashboard/campaigns",
          icon: <UsersIcon fontSize="small" />,
        },
        {
          title: t("Jobs"),
          path: "/dashboard/orders",
          icon: <ChartBarIcon fontSize="small" />,
        },
        {
          title: t("Products"),
          path: "/dashboard/products",
          icon: <Inventory2Icon fontSize="small" />,
        },
        {
          title: t("All Creators"),
          path: "/dashboard/view-creators",
          icon: <UsersIcon fontSize="small" />,
        },

        // {
        //   title: t("Brand select Creator"),
        //   path: "/dashboard/creators",
        //   icon: <ClipboardListIcon fontSize="small" />,
        // },
        {
          path: "/add-funds",
          icon: <AttachMoney fontSize="small" />,
          title: t("Add Funds"),
        },
        {
          title: t("Content"),
          path: "/dashboard/content",
          icon: <ContentPasteIcon fontSize="small" />,
        },
        // {
        //   path: "/dashboard/chat",
        //   icon: <ChatAlt2Icon fontSize="small" />,
        //   title: t("Chat"),
        // },
      ],
    },
  ];

  const creatorSections = (t, hasProfile) => {
    if (hasProfile) {
      return [
        {
          title: t("General"),
          items: [
            // {
            //   title: t("Overview"),
            //   path: "/dashboard",
            //   icon: <HomeIcon fontSize="small" />,
            // },
            // {
            //   title: t("Creators Onboarding"),
            //   path: "/dashboard/onboarding",
            //   icon: <UserCircleIcon fontSize="small" />,
            // },
            {
              title: t("Jobs for Creator"),
              path: "/dashboard/jobscreator",
              icon: <ShoppingBagIcon fontSize="small" />,
            },
            {
              title: t("My Jobs"),
              path: "/dashboard/orders",
              icon: <ChartBarIcon fontSize="small" />,
            },
            {
              title: t("All Brands"),
              path: "/dashboard/view-brands",
              icon: <UsersIcon fontSize="small" />,
            },
            {
              title: t("Portfolio"),
              path: `/dashboard/portfolio?id=${user.id}`,
              icon: <UsersIcon fontSize="small" />,
            },
            // {
            //   path: "/dashboard/chat",
            //   icon: <ChatAlt2Icon fontSize="small" />,
            //   title: "Chat",
            // },
          ],
        },
      ];
    } else {
      return [
        {
          title: t("General"),
          items: [
            // {
            //   title: t("Overview"),
            //   path: "/dashboard",
            //   icon: <HomeIcon fontSize="small" />,
            // },
            {
              title: t("Onboarding"),
              path: "/dashboard/onboarding",
              icon: <UserCircleIcon fontSize="small" />,
            },
            {
              title: t("Market Place"),
              path: "/dashboard/jobscreator",
              icon: <ShoppingBagIcon fontSize="small" />,
            },
            {
              title: t("My Jobs"),
              path: "/dashboard/orders",
              icon: <ChartBarIcon fontSize="small" />,
            },
            // {
            //   path: "/dashboard/chat",
            //   icon: <ChatAlt2Icon fontSize="small" />,
            //   title: "Chat",
            // },
          ],
        },
      ];
    }
  };

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const sections = useMemo(
    () =>
      user?.userData?.userType === "brand"
        ? brandSections(t)
        : creatorSections(t, user?.creator ? true : false),
    [t]
  );
  const organizationsRef = useRef(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] =
    useState(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  // useEffect(() => {}, [
  //   user?.userData?.funds?.amount,
  //   user?.userData?.funds?.currency,
  // ]);

  useEffect(() => {
    console.log("This should print");
    handleWallet();
  }, [user?.userData?.funds?.selectedCurrency, user?.userData?.funds?.amount]);

  const handleOpenOrganizationsPopover = () => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = () => {
    setOpenOrganizationsPopover(false);
  };

  const handleWallet = async () => {
    if (user?.userData?.funds?.amount === 0) {
      setAmount(0);
      setCurrency(user?.userData?.funds?.selectedCurrency || "USD");
      return;
    }
    try {
      const response = await fetch(`${API_SERVICE}/convert-currency`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: user?.userData?.funds?.currency,
          to: user?.userData?.funds?.selectedCurrency,
          amount: user?.userData?.funds?.amount,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setAmount(data);
        setCurrency(user?.userData?.funds?.selectedCurrency);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <center>
                <NextLink href="/" passHref>
                  <a>
                    <img src="/static/cybrclik.png" alt="" width="50" />
                  </a>
                </NextLink>
              </center>
            </Box>
          </div>
          <center>
            {1 && (
              <Typography sx={{ mx: 2, mb: 2 }}>
                {`Wallet ${amount} ${currency}`}
              </Typography>
            )}
          </center>

          <Divider
            sx={{
              borderColor: "#2D3748",
              // my: 3,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  "& + &": {
                    mt: 2,
                  },
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: "#2D3748", // dark divider
            }}
          />
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            borderRightColor: "divider",
            borderRightStyle: "solid",
            borderRightWidth: (theme) =>
              theme.palette.mode === "dark" ? 1 : 0,
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
