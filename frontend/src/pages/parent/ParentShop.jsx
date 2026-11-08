import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ShopSection from "../../components/shop/ShopSection";

// The shop inside a family's account (parents only), so nobody has to sign out to buy.
export default function ParentShop() {
  const { user } = useAuth();
  const owner = user?.is_platform_owner === true;
  return (
    <div className="-mx-2 sm:mx-0" data-testid="parent-shop">
      <ShopSection standalone defaultEmail={user?.email || ""} inAccount
        closedNote={owner
          ? <>The public shop is switched off, so families can't see it yet. Turn it on in <Link to="/parent/command-centre/settings" className="underline font-semibold">Owner HQ → Settings</Link>, and switch products on in <Link to="/parent/command-centre/shop" className="underline font-semibold">Owner HQ → Shop</Link>.</>
          : "The shop isn't open yet. Check back soon!"} />
    </div>
  );
}
