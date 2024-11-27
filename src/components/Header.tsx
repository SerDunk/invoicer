import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Container from "./Container";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="font-bold">
              <Link href="/dashboard">Invoicer</Link>
            </p>
            <span className="text-slate-300">/</span>
            <SignedIn>
              <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
            </SignedIn>
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
