import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-12 mb-6">
      <Container className="flex justify-between items-center gap-4 text-muted-foreground">
        <p className="text-sm">Invoicer &copy; {new Date().getFullYear()}</p>
        <p className="text-sm">
          Created by SerDunk with Next.js, Xata and Clerk
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
