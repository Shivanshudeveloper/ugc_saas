import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/use-auth";
import firebase from "../../lib/firebase";

export const AuthGuard = (props) => {
  const { children } = props;
  const { user } = useAuth();

  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      console.log(user);

      if (!user) {
        router.push({
          pathname: "/authentication/login",
          query: { returnUrl: router.asPath },
        });
      } else if (user?.userData?.disabled) {
        router.push({
          pathname: "/account-disabled",
        });
      } else {
        setChecked(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
