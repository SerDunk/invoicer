import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Container from "./Container";
import Link from "next/link";

const Header = () => {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center">
          <p className="font-bold">
            <Link href="/dashboard">Invoicer</Link>
          </p>
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
